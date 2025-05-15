const HomeByOwnerModel = require("../Models/HomeByOwnerModel");

const GetAllHomesByOwner = async (req, res) => {
    try {
        const data = await HomeByOwnerModel.find();
        if (data?.length === 0) {
            return res.status(400).json({ message: "No Data Found" })
        }
        return res.status(400).json({ message: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" })
    }
};

const CreateHomeByOwner = async(req, res) => {
    try {
        const { location } = req.body;
        req.body.location = JSON.parse(location);
        const images = [];
        req.files?.map((file) => {
            images.push(file.filename);
        })
        req.body.images = images;
        const data = await new HomeByOwnerModel(req.body);
        data.save();
        if(!data){
            return res.status(400).json({ message: "Data not Saved" })
        }
        return res.status(200).json({ message: "Data Saved Successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" })
    }
};

module.exports = {
    GetAllHomesByOwner,
    CreateHomeByOwner
}