const mongoose = require("mongoose");

const discountSchema = mongoose.Schema({
    images: [String],
    startDate: String,
    endDate: String,
    description: String,
    likesCount: Number,
    likes: [],
    status: { type: Boolean, default: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'brand' },
}, {
    timestamps: true
});

const discountModel = mongoose.model('Discount', discountSchema);

module.exports = discountModel;