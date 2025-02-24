const express = require("express");
const router = express.Router();
const categories = require("../models/book-categories");

//get all genres
router.get("/", async (req, res) => {
  res.send(categories);
});

module.exports = router;
