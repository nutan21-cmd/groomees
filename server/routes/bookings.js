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


router.put("/reshedule/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { selectedDate, selectedSlot } = req.body;
        if (!monthOrder[selectedDate.split(" ")[0]]) {
            return res.status(400).send({ error: "Invalid month in selectedDate" });
        }
        // save person's address from booking if not already exist
        const booking = await Bookings.findById(id);
        booking.selectedDate = selectedDate;
        booking.selectedSlot = selectedSlot;
        await booking.save();

        // Populate the treatmentId field to include the full Treatment object
        const populatedBooking = await Bookings.findById(id)
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

 
// get all bookings with user details
router.get("/all-users-with-bookings", async (req, res) => {
    try {
      const result = await Person.aggregate([
        {
          $lookup: {
            from: "bookings", // The name of the bookings collection
            localField: "_id", // The field in the Person model you're matching on
            foreignField: "userId", // The field in the Bookings model that references Person
            as: "bookings", // The new field to store the matched bookings for each person
          },
        },
        {
          $unwind: {
            path: "$bookings", // Unwind the bookings array to process each booking individually
            preserveNullAndEmptyArrays: true, // Keep users even if they have no bookings
          },
        },
        {
          $lookup: {
            from: "treatments", // The name of the treatments collection
            localField: "bookings.treatmentId", // The field in the Bookings model you're matching on
            foreignField: "_id", // The field in the Treatments model that references Bookings
            as: "bookings.treatmentDetails", // The new field to store the matched treatment details
          },
        },
        {
          $unwind: {
            path: "$bookings.treatmentDetails", // Unwind the treatmentDetails array
            preserveNullAndEmptyArrays: true, // Keep bookings even if they have no treatment details
          },
        },
        {
          $group: {
            _id: "$_id", // Group by user ID
            firstName: { $first: "$firstName" },
            lastName: { $first: "$lastName" },
            phone: { $first: "$phone" },
            email: { $first: "$email" },
            address: { $first: "$address" },
            bookings: {
              $push: {
                _id: "$bookings._id",
                status: "$bookings.status",
                selectedDate: "$bookings.selectedDate",
                selectedSlot: "$bookings.selectedSlot",
                treatmentDetails: "$bookings.treatmentDetails", // Include treatment details
              },
            },
          },
        },
      ]);
  
      res.status(200).send(result);
    } catch (error) {
      console.error("Error fetching users with bookings:", error);
      res.status(500).send({ error: "Error fetching users with bookings", details: error.message });
    }
  });

  router.get("/:bookingId", async (req, res) => {
    try {
      const { bookingId } = req.params;
  
      // Find the booking by ID and populate related fields
      const booking = await Bookings.findById(bookingId)
        .populate("userId") // Populate user details
        .populate("treatmentId"); // Populate treatment details
  
      if (!booking) {
        return res.status(404).send({ error: "Booking not found." });
      }
  
      res.status(200).send(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).send({ error: "Error fetching booking", details: error.message });
    }
  });


  router.put("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const updatedData = req.body;
  
      // Update the user
      const updatedUser = await Person.findByIdAndUpdate(userId, updatedData, { new: true });
  
      if (!updatedUser) {
        return res.status(404).send({ error: "User not found" });
      }
  
      res.status(200).send(updatedUser);
    } catch (error) {
      res.status(500).send({ error: "Error updating user", details: error.message });
    }
  });


  router.delete("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Delete the user
      const deletedUser = await Person.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).send({ error: "User not found" });
      }
  
      // Optionally delete associated bookings
      await Bookings.deleteMany({ userId });
  
      res.status(200).send({ message: "User and associated bookings deleted successfully" });
    } catch (error) {
      res.status(500).send({ error: "Error deleting user", details: error.message });
    }
  });

  router.put("/:bookingId", async (req, res) => {
    try {
      const { bookingId } = req.params;
      const updatedData = req.body;
  
      // Update the booking
      const updatedBooking = await Bookings.findByIdAndUpdate(bookingId, updatedData, { new: true });
  
      if (!updatedBooking) {
        return res.status(404).send({ error: "Booking not found" });
      }
  
      res.status(200).send(updatedBooking);
    } catch (error) {
      res.status(500).send({ error: "Error updating booking", details: error.message });
    }
  });


  router.delete("/:bookingId", async (req, res) => {
    try {
      const { bookingId } = req.params;
  
      // Delete the booking
      const deletedBooking = await Bookings.findByIdAndDelete(bookingId);
  
      if (!deletedBooking) {
        return res.status(404).send({ error: "Booking not found" });
      }
  
      res.status(200).send({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).send({ error: "Error deleting booking", details: error.message });
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