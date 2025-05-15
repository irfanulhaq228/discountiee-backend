const homeForSaleModel = require("../Models/HomeForSaleModel");

const getHomesForSale = async (req, res) => {
    try {
        const data = await homeForSaleModel.find().populate({
            path: 'agent',
            select: '_id name email address status'
        });
        if (data?.length === 0) {
            return res.status(400).json({ message: "No Data Found For Sale" })
        }
        return res.status(200).json({ message: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" })
    }
};

const createHomesForSale = async (req, res) => {
    try {
        req.body.nearbyAddresses = JSON.parse(req.body.nearbyAddresses);
        req.body.location = JSON.parse(req.body.location);
        req.body.images = req.files.images.map((file) => file.filename);
        req.body.video = req.files.video[0].filename;
        const newHome = await homeForSaleModel.create(req.body);
        return res.status(200).json({ message: newHome });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const getSaleHomeById = async (req, res) => {
    try{
        const { id } = req.params;
        const sellHome = await homeForSaleModel.findById(id);
        if(!sellHome){
            return res.status(400).json({ message: "No Data Found" });
        }
        const loc = sellHome?.location.coordinates;
        const filteredSellHomes = await homeForSaleModel.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [loc[0], loc[1]] },
                    key: "location",
                    maxDistance: 4000,
                    distanceField: "dist.calculated",
                    spherical: true
                }
            },
            {
                $match: {
                    _id: { $ne: sellHome._id }
                }
            },
            {
                $match: {
                    status: true
                }
            }
        ]);
        const responseMessage = {
            sellHome: sellHome,
            nearbyHouses: filteredSellHomes
        };

        return res.status(200).json({ message: responseMessage });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const deleteSaleHomeById = async (req, res) => {
    try {
        const { id } = req.params;
        const saleHome = await homeForSaleModel.findByIdAndDelete(id);
        if (!saleHome) {
            return res.status(400).json({ message: "No Data Found" })
        }
        return res.status(200).json({ message: "Data is Deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const updateSaleHomeById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        return res.status(200).json({ message: "Data is Updated" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const approvedSaleHomes = async(req, res) => {
    try{
        const data = await homeForSaleModel.find({ status: true }).populate({
            path: 'agent',
            select: '_id name email address status'
        });
        if(data?.length === 0){
            return res.status(400).json({ message: "No Data Found For Sale" })
        }
        return res.status(200).json({ message: data });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const getSaleHomesByAgentId = async(req, res) => {
    try{
        const { id } = req.params;
        const data = await homeForSaleModel.find({ agent: id });
        if(data?.length === 0){
            return res.status(400).json({ message: "No Data Found For Sale" })
        }
        return res.status(200).json({ message: data });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const getApprovedSaleHomesByAgentId = async(req, res) => {
    try{
        const { id } = req.params;
        const data = await homeForSaleModel.find({ agent: id, status: true });
        if(data?.length === 0){
            return res.status(400).json({ message: "No Data Found For Sale" })
        }
        return res.status(200).json({ message: data });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

module.exports = {
    getHomesForSale,
    createHomesForSale,
    getSaleHomeById,
    deleteSaleHomeById,
    updateSaleHomeById,
    approvedSaleHomes,
    getSaleHomesByAgentId,
    getApprovedSaleHomesByAgentId
}