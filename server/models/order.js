const joi = require("joi");
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
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
    enum: ["ADDED TO CART", "BOUGHT"],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  orderedDate: {
    type: Date
  },
  price: {
    type: Number
  }
});

const Order = new mongoose.model("Order", orderSchema);

module.exports.orderSchema = orderSchema;
module.exports.Order = Order;
