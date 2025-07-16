const brandModel = require("../Models/BrandModal.js");
const { transporter } = require("../Nodemailer/Nodemailer.js");

function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

const getAllBrands = async (req, res) => {
    try {
        const query = { ...req.query };

        if (query.status !== undefined) {
            query.status = query.status === 'true';
        }

        if (query.category) {
            const categories = Array.isArray(query.category) ? query.category : query.category.split(",");
            query.category = { $in: categories };
        }

        if (query.cities) {
            let parsedCities = [];

            try {
                parsedCities = JSON.parse(query.cities);
            } catch (err) {
                return res.status(400).json({ message: "Invalid cities format. Should be JSON stringified array." });
            }

            if (Array.isArray(parsedCities) && parsedCities.length > 0) {
                query.city = { $in: parsedCities };
            }
        }

        delete query.cities;

        const data = await brandModel.find(query).select("-password");

        if (!data.length) {
            return res.status(400).json({ message: "No data found" });
        }

        return res.status(200).json({ message: "Data fetched successfully", data });
    } catch (error) {
        console.error("getAllBrands error:", error);
        return res.status(500).json({ message: "Server error!" });
    }
};

const getUniqueCitiesFromBrand = async (req, res) => {
    try {
        const uniqueCities = await brandModel.distinct("city");
        return res.status(200).json({ cities: uniqueCities });
    } catch (error) {
        console.log("getUniqueCitiesFromBrand", error);
        return res.status(500).json({ message: "Server error!", error });
    }
}

const createBrand = async (req, res) => {
    try {
        const { email, phone } = req.body;

        const existingBrand = await brandModel.findOne({ $or: [{ email }, { phone }] });
        if (existingBrand) {
            return res.status(400).json({ message: "Brand Already Registered" });
        };

        let brandData = { ...req.body };
        if (req.file) {
            brandData.logo = req.file.path;
        };

        const brand = await brandModel.create(brandData);
        const brandObject = brand.toObject();
        delete brandObject.password;

        return res.status(200).json({ message: "Brand created successfully", data: brandObject });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

const loginBrand = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!password || !email) {
            return res.status(400).json({ message: "Email or password are required" });
        }

        const brand = await brandModel.findOne({ email, password }).select("-password");
        if (!brand) {
            return res.status(400).json({ message: "Invalid Credentials" });
        };

        return res.status(200).json({ message: "Brand LoggedIn Successfully", data: brand });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;

        const brand = await brandModel.findById(id).select("-password");

        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        return res.status(200).json({ message: "Brand fetched successfully", data: brand });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

const updateBrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, password } = req.body;
        const brand = await brandModel.findById(id);

        const updateData = { ...req.body };

        if (req.file) {
            updateData.logo = req.file.path;
        }

        if (oldPassword && password) {
            if (oldPassword !== brand.password) {
                return res.status(400).json({ message: "Old password is incorrect" });
            }
        }

        const updatedBrand = await brandModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select("-password");

        if (!updatedBrand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        return res.status(200).json({
            message: "Brand updated successfully",
            data: updatedBrand
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const existingBrand = await brandModel.findOne({ email });

        if (!existingBrand) return res.status(400).json({ message: "Email Not Found" });

        const otp = generateOTP();

        const info = await transporter.sendMail({
            from: 'help.discountiee@gmail.com',
            to: email,
            subject: `OTP for Reset Password`,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f9f9f9; padding: 40px; border-radius: 8px;">
                    <h2 style="color: #12b7b7; margin-bottom: 20px;">Your OTP Code</h2>
                    <div style="font-size: 48px; font-weight: bold; color: #333; letter-spacing: 12px; margin: 30px 0;">
                        ${otp}
                    </div>
                    <p style="margin-top: 30px; font-size: 14px; color: #555;">
                        Please use the above One-Time Password (OTP) to reset your password.
                        This code is valid for the next 10 minutes.
                    </p>
                    <div style="margin-top: 60px; font-size: 16px; color: #888;">
                        &mdash; Discountiee
                    </div>
                </div>
            `
        });

        if (info?.messageId) {
            await brandModel.findByIdAndUpdate(existingBrand._id, { otp });
            return res.status(200).json({ message: "OTP Sent Successfully" });
        } else {
            return res.status(200).json({ message: "Message Failed" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { otp, email } = req.body;
        if (!otp || !email) {
            return res.status(400).json({ message: "Fields is required" });
        }

        const existingBrand = await brandModel.findOne({ email });
        if (!existingBrand) return res.status(400).json({ message: "Email Not Found" });

        if (existingBrand?.otp != otp) {
            return res.status(400).json({ message: "Incorrect OTP" });
        } else {
            return res.status(200).json({ message: "Email Verified" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { password, email } = req.body;
        if (!password || !email) {
            return res.status(400).json({ message: "Fields is required" });
        };

        const existingBrand = await brandModel.findOne({ email });
        if (!existingBrand) return res.status(400).json({ message: "Email Not Found" });

        await brandModel.findByIdAndUpdate(existingBrand?._id, { password });
        return res.status(200).json({ message: "Password Reset Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

const portfolioEmail = async (req, res) => {
    try {
        const { email, name, message } = req.body;
        if (!email || !name || !message) return res.status(400).json({ message: "Email is required" });

        const info = await transporter.sendMail({
            from: email,
            to: 'irfanulhaq228@gmail.com',
            subject: `New Message from Portfolio Website`,
            html: `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
      <div style="max-width: 600px; margin: auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #12b7b7; text-align: center; margin-bottom: 20px;">New Portfolio Inquiry</h2>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Name:</strong> ${name}</p>
        <p style="font-size: 16px; margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
        <p style="font-size: 16px; margin-top: 20px;"><strong>Message:</strong></p>
        <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin-top: 10px; color: #333; font-size: 15px;">
          ${message}
        </div>
        <p style="margin-top: 40px; font-size: 14px; color: #888; text-align: center;">
          — Portfolio Website Notification
        </p>
      </div>
    </div>
  `
        });

        if (info?.messageId) {
            return res.status(200).json({ message: "Message Send" });
        } else {
            return res.status(200).json({ message: "Message Failed" });
        };
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

module.exports = {
    sendOTP,
    getAllBrands,
    createBrand,
    verifyOTP,
    loginBrand,
    getBrandById,
    portfolioEmail,
    updatePassword,
    updateBrandById,
    getUniqueCitiesFromBrand
};
