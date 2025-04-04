const joi = require("joi");
const mongoose = require("mongoose");

const Categories =  mongoose.model(
    "Categories",
new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    imageUrl:{
        type: String,
        requied:true
    }
}));

exports.Categories = Categories;

