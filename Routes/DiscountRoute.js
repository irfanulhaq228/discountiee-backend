const express = require("express");
const { createDiscount, getAllDiscount, getDiscountById, getDiscountByBrand, updateDiscountById } = require("../Controllers/DiscountController");

const DiscountRouter = express.Router();

DiscountRouter.post("/create", createDiscount);
DiscountRouter.get("/get-all", getAllDiscount);
DiscountRouter.get("/get/:id", getDiscountById);
DiscountRouter.get("/update/:id", updateDiscountById);
DiscountRouter.get("/get-by-brand/:id", getDiscountByBrand);

module.exports = DiscountRouter;