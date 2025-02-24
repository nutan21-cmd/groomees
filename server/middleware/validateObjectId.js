const mongoose = require("mongoose");

//validates the id field in requests to be a valid mongoose object.
const validateObject = function(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Invalid ID" + req.params.id);
  next();
};

module.exports = validateObject;
