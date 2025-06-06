require("dotenv").config();
const express = require("express");
const router = express.Router();

const { Bookings } = require("../models/bookings");
const isoLangs = require("../utilities/language");
const auth = require("../middleware/auth");
const sgMail = require('@sendgrid/mail');
const { Person } = require("../models/person");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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


router.post("/reshedule", async (req, res) => {
  try {
    const { bookingId, selectedDate, selectedSlot } = req.body;

    // Validate the selectedDate format
    if (!monthOrder[selectedDate.split(" ")[0]]) {
      return res.status(400).send({ error: "Invalid month in selectedDate" });
    }

    // Find the booking by ID
    const booking = await Bookings.findById(bookingId)
      .populate("userId") // Populate user details
      .populate("treatmentId"); // Populate treatment details

    if (!booking) {
      return res.status(404).send({ error: "Booking not found" });
    }

    // Update the booking with the new date and time
    booking.selectedDate = selectedDate;
    booking.selectedSlot = selectedSlot;
    await booking.save();

    // Prepare email details for the user
    // const userEmail = booking.userId.email; // User's email
    const dynamicTemplateData = {
      booking_type: booking.treatmentId.type || "N/A",
      service_name: booking.treatmentId.title || "N/A",
      appointment_date: selectedDate || "N/A",
      appointment_time: selectedSlot || "N/A",
      user: `${booking.userId.firstName} ${booking.userId.lastName}` || "Valued Customer",
    };

    // Fetch all admins
    const admins = await Person.find({ TYPE: "Admin" });

    if (!admins || admins.length === 0) {
      console.warn("No admins found to send the email.");
    }

    // Prepare email details for admins
    const adminEmails = admins.map((admin) => admin.email);

    // Combine user email and admin emails
    const recipients = [...adminEmails];

    const msg = {
      to: recipients, // Send to both user and admins
      from: process.env.FROM_EMAIL || "help.groomees@gmail.com",
      templateId: "d-ef08275a63fe4145a001aa0426bce472", // Reschedule email template ID
      dynamicTemplateData,
    };

    // Send the reschedule email
    await sgMail.send(msg);

    // Populate the treatmentId field to include the full Treatment object
    const populatedBooking = await Bookings.findById(bookingId).populate("treatmentId"); // Populate the treatmentId field

    // Respond with the updated booking and email success
    res.status(200).json({
      success: true,
      message: "Booking rescheduled and email sent successfully to user and admins",
      updatedBooking: populatedBooking,
    });
  } catch (error) {
    console.error("Error rescheduling booking or sending email:", error);
    // Log more error details if available
    if (error.response && error.response.body) {
      console.error("SendGrid Error details:", JSON.stringify(error.response.body));
    }
    res.status(500).send({
      success: false,
      message: "Error rescheduling booking or sending email",
      error: error.message,
    });
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

  
// router.put("/:id/cancel", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedBooking = await Bookings.findByIdAndUpdate(
//             id,
//             { status: "cancelled" },
//             { new: true } // Return the updated document
//         );
//         if (!updatedBooking) {
//             return res.status(404).send({ error: "Booking not found" });
//         }
//         res.send(updatedBooking);
//     } catch (error) {
//         res.status(500).send({ error: "Error updating booking status" });
//     }
// });


router.put("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    // Update the booking status to "cancelled"
    const updatedBooking = await Bookings.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true } // Return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).send({ error: "Booking not found" });
    }

    // Fetch user and treatment details for the email
    const booking = await Bookings.findById(id)
      .populate("userId") // Populate user details
      .populate("treatmentId"); // Populate treatment details

    if (!booking) {
      return res.status(404).send({ error: "Booking not found for email" });
    }

    // Fetch all admins
    const admins = await Person.find({ TYPE: "Admin" });

    if (!admins || admins.length === 0) {
      console.warn("No admins found to send the email or SMS.");
    }

    // Prepare email details for admins
    const adminEmails = admins.map((admin) => admin.email);
    const adminPhoneNumbers = admins.map((admin) => admin.phone);

    // Combine user email and admin emails
    const recipients = [...adminEmails];
    const dynamicTemplateData = {
      booking_type: booking.treatmentId.type || "N/A",
      service_name: booking.treatmentId.title || "N/A",
      appointment_date: booking.selectedDate || "N/A",
      appointment_time: booking.selectedSlot || "N/A",
      user: `${booking.userId.firstName} ${booking.userId.lastName}` || "Valued Customer",
    };

    const msg = {
      to: recipients,
      from: process.env.FROM_EMAIL || "help.groomees@gmail.com",
      templateId: process.env.TEMPLATE_ID, // SendGrid template ID
      dynamicTemplateData,
    };

    // Send the cancellation email
    await sgMail.send(msg);

    // Send SMS to admins
    // for (const phoneNumber of adminPhoneNumbers) {
    //   if (phoneNumber) {
    //     await twilioClient.messages.create({
    //       body: `Booking Cancelled: ${dynamicTemplateData.service_name} on ${dynamicTemplateData.appointment_date} at ${dynamicTemplateData.appointment_time}.`,
    //       from: "+919145194195",
    //       to: `+91${phoneNumber}`, // Ensure phone numbers include the country code
    //     });
    //   }
    // }

    // Respond with the updated booking and email success
    res.status(200).json({
      success: true,
      message: "Booking cancelled, email sent, and SMS sent to admins successfully",
      updatedBooking,
    });
  } catch (error) {
    console.error("Error cancelling booking or sending email/SMS:", error);
    res.status(500).send({
      success: false,
      message: "Error cancelling booking or sending email/SMS",
      error: error,
    });
  }
});

module.exports = router;