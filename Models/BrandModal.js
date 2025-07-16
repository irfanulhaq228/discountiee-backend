const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
    logo: String,
    name: String,
    email: String,
    phone: String,
    city: String,
    country: String,
    password: String,
    address: String,
    otp: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    status: { type: Boolean, default: true }
}, {
    timestamps: true
});

const brandModel = mongoose.model('brand', brandSchema);

module.exports = brandModel;