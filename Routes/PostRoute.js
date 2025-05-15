const express = require("express");
const { upload } = require("../Multer/Multer");

const { createPost, getPostByBrand, getPostStatusById, deletePostById } = require("../Controllers/PostController");

const PostRouter = express.Router();

PostRouter.post("/create", upload.array('images', 10), createPost);
PostRouter.get("/get/:id", getPostByBrand);

PostRouter.put("/update-status/:id", getPostStatusById);
PostRouter.delete("/delete/:id", deletePostById);

module.exports = PostRouter;