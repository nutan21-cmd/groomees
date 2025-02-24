const Joi = require("joi");
const mongoose = require("mongoose");

const BookInventorySchema = new mongoose.Schema({
  bookID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books"
  },
  quantity: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

exports.BookInventorySchema = BookInventorySchema;
