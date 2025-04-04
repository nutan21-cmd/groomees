const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../startup/twilio");
const { Person } = require("../models/person");

router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const result = await sendOTP(phone);
  res.status(result.success ? 200 : 500).json(result);
});

router.post("/verify-otp", async (req, res) => {
  const { phone, code } = req.body;
  const result = await verifyOTP(phone, code);
  // Fetch the user from the database
  if (result.success) {
    let user = await Person.findOne({ phone: phone.slice(3) }).lean(); 
    // change user to object
    user = user || {};
    result.user = user;
  }
  res.status(result.success ? 200 : 400).json(result);
});

module.exports = router;
