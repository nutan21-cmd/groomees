const express = require("express");
const books = require("../routes/books");
const users = require("../routes/users");
const bookstores = require("../routes/bookstores");
const genres = require("../routes/genres");

const orders = require("../routes/orders");
const rentals = require("../routes/rentals");
const carts = require("../routes/carts");
const bookshelf = require("../routes/bookshelf");
const auth = require("../routes/auth");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/books", books);

  app.use("/api/users", users);
  app.use("/api/bookstores", bookstores);
  app.use("/api/orders", orders);
  app.use("/api/rentals", rentals);
  app.use("/api/carts", carts);
  app.use("/api/genres", genres);
  app.use("/api/bookshelf", bookshelf);
  app.use("/api/auth", auth);
};
