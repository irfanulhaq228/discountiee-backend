const fs = require('fs');
const path = require('path');
const moment = require("moment");
const postModel = require("../Models/PostModel.js");
const brandModel = require('../Models/BrandModal.js');

const createPost = async (req, res) => {
    try {
        const { endDate, endTime, uploadDate, uploadTime, immediately, description, brand, status } = req.body;

        const imagePaths = req.files.map(file => file.path);
        const newPost = await postModel.create({
            images: imagePaths,
            endDate,
            endTime,
            uploadDate,
            uploadTime,
            immediately,
            description,
            brand,
            status
        });

        return res.status(200).json({ message: "Post created successfully", data: newPost });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!", error });
    }
};

const getPostByBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const filters = { brand: id, ...req.query };

        const data = await postModel.find(filters).sort({ createdAt: -1 });

        return res.status(200).json({ message: "Posts Fetched successfully", data });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!", error });
    }
};

const getPostDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await postModel.findById(id).populate('brand');

        return res.status(200).json({ message: "Post Fetched successfully", data });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!", error });
    }
};

const getPostWithBrand = async (req, res) => {
    try {
        const { page = 1, cities, ...filters } = req.query;
        const limit = 10;
        const skip = (page - 1) * limit;

        const query = { ...filters };

        let parsedCities = [];

        if (cities) {
            try {
                parsedCities = JSON.parse(cities);
            } catch (err) {
                return res.status(400).json({ message: "Invalid cities format. Should be a stringified array." });
            }
        }

        const allPosts = await postModel.find(query)
            .populate({ path: "brand", select: "-password" })
            .sort({ updatedAt: -1 });

        let filteredPosts = allPosts;
        if (Array.isArray(parsedCities) && parsedCities.length > 0) {
            filteredPosts = allPosts.filter(post =>
                post.brand && parsedCities.includes(post.brand.city)
            );
        }

        const total = filteredPosts.length;

        const paginatedPosts = filteredPosts.slice(skip, skip + limit);

        return res.status(200).json({
            message: "Posts fetched successfully",
            data: paginatedPosts,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error!", error });
    }
};

const getPostsByCategory = async (req, res) => {
    try {
        const { category, cities } = req.query;

        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        // Parse cities if provided
        let parsedCities = [];
        if (cities) {
            try {
                parsedCities = JSON.parse(cities); // cities must be passed as a JSON stringified array
            } catch (err) {
                return res.status(400).json({ message: "Invalid cities format. Must be a stringified array." });
            }
        }

        // First get all brands for the category
        let brandFilter = { category };

        // If cities array is not empty, filter brands by city
        if (Array.isArray(parsedCities) && parsedCities.length > 0) {
            brandFilter.city = { $in: parsedCities };
        }

        const brands = await brandModel.find(brandFilter).select('_id');

        const brandIds = brands.map((brand) => brand._id);

        // Fetch posts whose brand is in the filtered brand list
        const data = await postModel.find({ brand: { $in: brandIds } })
            .populate({
                path: "brand",
                select: "-password",
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Posts fetched successfully",
            data,
            totalItems: data.length,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error!", error });
    }
};

const getPostStatusById = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const data = await postModel.findByIdAndUpdate(id, { status });

        if (!data) {
            return res.status(400).json({ message: "No post found" });
        };

        return res.status(200).json({ message: "Updated successfully", data });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!", error });
    }
};

const startPostExpirationChecker = () => {
    setInterval(async () => {
        try {
            const posts = await postModel.find({ status: { $in: ['active', 'stopped'] } });
            const now = moment().subtract(30, 'minutes');

            for (const post of posts) {
                if (!post.endDate || !post.endTime) continue;

                const endDateTime = moment(`${post.endDate} ${post.endTime}`, "ddd MMM DD YYYY h:mm A");
                if (now.isSameOrAfter(endDateTime)) {
                    post.status = "expired";
                    await post.save();
                    console.log(`✅ Post ${post._id} marked as expired`);
                }
            }
        } catch (error) {
            console.error("Error checking post expiration:", error);
        }
    }, 2 * 60 * 1000);
};

const startPostActivationChecker = () => {
    setInterval(async () => {
        try {
            const pendingPosts = await postModel.find({ status: "pending" });
            const now = moment().subtract(30, 'minutes');

            for (const post of pendingPosts) {
                if (!post.uploadDate || !post.uploadTime) continue;

                const uploadDateTime = moment(`${post.uploadDate} ${post.uploadTime}`, "ddd MMM DD YYYY h:mm A");
                if (now.isSameOrAfter(uploadDateTime)) {
                    post.status = "active";
                    await post.save();
                    console.log(`✅ Post ${post._id} activated`);
                }
            }
        } catch (error) {
            console.error("Error activating posts:", error);
        }
    }, 2 * 60 * 1000); // Run every 1 minute
};

const deletePostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await postModel.findById(id);
        if (!post) {
            return res.status(400).json({ message: 'No post found' });
        };

        if (Array.isArray(post.images)) {
            post.images.forEach((imgPath) => {
                const fullPath = path.join(__dirname, '..', imgPath);
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error(`❌ Failed to delete image: ${imgPath}`, err);
                    } else {
                        console.log(`🗑️ Image deleted: ${imgPath}`);
                    }
                });
            });
        }

        // Now delete the post
        await postModel.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Deleted successfully', data: post });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error!", error });
    }
};

const getWishlistPosts = async (req, res) => {
    try {
        const { idWishList } = req.body;

        if (!Array.isArray(idWishList) || idWishList.length === 0) {
            return res.status(400).json({ message: "idWishList must be a non-empty array" });
        };

        const posts = await postModel.find({ _id: { $in: idWishList }, status: "active" }).populate({
            path: "brand",
            select: "-password",
        });

        const sortedPosts = idWishList.map(id => posts.find(post => post._id.toString() === id)).filter(Boolean);

        return res.status(200).json({
            message: "Wishlist posts fetched successfully",
            data: sortedPosts,
            totalItems: sortedPosts.length,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error!", error });
    }
};


module.exports = {
    createPost,
    deletePostById,
    getPostByBrand,
    getPostDetails,
    getWishlistPosts,
    getPostWithBrand,
    getPostStatusById,
    getPostsByCategory,
    startPostExpirationChecker,
    startPostActivationChecker,
};
