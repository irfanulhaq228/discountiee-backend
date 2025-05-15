const homeForRentModel = require("../Models/HomeForRentModel.js");
const homeForSaleModel = require("../Models/HomeForSaleModel.js");

const getAllHomes = async(req, res) => {
    try{
        const rentalData = await homeForRentModel.find({ status: true }).populate({
            path: 'agent',
            select: '_id name email address status'
        });
        const saleData = await homeForSaleModel.find({ status: true }).populate({
            path: 'agent',
            select: '_id name email address status'
        });
        const updatedRentalData = rentalData.map(item => ({ ...item.toObject(), listType: "forRent" }));
        const updatedSaleData = saleData.map(item => ({ ...item.toObject(), listType: "forSale" }));
        const allData = updatedRentalData.concat(updatedSaleData);
        return res.status(200).json({ message: allData });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
}

module.exports = {
    getAllHomes
}