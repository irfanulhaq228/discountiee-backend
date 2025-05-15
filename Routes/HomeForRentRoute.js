const express = require("express");
const { getHomesForRent, createHomesForRent, getRentalHomeById, deleteRentalHomeById, approvedRentalHomes, getRentalHomesByAgentId, getApprovedRentalHomesByAgentId } = require("../Controllers/HomeForRentController");
const { upload } = require("../Multer/Multer");

const HomeForRentRouter = express.Router();

HomeForRentRouter.post("/create", upload.fields([ { name: 'images' }, { name: "video" } ]), createHomesForRent);

HomeForRentRouter.get("/", getHomesForRent);
HomeForRentRouter.get("/approved", approvedRentalHomes);

HomeForRentRouter.get("/by-agent/:id", getRentalHomesByAgentId);
HomeForRentRouter.get("/by-agent/approved/:id", getApprovedRentalHomesByAgentId);

HomeForRentRouter.get("/:id", getRentalHomeById);
HomeForRentRouter.delete("/:id", deleteRentalHomeById);

module.exports = HomeForRentRouter;