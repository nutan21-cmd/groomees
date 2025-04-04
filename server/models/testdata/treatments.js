const mongoose = require("mongoose");
const {Treatment } = require("../treatment"); // Adjust the path as needed

// Connect to MongoDB
mongoose
  .connect("mongodb://nverma:teret@localhost:27017/admin", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Create a new treatment document
async function createTreatment() {
  const treatment = new Treatment({
    title: "Thai Massage",
    price: 1699,
    contentDescription: "A combination of stretching and pressure point techniques to increase flexibility",
    contentHighlights:"Thai massage combines stretching and acupressure techniques.\n It helps improve flexibility and body posture.\n Relieves muscle tension and joint stiffness.\n Boosts energy levels and blood circulation",
    imageUrl: "https://plus.unsplash.com/premium_photo-1661274122092-b9c89f8e9c70?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "67e76ef476a4636407fb1306"
  });

  try {
    const result = await treatment.save(); // Save the document to the database
    console.log("Treatment inserted:", result);
  } catch (err) {
    console.error("Error inserting treatment:", err.message);
  } finally {
    mongoose.disconnect(); // Disconnect from the database
  }
}

// Call the function to insert data
createTreatment();