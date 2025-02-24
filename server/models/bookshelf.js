const joi = require("joi");
const mongoose = require("mongoose");

const shelf_details = new mongoose.Schema({
  bookID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books"
  },
  status: {
    type: String,
    enum: ["WANTS TO READ", "BOUGHT", "RENTED", "READING", "READ"]
  },
  rating: Number,
  review: {
    type: String,
    maxlength: 100
  }
});

const bookshelfSchema = new mongoose.Schema({
  personID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Persons"
  },
  details: [shelf_details]
});

const Bookshelf = new mongoose.model("Bookshelf", bookshelfSchema);

module.exports.bookshelfSchema = bookshelfSchema;
module.exports.Bookshelf = Bookshelf;
