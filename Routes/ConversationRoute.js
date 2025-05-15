const express = require("express");
const { getAllConversation, createConversation } = require("../Controllers/ConversationController.js");

const ConversationRouter = express.Router();

ConversationRouter.get("/", getAllConversation);
ConversationRouter.post("/", createConversation);

module.exports = ConversationRouter;