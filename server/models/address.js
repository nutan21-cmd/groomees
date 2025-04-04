const mongoose = require("mongoose");
const AddressSchema = new mongoose.Schema({
  flat: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  landmark: { type: String, trim: true },
  pincode: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true }
});

exports.AddressSchema = AddressSchema;
