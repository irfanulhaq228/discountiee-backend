const express = require("express");
const { upload } = require("../Multer/Multer");

const { createPost, getPostByBrand, getPostStatusById, deletePostById, getPostWithBrand, getPostDetails, getWishlistPosts, getPostsByCategory, updatePostById } = require("../Controllers/PostController");

const PostRouter = express.Router();

PostRouter.post("/create", upload.array('images', 10), createPost);
PostRouter.get("/get/:id", getPostByBrand);
PostRouter.get("/get-post/:id", getPostDetails);
PostRouter.get("/get-single/:id", getPostDetails);
PostRouter.get("/category", getPostsByCategory);
PostRouter.get("/get-with-brand", getPostWithBrand);

PostRouter.put("/update-status/:id", getPostStatusById);
PostRouter.put("/update/:id", upload.array('images', 10), updatePostById);
PostRouter.delete("/delete/:id", deletePostById);

PostRouter.post("/wishlist", getWishlistPosts);

module.exports = PostRouter;