const CategoryModel = require("../Models/CategoryModel");

const getAllCategories = async (req, res) => {
    try {
        const data = await CategoryModel.find();
        if (!data || data.length === 0) {
            return res.status(400).json({ message: "No Data Found" });
        }
        return res.status(200).json({ data: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

module.exports = {
    getAllCategories,
};