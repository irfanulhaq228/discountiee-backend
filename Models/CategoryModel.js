const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: String,
}, {
    timestamps: true
});

const CategoryModel = mongoose.model('Category', categorySchema);

module.exports = CategoryModel;