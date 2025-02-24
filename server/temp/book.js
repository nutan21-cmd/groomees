const { Book, validate } = require("../models/book");
const { Person } = require("../models/person");
const mongoose = require("mongoose");
//const auth = require("../middleware/auth");
//const admin = require("../middleware/admin");
//const validateObjectId = require("../middleware/validateObjectId");
//const moment = require("moment");
const express = require("express");
const router = express.Router();

//get all books
router.get("/", async (req, res) => {
  const books = await Book.find()
    .select("author")
    .sort("title");
  res.send(books);
});

router.get("/author/:id", async (req, res) => {
  const books = await Book.find({
    author: mongoose.Types.ObjectId(req.params.id)
  })
    .select("-__v")
    .sort("title");
  res.send(books);
});

router.get("/removeCoupon", async (req, res) => {
  const booksnot = await Book.update(
    {},
    { $unset: { isCouponApplicable: "" } },
    { multi: true }
  );
  console.log(booksnot);
  res.send(booksnot);
});

// router.get("/temp2", async (req, res) => {
//   const authors = await Person.find({ TYPE: "Author" }).select("_id");
//   //const bookids = await Book.find({}).select("_id");
//   //console.log(bookids);
//   const booksnot = await Book.find({ author: { $nin: authors } });
//   console.log(booksnot);
//   res.send(booksnot);
// });

// router.get("/temp", async (req, res) => {
//console.log(users[0]);

//   const usersUpdates = await Book.update(
//     {},
//     { author: users[0]._id },
//     { multi: true }
//   );
//Array of all bookIds
//console.log(bookids);

//   const bookids = await Book.find({}).select("_id");
//   const authors = await Person.find({ TYPE: "Author" }).select("_id");

//   for (let i = 0; i < bookids.length; i++) {

//   }
//   let i = 0;
//   var c = setInterval(() => {
//     if (i > 6243) clearInterval(c);
//     else {
//       const updated = Book.findByIdAndUpdate(
//         bookids[i],
//         {
//           $set: { author: authors[i++ % 400] }
//         },
//         function(err, model) {
//           //console.log(model);
//         }
//       );
//       console.log("updating" + i);
//     }
//   }, 20);
// });

//res.send(usersUpdates)

module.exports = router;
