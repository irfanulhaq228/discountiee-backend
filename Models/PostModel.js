const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    images: [String],
    immediately: Boolean,
    uploadTime: String || null,
    uploadDate: String || null,
    endTime: String,
    endDate: String,
    description: String,
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'brand' },
    status: { type: String, default: 'active' }
}, {
    timestamps: true
});

const postModel = mongoose.model('post', postSchema);

module.exports = postModel;