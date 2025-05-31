const brandModel = require("../Models/BrandModal.js");

const getAllBrands = async (req, res) => {
    try {
        const query = { ...req.query };

        if (query.status !== undefined) {
            query.status = query.status === 'true';
        }

        if (query.category) {
            const categories = Array.isArray(query.category)
                ? query.category
                : query.category.split(",");

            query.category = { $in: categories };
        }

        const data = await brandModel.find(query).select("-password");

        if (!data.length) {
            return res.status(400).json({ message: "No data found" });
        }

        return res.status(200).json({ message: "Data fetched successfully", data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error!" });
    }
};

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


module.exports = {
    getAllBrands,
    createBrand,
    loginBrand,
    getBrandById,
    updateBrandById
};
