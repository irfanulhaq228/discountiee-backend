const mongoose = require("mongoose");

const agentSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zipcode: String,
    password: String,
    stars: { type: Number, default: 0 },
    reviews: [],
    status: { type: Boolean, default: true }
}, {
    timestamps: true
});

const agentModel = mongoose.model('agent', agentSchema);

module.exports = agentModel;