const mongoose = require("mongoose");
const config = require("config");

module.exports = function() {
  const conn = config.get("db");

  mongoose
    .connect(conn, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log(`Connected to ${conn}`));
};
