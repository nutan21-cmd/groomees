const Joi = require("joi");
const mongoose = require("mongoose");

const { BookInventorySchema } = require("./bookinventory");

const bookstoreSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Persons"
  },
  inventory: [BookInventorySchema]
});

const Bookstore = new mongoose.model("Bookstores", bookstoreSchema);

module.exports.Bookstore = Bookstore;
module.exports.bookstoreSchema = bookstoreSchema;
