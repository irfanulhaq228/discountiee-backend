const express = require("express");
const { upload } = require("../Multer/Multer");

const { getAllBrands, getBrandById, createBrand, updateBrandById, loginBrand } = require("../Controllers/BrandController");

const BrandRouter = express.Router();

BrandRouter.post("/login", loginBrand);
BrandRouter.post("/create", upload.single('logo'), createBrand);
BrandRouter.get("/get-all", getAllBrands);
BrandRouter.get("/get/:id", getBrandById);
BrandRouter.put("/update/:id", upload.single('logo'), updateBrandById);

module.exports = BrandRouter;