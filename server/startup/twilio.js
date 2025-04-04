require("dotenv").config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);

const sendOTP = async (phone) => {
  try {
    const otpResponse = await client.verify.v2.services(serviceSid)
      .verifications.create({ to: phone, channel: "sms" });
    return { success: true, message: "OTP sent!" };
  } catch (error) {
    return { success: false, message: "error occured" };
  }
};

const verifyOTP = async (phone, code) => {
  try {
    const verificationCheck = await client.verify.v2.services(serviceSid)
      .verificationChecks.create({ to: phone, code: code.toString() });
    if (verificationCheck.status === "approved") {
      return { success: true, message: "OTP Verified!", verificationCheck };
    } else {
      return { success: false, message: "Invalid OTP" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = { sendOTP, verifyOTP };
