const joi = require("joi");
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Persons"
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    }
  ],
  rentals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental"
    }
  ]
});

const Cart = new mongoose.model("Cart", cartSchema);

module.exports.cartSchema = cartSchema;
module.exports.Cart = Cart;
