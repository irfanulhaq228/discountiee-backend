const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'agent', required: true },
    // conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'conversation', required: true },
    messagesData: [
        {
            message: String,
            sender: String,
            time: String
        }
    ]
}, {
    timestamps: true
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;