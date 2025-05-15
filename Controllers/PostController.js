const fs = require('fs');
const path = require('path');
const moment = require("moment");
const postModel = require("../Models/PostModel.js");

const createPost = async (req, res) => {
    try {
        const { endDate, endTime, uploadDate, uploadTime, immediately, description, brand } = req.body;

        const imagePaths = req.files.map(file => file.path);
        const newPost = await postModel.create({
            images: imagePaths,
            endDate,
            endTime,
            uploadDate,
            uploadTime,
            immediately,
            description,
            brand
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
        const data = await postModel.find({ brand: id }).sort({ createdAt: -1 });

        if (data?.length === 0) {
            return res.status(400).json({ message: "No posts found for this brand!" });
        };

        return res.status(200).json({ message: "Posts Fetched successfully", data });

    } catch (error) {
        console.log(error);
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
            const now = moment();

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

module.exports = {
    createPost,
    deletePostById,
    getPostByBrand,
    getPostStatusById,
    startPostExpirationChecker
};
