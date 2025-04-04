const Joi = require("joi");
const mongoose = require("mongoose");
//todo add publisher reference.
const Treatment = mongoose.model(
    "Treatments",
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        price: {
            type: Number,
            required: true
        },
        contentDescription:{
            type: String,
            trim: true,
            maxlength: 40000
        },
        contentHighlights:{
            type: String,
            trim: true,
            maxlength: 40000
        },
        imageUrl: {
            type: String,
            trim: true,
            maxlength: 400
        },
        // categories = waxing, facial
        categoryId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categories"
        },

        type: {
           type: String,
           enum: ["TREATMENT", "OFFER", "PACKAGE"] 
        }

    })
);

exports.Treatment = Treatment;
