const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    actualRating: { type: Number, required: true},
    otherRatings: { type: {}, required: true },
    description: { type: String, required: true },
    pointOfView: { type: String, required: true },
    yearOfService: { type: String, required: true },
    completeAddress: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true  },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'agent', required: true }
}, {
    timestamps: true
});

const ReviewModel = mongoose.model('review', reviewSchema);

module.exports = ReviewModel;