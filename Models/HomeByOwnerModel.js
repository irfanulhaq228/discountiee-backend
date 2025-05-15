const mongoose = require("mongoose");

const homeByOwnerSchema = mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    bathrooms: String,
    bedrooms: String,
    description: String,
    homeType: String,
    images: [],
    lotSize: String,
    lotUnit: String,
    phone: String,
    price: String,
    relatedWebsite: String,
    streetAddress: String,
    unit: String,
    city: String,
    zipCode: String,
    location: {},
}, {
    timestamps: true
});

const HomeByOwnerModel = mongoose.model('HomeByOwner', homeByOwnerSchema);

module.exports = HomeByOwnerModel;