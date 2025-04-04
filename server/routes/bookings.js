const { Bookings } = require("../models/bookings");

const isoLangs = require("../utilities/language");

const auth = require("../middleware/auth");

const express = require("express");
const { Person } = require("../models/person");
const router = express.Router();

const monthOrder = { 
    "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, 
    "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12 
};

//get all bookings
router.get("/", async (req, res) => {
  const bookings = await Bookings.find()
  .populate("userId")
  .populate("treatmentId")
  res.send(bookings);
});

router.post("/create", async (req, res) => {
    try {
        const { status, treatmentId, userId, selectedDate, selectedSlot, address } = req.body;
        if (!monthOrder[selectedDate.split(" ")[0]]) {
            return res.status(400).send({ error: "Invalid month in selectedDate" });
        }
        // save person's address from booking if not already exist
        const person = await Person.findById(userId);
        if (!person.address) {
            person.address = address;
            await person.save();
        }

        const newBooking = new Bookings({
            status,
            userId,
            treatmentId,
            selectedDate,
            selectedSlot
        });
        const savedBooking = await newBooking.save();
        // Populate the treatmentId field to include the full Treatment object
        const populatedBooking = await Bookings.findById(savedBooking._id)
            .populate("treatmentId") // Populate the treatmentId field
        res.status(200).send(populatedBooking);
    } catch (error) {
        res.status(500).send({ error: "Error creating booking", details: error.message });
    }
});

// Get bookings by userId
router.get("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find bookings for the given userId
      const bookings = await Bookings.find({ userId })
        .populate("userId") // Populate user details
        .populate("treatmentId"); // Populate treatment details
  
      if (!bookings || bookings.length === 0) {
        return res.status(404).send({ error: "No bookings found for this user." });
      }
  
      res.send(bookings);
    } catch (error) {
      res.status(500).send({ error: "Error fetching bookings", details: error.message });
    }
  });

router.put("/:id/cancel", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBooking = await Bookings.findByIdAndUpdate(
            id,
            { status: "cancelled" },
            { new: true } // Return the updated document
        );
        if (!updatedBooking) {
            return res.status(404).send({ error: "Booking not found" });
        }
        res.send(updatedBooking);
    } catch (error) {
        res.status(500).send({ error: "Error updating booking status" });
    }
});
module.exports = router;