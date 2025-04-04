const express = require("express");
const users = require("../routes/users");
const categories = require("../routes/categories");
const treatments = require("../routes/treatments")
const bookings = require("../routes/bookings");
const twilioRoutes = require("../routes/twilio");


module.exports = function(app) {
  app.use(express.json());
  app.use("/api/categories", categories)
  app.use("/api/treatments", treatments)
  app.use("/api/users", users);
  app.use("/api/bookings", bookings);
  app.use("/api/twilio", twilioRoutes);
};
