const express = require("express");
const { getAllUsersFavouriteHouse, createUserFavouriteHouse, getUserFavouriteHouse, getFavouriteHousesInfo } = require("../Controllers/FovouriteHouseController");

const FavouriteHouseRouter = express.Router();

FavouriteHouseRouter.post("/", createUserFavouriteHouse);
FavouriteHouseRouter.get("/", getAllUsersFavouriteHouse);
FavouriteHouseRouter.get("/:id", getUserFavouriteHouse);
FavouriteHouseRouter.post("/info", getFavouriteHousesInfo);

module.exports = FavouriteHouseRouter;