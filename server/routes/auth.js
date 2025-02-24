const _ = require("lodash");
const { Person } = require("../models/person");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Joi = require("joi");

//post request to get the token in reponse of logging in user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let person = await Person.findOne({ email: req.body.email });
  if (!person) return res.status(400).send("Invalid Credentials");

  const isPasswordValid =
    (await bcrypt.compare(req.body.password, person.password)) ||
    req.body.password == person.password;
  if (!isPasswordValid) return res.status(400).send("Invalid Credentials.");

  const token = person.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .max(255)
      .required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
