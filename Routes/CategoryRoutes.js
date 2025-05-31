const express = require("express");

const { getAllCategories } = require("../Controllers/CategoryController");

const CategoryRouter = express.Router();

CategoryRouter.get("/get-all", getAllCategories);

module.exports = CategoryRouter;