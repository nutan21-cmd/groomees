const { Book, validate } = require("../models/book");
const { Person } = require("../models/person");
const mongoose = require("mongoose");
const validateObject = require("../middleware/validateObjectId");
const isoLangs = require("../utilities/language");

const auth = require("../middleware/auth");
//const admin = require("../middleware/admin");
//const validateObjectId = require("../middleware/validateObjectId");
//const moment = require("moment");
const express = require("express");
const router = express.Router();

//get all books
router.get("/", async (req, res) => {
  const books = await Book.find()
    .populate("author")
    .sort("title");
  console.log()
  res.send(books);
});
// router.get("/temp", async (req, res) => {
// db.books
//   .find({})
//   .toArray()
//   .forEach(obj => {
//     let language = "" + obj.language.trim();
//     if (isoLangs[language] != null) {
//       obj.language = isoLangs[language].name;
//       db.books.save(obj);
//     }
//   });
// });
router.get("/genre/:genre", async (req, res) => {
  const books = await Book.find({ genre: req.params.genre });
  res.send(books);
});

router.get("/:id", validateObject, async (req, res) => {
  const books = await Book.findById(req.params.id).populate("author");
  res.send(books);
});

router.put("/:id/addRating", validateObject, async (req, res) => {
  const book = await Book.findById(req.params.id);
  book.rating.averageRating =
    (book.rating.averageRating + parseFloat(req.body.rating)) /
    (book.rating.ratingsCount + 1);
  book.rating.ratingsCount += 1;
  const updated = await book.save();
  res.send(updated);
});

router.get("/author/:id", validateObject, async (req, res) => {
  const books = await Book.find({
    author: mongoose.Types.ObjectId(req.params.id)
  })
    .select("-__v")
    .sort("title");
  res.send(books);
});

module.exports = router;
