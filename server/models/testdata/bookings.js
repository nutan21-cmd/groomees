const mongoose = require("mongoose");
const {Bookings} = require("../bookings"); // Adjust the path as needed

// Connect to MongoDB
mongoose
  .connect("mongodb://nverma:teret@localhost:27017/admin", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Create a new packages document
async function createBookings() {
    const bookings = [
        {
            contentType: "treatment",
            status: "confirmed",
            selectedDate: "Feb 24",
            selectedSlot: "11:00 AM",
            refId: "67e788d1b441be77bdf68147",
            address: {
                flat: "101",
                area: "Green Street",
                landmark: "Near Park",
                pincode: "110011",
                city: "New Delhi"
            }
        },
        {
            contentType: "packages",
            status: "cancelled",
            refId: "67e8091a19c0d43cc5f107de",
            selectedDate: "Feb 25",
            selectedSlot: "2:00 PM",
            address: {
                flat: "202",
                area: "Blue Colony",
                landmark: "Opposite Mall",
                pincode: "110022",
                city: "Mumbai"
            }
        }
    ];
    try {
      const result = await Bookings.insertMany(bookings); // Save multiple packages to the database
      console.log("Bookings inserted:", result);
    } catch (err) {
      console.error("Error inserting bookings:", err.message);
    } finally {
      mongoose.disconnect(); // Disconnect from the database
    }
  } 

// Call the function to insert data
createBookings();
