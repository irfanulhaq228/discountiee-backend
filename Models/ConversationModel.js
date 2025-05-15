const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'agent', required: true }
}, {
    timestamps: true
});

const ConversationModel = mongoose.model('Conversation', conversationSchema);

module.exports = ConversationModel;