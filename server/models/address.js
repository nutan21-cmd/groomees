const mongoose = require("mongoose");
const AddressSchema = new mongoose.Schema({
  street: {
    type: String,
    trim: true,
    maxlength: 200
  },
  city: {
    type: String,
    maxlength: 50
  },
  state: {
    type: String,
    maxlength: 50
  },
  zip: {
    type: String,
    maxlength: 5
  },
  isPrimary: { type: Boolean }
});

exports.AddressSchema = AddressSchema;
