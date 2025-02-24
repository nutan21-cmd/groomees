const express = require("express");
const router = express.Router();
const { Feeds } = require("../models/feeds");

//get all genres
router.get("/", async (req, res) => {
  const feeds = await Feeds.find();
  res.send(feeds);
});

router.get("/", async (req, res) => {
  const feeds = await Feeds.find();
  res.send(feeds);
});

module.exports = router;
