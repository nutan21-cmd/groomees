const Joi = require("joi");
const mongoose = require("mongoose");
const categ = require("./book-categories");
//todo add publisher reference.
const Book = mongoose.model(
  "Books",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    genre: {
      type: String,
      enum: categ
    },
    language: {
      type: String
    },
    publisher: {
      type: String,
      trim: true,
      maxlength: 100
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Persons"
    },
    publishedDate: {
      type: String,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    pageCount: {
      type: Number
    },
    rating: {
      averageRating: {
        type: Number
      },
      ratingsCount: {
        type: Number
      }
    },
    saleInfo: {
      country: { type: String },
      retailPrice: {
        amount: { type: Number },
        currencyCode: { type: String }
      }
    },
    isCouponApplicable: { type: Boolean },

    Links: {
      googleBooksReadReview: {
        type: String
      },
      playStoreLink: {
        type: String
      },
      webReaderLink: {
        type: String
      },
      thumbnail: {
        type: String
      }
    }
  })
);

function validateMovie(Book) {}

exports.Book = Book;
exports.validate = validateMovie;
