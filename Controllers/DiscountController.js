const discountModel = require("../Models/DiscountModel.js");

const getAllDiscount = async (req, res) => {
    try {
        const data = await discountModel.find();
        if (data?.length === 0) {
            return res.status(400).json({ message: "no Data Found" })
        };
        return res.status(200).json({ message: "Data Fetched Successfully", data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" })
    }
};

const getDiscountByBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await discountModel.find({ brand: id });
        if (data?.length === 0) {
            return res.status(400).json({ message: "no Data Found" })
        };
        return res.status(200).json({ message: "Data Fetched Successfully", data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" })
    }
};

const createDiscount = async (req, res) => {
    try {
        await discountModel.create(req.body);
        return res.status(200).json({ message: "Discount created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" })
    }
};

const getDiscountById = async (req, res) => {
    try {
        const { id } = req.params;

        const discount = await discountModel.findById(id);

        if (!discount) {
            return res.status(404).json({ message: "Discount not found" });
        }

        return res.status(200).json({ message: "Discount fetched successfully", data: discount });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

const updateDiscountById = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedDiscount = await discountModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedDiscount) {
            return res.status(404).json({ message: "Discount not found" });
        }

        return res.status(200).json({ message: "Brand updated successfully", data: updatedDiscount });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

module.exports = {
    getAllDiscount,
    getDiscountByBrand,
    createDiscount,
    getDiscountById,
    updateDiscountById
};
