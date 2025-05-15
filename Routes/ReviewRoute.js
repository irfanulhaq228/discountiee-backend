const express = require("express");
const { getAllReviews, createReview } = require("../Controllers/ReviewController");

const ReviewRouter = express.Router();

ReviewRouter.post("/", createReview);

ReviewRouter.get("/", getAllReviews);

module.exports = ReviewRouter;