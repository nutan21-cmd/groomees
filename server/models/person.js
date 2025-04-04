const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { AddressSchema } = require("./address");
const config = require("config");
//todo add publisher reference.

const PersonSchema = new mongoose.Schema({
  TYPE: {
    type: String,
    enum: ["Admin", "User"]
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 200
  },
  email: {
    type: String,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: Number,
    length: 10
  },
  address: AddressSchema,
});

PersonSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      TYPE: this.TYPE,
      firstName: this.firstName,
      lastName: this.lastName,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth,
      email: this.email
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Person = mongoose.model("Persons", PersonSchema);

exports.Person = Person;
