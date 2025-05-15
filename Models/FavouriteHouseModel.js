const mongoose = require("mongoose");

const favouriteHouseSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    housesId: []
}, {
    timestamps: true
});

const favouriteHouseModel = mongoose.model('favouritehouse', favouriteHouseSchema);

module.exports = favouriteHouseModel;