const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { AddressSchema } = require("./address");
const { PhoneSchema } = require("./phone");
const config = require("config");
//todo add publisher reference.

const PersonSchema = new mongoose.Schema({
  TYPE: {
    type: String,
    enum: ["Admin", "Owner", "Reader", "Critic", "Author"]
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
  gender: {
    type: String,
    enum: ["Male", "Female"]
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024
  },
  dateOfBirth: {
    type: Date
  },
  email: {
    type: String,
    trim: true,
    maxlength: 100
  },
  addresses: [AddressSchema],
  phones: [PhoneSchema],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Persons" }],
  feeds: [{ type: String }]
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

function validateMovie(Book) {}

exports.Person = Person;
