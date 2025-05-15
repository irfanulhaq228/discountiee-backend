const ConversationModel = require("../Models/ConversationModel");

const getAllConversation = async (req, res) => {
    try {
        const data = await ConversationModel.find();
        if (data?.length === 0) {
            return res.status(200).json({ message: "No Data Found" });
        }
        return res.status(200).json({ message: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const createConversation = async (req, res) => {
    try {
        const { user, agent } = req.body;

        if (!user || !agent) {
            return res.status(400).json({ message: "Filled all Fields" });
        }

        const foundConversation = await ConversationModel.findOne({ user, agent });
        if (foundConversation) {
            return res.status(400).json({ message: foundConversation });
        } else {
            const data = await ConversationModel.create({ user, agent });
            return res.status(200).json({ message: data });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

module.exports = {
    getAllConversation,
    createConversation
};