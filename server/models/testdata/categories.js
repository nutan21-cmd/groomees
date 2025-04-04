const mongoose = require("mongoose");
const { Categories } = require("../categories"); // Corrected the import

// Connect to MongoDB
mongoose
  .connect("mongodb://nverma:teret@localhost:27017/admin", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Create dummy categories
async function createCategories() {
  const categories = [
    {
      title: "Facial",
      imageUrl:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Waxing",
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1664187387146-241276b3f326?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Hair",
      imageUrl:
        "https://images.unsplash.com/photo-1470259078422-826894b933aa?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Makeup",
      imageUrl:
        "https://images.unsplash.com/photo-1643185450492-6ba77dea00f6?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Body Massage",
      imageUrl:
        "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  try {
    const result = await Categories.insertMany(categories); // Corrected the model name
    console.log("Categories inserted:", result);
  } catch (err) {
    console.error("Error inserting categories:", err.message);
  } finally {
    mongoose.disconnect(); // Disconnect from the database
  }
}

// Call the function to insert data
createCategories();