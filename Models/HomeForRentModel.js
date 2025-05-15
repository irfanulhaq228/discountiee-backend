const mongoose = require("mongoose");

const homeForRentSchema = mongoose.Schema({
    address: String,
    property: String,
    advancePayment: String,
    bathrooms: String,
    bedrooms: String,
    monthlyPrice: String,
    fromTourDate: Date,
    toTourDate: Date,
    overview: String,
    services: String,
    title: String,
    keyFeatures: String,
    buildingSize: String,
    lotSqft: String,
    sqft: String,
    petFees: String,
    images: [],
    video: String,
    location: {},
    nearbyAddresses: [],
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'agent' },
    status: { type: Boolean, default: false }
}, {
    timestamps: true
});

const homeForRentModel = mongoose.model('rentalHome', homeForRentSchema);

module.exports = homeForRentModel;