const express = require("express");
const { getAllUser, createUser, loginUser, editUser, getUserById, contactAgent, requestTour, connectWithLocalAgent } = require("../Controllers/UserController");

const UserRouter = express.Router();

UserRouter.get("/", getAllUser);
UserRouter.post("/", createUser);
UserRouter.post("/login", loginUser);

UserRouter.post("/contact-agent", contactAgent);
UserRouter.post("/request-tour", requestTour);
UserRouter.post("/connect-with-local-agent", connectWithLocalAgent);

UserRouter.get("/:id", getUserById);
UserRouter.post("/:id", editUser);

module.exports = UserRouter;