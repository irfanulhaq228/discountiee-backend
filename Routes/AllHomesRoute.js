const express = require("express");
const { getAllHomes } = require("../Controllers/AllHomesController");

const AllHomesRouter = express.Router();

AllHomesRouter.get("/", getAllHomes);

module.exports = AllHomesRouter;