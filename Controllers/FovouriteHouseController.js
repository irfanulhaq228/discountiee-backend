const favouriteHouseModel = require("../Models/FavouriteHouseModel");
const homeForRentModel = require("../Models/HomeForRentModel");
const homeForSaleModel = require("../Models/HomeForSaleModel");

const getAllUsersFavouriteHouse = async(req, res) => {
    try{
        const data = await favouriteHouseModel.find();
        if(data?.length === 0){
            return res.status(400).json({ message: "No Data Found" });
        }
        return res.status(200).json({ message: data });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const createUserFavouriteHouse = async(req, res) => {
    try{
        const { userId, housesId } = req.body;
        const isExists = await favouriteHouseModel.findOne({ userId });
        if(!isExists){
            const newData = await favouriteHouseModel(req.body);
            newData.save();
            return res.status(200).json({ message: newData });
        }else{
            isExists.housesId =  housesId;
            const updateData = await favouriteHouseModel.findByIdAndUpdate(isExists?._id, isExists);
            return res.status(200).json({ message: updateData });
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const getUserFavouriteHouse = async(req, res) => {
    try{
        const { id } = req.params;
        const data = await favouriteHouseModel.findOne({ userId: id });
        if(!data){
            return res.status(400).json({ message: "No Data Found" });
        };
        return res.status(200).json({ message: data });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const getFavouriteHousesInfo = async(req, res) => {
    try{
        const { favouriteHouses } = req.body;
        const rentalHomesData = await homeForRentModel.find({ _id: { $in: favouriteHouses } });
        const saleHomesData = await homeForSaleModel.find({ _id: { $in: favouriteHouses } });
        return res.status(200).json({ message: rentalHomesData.concat(saleHomesData) });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
}

module.exports = {
    getAllUsersFavouriteHouse,
    createUserFavouriteHouse,
    getUserFavouriteHouse,
    getFavouriteHousesInfo
}