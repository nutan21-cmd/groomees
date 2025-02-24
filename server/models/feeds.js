const joi = require("joi");
const mongoose = require("mongoose");

const feedsSchema = new mongoose.Schema({
  personID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Persons"
  },
  feeds: [{ type: String }]
});

const Feeds = new mongoose.model("Feeds", feedsSchema);

module.exports.feedsSchema = feedsSchema;
module.exports.Feeds = Feeds;
