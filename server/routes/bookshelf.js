const { Bookshelf, validate } = require("../models/bookshelf");
const { Person } = require("../models/person");
const { Book } = require("../models/book");

const validateObject = require("../middleware/validateObjectId");
//const auth = require("../middleware/auth");
//const admin = require("../middleware/admin");
//const validateObjectId = require("../middleware/validateObjectId");
//const moment = require("moment");
const express = require("express");
const router = express.Router();

//get all books
router.get("/", async (req, res) => {
  const bookstores = await Bookshelf.find();
  res.send(bookstores);
});

router.get("/:personID", async (req, res) => {
  const shelfs = await Bookshelf.find({ personID: req.params.personID });
  if (shelfs.length == 0) {
    const shelf = new Bookshelf({
      personID: req.params.personID,
      details: []
    });

    const saved = await shelf.save();
    res.send(saved);
  } else {
    res.send(shelfs[0]);
  }
});

router.get("/:personID/detailed", async (req, res) => {
  const shelfs = await Bookshelf.find({
    personID: req.params.personID
  }).populate("details.bookID");
  if (shelfs.length == 0) {
    const shelf = new Bookshelf({
      personID: req.params.personID,
      details: []
    });

    const saved = await shelf.save();
    res.send(saved);
  } else {
    res.send(shelfs[0]);
  }
});
checkEmpty = val => {
  if (val) return val;
  return "";
};

router.get("/review/:bookID", async (req, res) => {
  const shelfs = await Bookshelf.find({}).populate("personID");
  var arr = [];
  for (var i = 0; i < shelfs.length; i++) {
    var obj = shelfs[i];
    if (obj.details.length != 0) {
      for (var j = 0; j < obj.details.length; j++) {
        if (
          obj.details[j].bookID == req.params.bookID &&
          obj.details[j].status != "WANTS TO READ"
        )
          arr.push({
            personID: obj.personID,
            bookID: obj.details[j].bookID,
            rating: obj.details[j].rating,
            review: obj.details[j].review
          });
      }
    }
  }

  res.send(arr);
});

router.post("/", async (req, res) => {
  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);

  const person = await Person.findById(req.body.personID);
  if (!person) return res.status(400).send("Invalid Person.");

  const shelf = new Bookshelf({
    personID: req.body.personID,
    details: req.body.details
  });

  const saved = await shelf.save();
  res.send(saved);
});

//update the bookstore
//1.change the books array
router.put("/:id", validateObject, async (req, res) => {
  const shelf = await Bookshelf.findByIdAndUpdate(
    req.params.id,
    {
      details: req.body.details
    },
    { new: true }
  );

  if (!shelf)
    return res
      .status(404)
      .send("The Bookshelf with the given ID was not found.");

  res.send(shelf);
});

router.put("/:personID/add", async (req, res) => {
  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
  const shelf = await Bookshelf.findOne({ personID: req.params.personID });

  if (!shelf) {
    return res.status(400).send("Invalid shelf Id");
  }

  let updated = {};
  let previousRating = 0;

  var obj = shelf.details.filter(x => x.bookID == req.body.bookID);
  if (obj.length == 0) {
    //no such book exists already
    shelf.details.push(req.body);
    updated = await shelf.save();

    if (req.body.rating && req.body.rating != 0) {
      const book = await Book.findById(req.body.bookID);
      book.rating.averageRating =
        (book.rating.averageRating + parseFloat(req.body.rating)) /
        (book.rating.ratingsCount + 1);
      book.rating.ratingsCount += 1;
      await book.save();
    }
  } else {
    //shelf contains this book

    const index = shelf.details.indexOf(obj[0]);
    shelf.details[index].status = req.body.status;

    previousRating = shelf.details[index].rating;

    shelf.details[index].rating = req.body.rating;

    shelf.details[index].review = req.body.review;

    updated = await shelf.save();

    if (req.body.rating && req.body.rating != 0) {
      const book = await Book.findById(req.body.bookID);
      console.log("previousrating" + previousRating);
      if (previousRating == 0) {
        //ignore previous rating
        book.rating.averageRating =
          (book.rating.averageRating + parseFloat(req.body.rating)) /
          (book.rating.ratingsCount + 1);
        book.rating.ratingsCount += 1;
        await book.save();
      } else {
        //i have rated it >0
        console.log("updated rating" + parseFloat(req.body.rating));
        book.rating.averageRating =
          parseFloat(
            book.rating.averageRating * book.rating.ratingsCount -
              previousRating +
              parseFloat(req.body.rating)
          ) / book.rating.ratingsCount;
        await book.save();
      }
    }
  }

  res.send(updated);
});

module.exports = router;
