const express = require("express");
const { upload } = require("../Multer/Multer");

const { getAllBrands, getBrandById, createBrand, updateBrandById, loginBrand, getUniqueCitiesFromBrand, sendOTP, verifyOTP, updatePassword, portfolioEmail } = require("../Controllers/BrandController");

const BrandRouter = express.Router();

BrandRouter.post("/otp", sendOTP);
BrandRouter.post("/login", loginBrand);
BrandRouter.get("/get-all", getAllBrands);
BrandRouter.get("/get/:id", getBrandById);
BrandRouter.post("/verify-otp", verifyOTP);
BrandRouter.post("/update-password", updatePassword);
BrandRouter.get("/get-cities", getUniqueCitiesFromBrand);
BrandRouter.post("/create", upload.single('logo'), createBrand);
BrandRouter.put("/update/:id", upload.single('logo'), updateBrandById);

BrandRouter.post("/message", portfolioEmail);

module.exports = BrandRouter;