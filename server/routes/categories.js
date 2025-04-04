const { Categories } = require("../models/categories");
const { Treatment } = require("../models/treatment");

const isoLangs = require("../utilities/language");

const auth = require("../middleware/auth");

const express = require("express");
const router = express.Router();

//get all books
router.get("/", async (req, res) => {
  const books = await Categories.find()
    .sort("title");
  res.send(books);
});

router.get("/:id/treatments", async (req, res) => {
  const books = await Treatment.find({ categoryId: req.params.id})
  res.send(books);
});
module.exports = router;
