const homeForRentModel = require("../Models/HomeForRentModel");

const getHomesForRent = async (req, res) => {
    try {
        const data = await homeForRentModel.find().populate({
            path: 'agent',
            select: '_id name email address status'
        });
        if (data?.length === 0) {
            return res.status(400).json({ message: "No Data Found For Rent" })
        }
        return res.status(200).json({ message: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" })
    }
};

const createHomesForRent = async (req, res) => {
    try {
        req.body.nearbyAddresses = JSON.parse(req.body.nearbyAddresses);
        req.body.location = JSON.parse(req.body.location);
        req.body.images = req.files.images.map((file) => file.filename);
        req.body.video = req.files.video[0].filename;
        const newHome = await homeForRentModel.create(req.body);
        return res.status(200).json({ message: newHome });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const getRentalHomeById = async (req, res) => {
    try{
        const { id } = req.params;
        const rentalHome = await homeForRentModel.findById(id);
        if(!rentalHome){
            return res.status(400).json({ message: "No Data Found" });
        }
        const loc = rentalHome?.location.coordinates;
        const filteredRentalHomes = await homeForRentModel.aggregate([
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
                    _id: { $ne: rentalHome._id }
                }
            },
            {
                $match: {
                    status: true
                }
            }
        ]);
        const responseMessage = {
            rentalHome: rentalHome,
            nearbyHouses: filteredRentalHomes
        };

        return res.status(200).json({ message: responseMessage });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const deleteRentalHomeById = async(req, res) => {
    try{
        const { id } = req.params;
        const rentalHome = await homeForRentModel.findByIdAndDelete(id);
        if(!rentalHome){
            return res.status(400).json({ message: "No Data Found" })
        }
        return res.status(200).json({ message: "Data is Deleted" });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const updateRentalHomeById = async(req, res) => {
    try{
        const { id } = req.params;
        console.log(id);
        return res.status(200).json({ message: "Data is Updated" });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const approvedRentalHomes = async(req, res) => {
    try{
        const data = await homeForRentModel.find({ status: true }).populate({
            path: 'agent',
            select: '_id name email address status'
        });
        if(data?.length === 0){
            return res.status(400).json({ message: "No Data Found For Rent" })
        }
        return res.status(200).json({ message: data });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const getRentalHomesByAgentId = async(req, res) => {
    try{
        const { id } = req.params;
        const data = await homeForRentModel.find({ agent: id });
        if(data?.length === 0){
            return res.status(400).json({ message: "No Data Found For Rent" })
        }
        return res.status(200).json({ message: data });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const getApprovedRentalHomesByAgentId = async(req, res) => {
    try{
        const { id } = req.params;
        const data = await homeForRentModel.find({ agent: id, status: true });
        if(data?.length === 0){
            return res.status(400).json({ message: "No Data Found For Rent" })
        }
        return res.status(200).json({ message: data });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

module.exports = {
    getHomesForRent,
    createHomesForRent, 
    getRentalHomeById, 
    deleteRentalHomeById, 
    updateRentalHomeById,
    approvedRentalHomes,
    getRentalHomesByAgentId,
    getApprovedRentalHomesByAgentId
};