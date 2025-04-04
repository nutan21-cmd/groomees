const mongoose = require("mongoose");
const {Packages} = require("../packages"); // Adjust the path as needed

// Connect to MongoDB
mongoose
  .connect("mongodb://nverma:teret@localhost:27017/admin", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Create a new packages document
async function createPackages() {
    const packages = [
      {
        title: "Princess Glow Facial",
        price: 49.99,
        contentDescription: "A gentle facial designed for young skin, leaving it fresh and radiant.",
        contentHighlights: "Deep cleansing and hydration.\n Reduces blemishes and dryness.\n Leaves skin soft and glowing.\n Uses kid-friendly, organic products.",
        imageUrl: "https://franchiseindia.s3.ap-south-1.amazonaws.com/uploads/content/wi/art/5cbdb26663682.jpeg",
      },
      {
        title: "Sparkle Mani-Pedi",
        price: 39.99,
        contentDescription: "A fun and colorful manicure and pedicure experience with glitter and nail art.",
        contentHighlights: "Includes nail shaping and buffing.\n Choice of fun colors and designs.\n Hydrating hand and foot massage.\n Non-toxic, kid-safe nail polish used.",
        imageUrl: "https://images.click.in/classifieds/images/190/10_09_2019_03_33_16_cf18eef695d8cc4b882f1cd33258374e_umdaqn26iv.jpeg",
      },
      {
        title: "Fairy Tale Hair Spa",
        price: 59.99,
        contentDescription: "A relaxing hair spa treatment that nourishes and strengthens young hair.",
        contentHighlights: "Gentle shampoo and deep conditioning.\n Scalp massage for relaxation.\n Hairstyling with braids or curls.\n Uses mild, sulfate-free hair products.",
        imageUrl: "https://m.media-amazon.com/images/I/71s5dPueqqL._AC_UF894,1000_QL80_.jpg",
      },
      {
        title: "Mini Diva Makeover",
        price: 69.99,
        contentDescription: "A fun makeover session with light makeup, hairstyling, and a fashion photoshoot.",
        contentHighlights: "Light, age-appropriate makeup.\n Trendy hairstyles and accessories.\n Mini photo session with props.\n Perfect for birthdays or special occasions.",
        imageUrl: "https://miro.medium.com/v2/resize:fit:971/1*7UtG8D7IdHiQObxzO6rxIw.jpeg",
      },
      {
        title: "Ultimate Pamper Party",
        price: 99.99,
        contentDescription: "A complete pampering package with facial, mani-pedi, and hairstyling for a full salon experience.",
        contentHighlights: "Includes facial, manicure, pedicure, and hairstyling.\n Relaxing spa atmosphere.\n Group package available for parties.\n Special goodie bags for kids.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvwbeaDIzlW5SYAdYqafRJwqYj3QS9g4o7UA&s",
      },
    ];
  
    try {
      const result = await Packages.insertMany(packages); // Save multiple packages to the database
      console.log("Packages inserted:", result);
    } catch (err) {
      console.error("Error inserting packages:", err.message);
    } finally {
      mongoose.disconnect(); // Disconnect from the database
    }
  }

// Call the function to insert data
createPackages();