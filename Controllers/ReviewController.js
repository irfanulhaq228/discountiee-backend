const ReviewModel = require("../Models/ReviewModel");

const getAllReviews = async(req, res) => {
    try{
        const data = await ReviewModel.find();
        if(data.length === 0){
            return res.status(400).json({ message: "No Review Found" });
        }
        return res.status(200).json({ message: data });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const createReview = async (req, res) => {
    try {
        const data = await new ReviewModel(req.body);
        await data.validate();

        const savedData = await data.save();
        return res.status(200).json({ message: savedData });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (const field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        }
        console.log("network ========> ", error);
        return res.status(500).json({ message: "Network Error" });
    }
};


module.exports = {
    getAllReviews,
    createReview
}