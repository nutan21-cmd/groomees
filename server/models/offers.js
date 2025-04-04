const Joi = require("joi");
const mongoose = require("mongoose");
//todo add publisher reference.
const Offers = mongoose.model(
    "Offers",
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
        }
    })
);

exports.Offers = Offers;
