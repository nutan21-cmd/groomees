const mongoose = require("mongoose");
const PhoneSchema = new mongoose.Schema({
  phone: {
    type: String,
    maxlength: 12
  },
  isPrimary: { type: Boolean }
});

exports.PhoneSchema = PhoneSchema;
