const joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = mongoose.Schema({
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Persons",
    required: true
  },
  storeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bookstores",
    required: true
  },
  bookID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books",
    required: true
  },
  status: {
    type: String,
    enum: ["ADDED TO CART", "RENTED", "RETURNED"],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  dailyRentalRate: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date
  },
  returnDate: {
    type: Date
  }
});

const Rental = new mongoose.model("Rental", rentalSchema);

module.exports.rentalSchema = rentalSchema;
module.exports.Rental = Rental;
