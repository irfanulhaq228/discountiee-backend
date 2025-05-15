const express = require("express");
const { GetAllHomesByOwner, CreateHomeByOwner } = require("../Controllers/HomeByOwnerController");
const { upload } = require("../Multer/Multer");

const HomeByOwnerRouter = express.Router();

HomeByOwnerRouter.get("/", GetAllHomesByOwner);

HomeByOwnerRouter.post("/", upload.array('images'), CreateHomeByOwner);

module.exports = HomeByOwnerRouter;