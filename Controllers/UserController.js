const userModel = require("../Models/UserModel.js");
const jwt = require("jsonwebtoken");
const { transporter } = require("../Nodemailer/Nodemailer.js");
const homeForRentModel = require("../Models/HomeForRentModel.js");
const homeForSaleModel = require("../Models/HomeForSaleModel.js");

const getAllUser = async (req, res) => {
    try {
        const data = await userModel.find();
        if (data?.length === 0) {
            return res.status(400).json({ message: "no Data Found" })
        };
        return res.status(200).json({ message: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" })
    }
};

const createUser = async (req, res) => {
    try {
        const { email } = req.body;
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '30d' });
        res.cookie(
            'auth',
            token,
            {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            }
        );
        const user = await userModel.create({ ...req.body, token }).select("_id email name token");
        return res.status(200).json({ message: "User created successfully", user, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" })
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email, password }).select("_id email name token");
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }
        return res.status(200).json({ message: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { editFor } = req.body;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(400).json({ message: "No Data Found" });
        }
        var updateUser = {}
        if (editFor === "name") {
            updateUser = await userModel.findByIdAndUpdate(id, { name: req.body.name }).select("_id email name token");
        } else if (editFor === "email") {
            updateUser = await userModel.findByIdAndUpdate(id, { email: req.body.email }).select("_id email name token");
        } else {
            const { prevPassword } = req.body;
            if (prevPassword !== user?.password) {
                return res.status(400).json({ message: "Enter Correct Previous Password" });
            }
            updateUser = await userModel.findByIdAndUpdate(id, { password: req.body.password }).select("_id email name token");
        }
        return res.status(200).json({ message: updateUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(400).json({ message: "No Data Found" }).select("_id email name token");
        }
        return res.status(200).json({ message: user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

const contactAgent = async (req, res) => {
    try {
        var house = {};
        if (!req.body.houseType && !req.body.houseId) {
            const info = await transporter.sendMail({
                from: req.body.email,
                to: req?.body?.agentEmail,
                subject: `Contact by ${req.body.name} to You`,
                html: `
                    <div style="margin: 0; background-color: rgba(18, 183, 183, 0.128); padding: 10px; border-radius: 5px">
                        <p style="font-size: 20px; margin: 0; padding: 0; font-weight: 600">New Message</p>
                        <table style="width: 100%; border: 1; margin: 5px 0">
                            <tr>
                                <td style="width: 100px">Name</td>
                                <td>${req.body.name}</td>
                            </tr>
                            <tr>
                                <td style="width: 100px">Email</td>
                                <td>${req.body.email}</td>
                            </tr>
                            <tr>
                                <td style="width: 100px">Phone Number</td>
                                <td>${req.body.phone}</td>
                            </tr>
                            <tr>
                                <td style="width: 100px">Message</td>
                                <td>${req.body.message}</td>
                            </tr>
                        </table>
                    </div>
                `
            });
            if (info?.messageId) {
                return res.status(200).json({ message: "Message Forward Successfully" });
            } else {
                return res.status(200).json({ message: "Message Failed" });
            }
        } else {
            if (req.body.houseType === "rent") {
                house = await homeForRentModel.findById(req.body.houseId).populate({
                    path: "agent",
                    select: "name email phoneNumber"
                });
            } else {
                house = await homeForSaleModel.findById(req.body.houseId).populate({
                    path: "agent",
                    select: "name email phoneNumber"
                });
            };
            if (!house) {
                return res.status(400).json({ message: "House is undefined" })
            }
            const info = await transporter.sendMail({
                from: req.body.email,
                to: house?.agent?.email,
                subject: `Contact by ${req.body.name} to You`,
                html: `
                    <div style="margin: 0; background-color: rgba(18, 183, 183, 0.128); padding: 10px; border-radius: 5px">
                        <p style="font-size: 20px; margin: 0; padding: 0; font-weight: 600">New Message</p>
                        <table style="width: 100%; border: 1; margin: 5px 0">
                            <tr>
                                <td style="width: 100px">Name</td>
                                <td>${req.body.name}</td>
                            </tr>
                            <tr>
                                <td style="width: 100px">Email</td>
                                <td>${req.body.email}</td>
                            </tr>
                            <tr>
                                <td style="width: 100px">Phone Number</td>
                                <td>${req.body.phone}</td>
                            </tr>
                            <tr>
                                <td style="width: 100px">Message</td>
                                <td>${req.body.message}</td>
                            </tr>
                        </table>
                        <p style="font-size: 20px; margin: 0; padding: 0; font-weight: 600; margin-top: 10px">Selected House Details:</p>
                        <table style="width: 100%; border: 1; margin-top: 5px">
                            <tr>
                                <td style="width: 75px">House Type</td>
                                <td>${house?.salePrice ? "For Sale" : "For Rent"}</td>
                            </tr>
                            <tr>
                                <td style="width: 75px">Bedrooms</td>
                                <td>${house?.bedrooms}</td>
                            </tr>
                            <tr>
                                <td style="width: 75px">Bathrooms</td>
                                <td>${house?.bathrooms}</td>
                            </tr>
                            <tr>
                                <td style="width: 75px">Sqft</td>
                                <td>${house?.sqft} sqft</td>
                            </tr>
                            <tr>
                                <td style="width: 70px">Address</td>
                                <td>${house?.address}</td>
                            </tr>
                        </table>
                    </div>
                `
            });
            if (info?.messageId) {
                return res.status(200).json({ message: "Message Forward Successfully" });
            } else {
                return res.status(200).json({ message: "Message Failed" });
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

const requestTour = async (req, res) => {
    try {
        console.log(req.body);
        var house = {};
        if (req.body.houseType === "rent") {
            house = await homeForRentModel.findById(req.body.houseId).populate({
                path: "agent",
                select: "name email phoneNumber"
            });
        } else {
            house = await homeForSaleModel.findById(req.body.houseId).populate({
                path: "agent",
                select: "name email phoneNumber"
            });
        };
        if (!house) {
            return res.status(400).json({ message: "House is undefined" })
        }
        const info = await transporter.sendMail({
            from: req.body.email,
            to: house?.agent?.email,
            subject: `Contact by ${req.body.name} to You`,
            html: `
                <div style="margin: 0; background-color: rgba(18, 183, 183, 0.128); padding: 10px; border-radius: 5px">
                    <p style="font-size: 20px; margin: 0; padding: 0; font-weight: 600">New Request for Tour</p>
                    <table style="width: 100%; border: 1; margin: 5px 0">
                        <tr>
                            <td style="width: 100px">Name</td>
                            <td>${req.body.name}</td>
                        </tr>
                        <tr>
                            <td style="width: 100px">Email</td>
                            <td>${req.body.email}</td>
                        </tr>
                        <tr>
                            <td style="width: 100px">Phone Number</td>
                            <td>${req.body.phone}</td>
                        </tr>
                        <tr>
                            <td style="width: 100px">Message</td>
                            <td>${req.body.message}</td>
                        </tr>
                        <tr>
                            <td style="width: 100px">Tour Date</td>
                            <td>${req.body.selectedDate?.day} - ${req.body.selectedDate?.date}</td>
                        </tr>
                        <tr>
                            <td style="width: 100px">Time</td>
                            <td>${req.body.selectTime}</td>
                        </tr>
                    </table>
                    <p style="font-size: 20px; margin: 0; padding: 0; font-weight: 600; margin-top: 10px">Selected House Details:</p>
                    <table style="width: 100%; border: 1; margin-top: 5px">
                        <tr>
                            <td style="width: 75px">House Type</td>
                            <td>${house?.salePrice ? "For Sale" : "For Rent"}</td>
                        </tr>
                        <tr>
                            <td style="width: 75px">Bedrooms</td>
                            <td>${house?.bedrooms}</td>
                        </tr>
                        <tr>
                            <td style="width: 75px">Bathrooms</td>
                            <td>${house?.bathrooms}</td>
                        </tr>
                        <tr>
                            <td style="width: 75px">Sqft</td>
                            <td>${house?.sqft} sqft</td>
                        </tr>
                        <tr>
                            <td style="width: 70px">Address</td>
                            <td>${house?.address}</td>
                        </tr>
                    </table>
                </div>
            `
        });
        if (info?.messageId) {
            return res.status(200).json({ message: "Message Forward Successfully" });
        } else {
            return res.status(200).json({ message: "Message Failed" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

const connectWithLocalAgent = async (req, res) => {
    try {
        const { email, phone } = req.body;
        const info = await transporter.sendMail({
            from: email,
            to: "digitologies2024@gmail.com",
            subject: "Connect For Finding Local Agent",
            text: "Connect For Finding Local Agent",
            html: `
                <div style="margin: 0; background-color: rgba(18, 183, 183, 0.128); padding: 10px; border-radius: 5px">
                    <p style="font-size: 20px; margin: 0; padding: 0; font-weight: 600">User Information</p>
                    <table style="width: 100%; border: 1; margin: 5px 0">
                        <tr>
                            <td style="width: 100px">Email</td>
                            <td>${email}</td>
                        </tr>
                        <tr>
                            <td style="width: 100px">Phone</td>
                            <td>${phone}</td>
                        </tr>
                    </table>
                </div>
            `
        });
        if (info?.messageId) {
            return res.status(200).json({ message: "Message Forward Successfully" });
        } else {
            return res.status(200).json({ message: "Message Failed" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

module.exports = {
    getAllUser,
    createUser,
    loginUser,
    editUser,
    getUserById,
    contactAgent,
    requestTour,
    connectWithLocalAgent
};
