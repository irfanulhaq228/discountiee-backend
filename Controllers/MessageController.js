const MessageModel = require("../Models/MessageModel");

const getAllMessages = async (req, res) => {
    try {
        const data = await MessageModel.find();
        if (data?.length === 0) {
            return res.status(200).json({ message: "No Message Found" });
        }
        return res.status(200).json({ message: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const createMessage = async (req, res) => {
    const { agent, user, sender, message, time } = req.body;
    const existingMessage = await MessageModel.findOneAndUpdate(
        { agent, user },
        { $addToSet: { messagesData: { message, sender, time } } },
        { upsert: true, new: true }
    );
    if (existingMessage) {
        return res.status(200).json({ message: existingMessage._id ? "Message Forwarded Successfully" : "First Message Forwarded Successfully" })
    } else {
        const newMessage = new MessageModel({ agent, user, messagesData: [{ message, sender, time }] });
        await newMessage.save();
        return res.status(200).json({ message: "First Message Forwarded Successfully" });
    }
};

const getUsersFromAgent = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await MessageModel.find({ agent: id }).select("user").populate({
            path: "user",
            select: "name email"
        });
        if (data?.length === 0) {
            return res.status(400).json({ message: "No Message Found of this Agent" });
        };
        return res.status(200).json({ message: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const getAgentsFromUser = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await MessageModel.find({ user: id }).select("agent").populate({
            path: "agent",
            select: "name email"
        });
        if (data?.length === 0) {
            return res.status(400).json({ message: "No Message Found of this User" });
        };
        return res.status(200).json({ message: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

const getUserMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const { agent } = req.body;
        const data = await MessageModel.findOne({ agent, user: id });
        if (data?.length === 0) {
            return res.status(400).json({ message: "No Message Found against this User" });
        };
        return res.status(200).json({ message: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Network Error" });
    }
};

module.exports = {
    getAllMessages,
    createMessage,
    getUsersFromAgent,
    getAgentsFromUser,
    getUserMessages
};