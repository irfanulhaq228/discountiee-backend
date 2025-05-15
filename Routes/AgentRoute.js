const express = require("express");
const { getAgents, createAgent, loginAgent, getAgentById, searchAgentByUser } = require("../Controllers/AgentController");

const AgentRouter = express.Router();

AgentRouter.get("/", getAgents);
AgentRouter.post("/", createAgent);
AgentRouter.post("/login", loginAgent);
AgentRouter.post("/search-by-user", searchAgentByUser);

AgentRouter.get("/:id", getAgentById);

module.exports = AgentRouter;