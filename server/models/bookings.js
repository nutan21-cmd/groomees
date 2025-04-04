const Joi = require("joi");
const mongoose = require("mongoose");
//todo add publisher reference.
const Bookings = mongoose.model(
    "Bookings",
    new mongoose.Schema(
        {
            status: {
                type: String,
                required: true,
                trim: true,
                maxlength: 20,
                enum: ["confirmed", "cancelled"]
            },
            treatmentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Treatments",
                required: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Persons",
                required: true
            },
            selectedDate: {
                type: String,
                required: true,
                trim: true
            },
            selectedSlot: {
                type: String,
                required: true,
                trim: true
            }        
        })
);

exports.Bookings = Bookings;