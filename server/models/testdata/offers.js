const mongoose = require("mongoose");
const {Offers} = require("../offers"); // Adjust the path as needed

// Connect to MongoDB
mongoose
  .connect("mongodb://nverma:teret@localhost:27017/admin", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Create a new packages document
async function createOffers() {
    const offers = [
        {
          "title": "Luxury Rejuvenation Facial",
          "price": 79.99,
          "contentDescription": "An advanced facial designed to rejuvenate and restore your skin's natural glow.",
          "contentHighlights": "Deep cleansing and exfoliation.\n Hydrating mask with essential nutrients.\n Reduces fine lines and brightens complexion.\n Uses premium organic skincare products.",
          "imageUrl": "https://www.shutterstock.com/image-photo/makeup-artist-applies-powder-blush-600nw-1805797540.jpg"
        },
        {
          "title": "Royal Manicure & Pedicure",
          "price": 59.99,
          "contentDescription": "An elegant hand and foot care experience with exfoliation, massage, and nail art.",
          "contentHighlights": "Nail shaping and cuticle care.\n Choice of premium nail polish and designs.\n Relaxing hand and foot massage.\n Long-lasting glossy or matte finish.",
          "imageUrl": "https://m.media-amazon.com/images/I/712voSOZU6L._AC_UF350,350_QL50_.jpg"
        },
        {
          "title": "Silk Smooth Hair Spa",
          "price": 89.99,
          "contentDescription": "A luxurious hair treatment to repair, hydrate, and add shine to your hair.",
          "contentHighlights": "Deep conditioning with natural oils.\n Scalp massage to promote hair growth.\n Strengthens and smooths hair texture.\n Free from sulfates and harsh chemicals.",
          "imageUrl": "https://www.bodycraft.co.in/wp-content/uploads/attractive-african-woman-enjoying-face-massage-spa-salon-scaled.jpg"
        },
        {
          "title": "Glamorous Makeover Session",
          "price": 99.99,
          "contentDescription": "A complete transformation with professional makeup and hairstyling for a stunning look.",
          "contentHighlights": "Customized makeup based on skin type.\n Elegant hairstyling with curls or updos.\n Includes consultation for the perfect look.\n Ideal for special events and parties.",
          "imageUrl": "https://c1.wallpaperflare.com/preview/237/131/775/este-aroma-body-treatments-oil-massage-salon-relaxation.jpg"
        },
        {
          "title": "Bridal Glow Package",
          "price": 199.99,
          "contentDescription": "A premium bridal beauty package to make you shine on your special day.",
          "contentHighlights": "Bridal facial for radiant skin.\n Full bridal makeup and hairstyling.\n Manicure and pedicure included.\n Special pre-wedding skincare consultation.",
          "imageUrl": "https://s3.amazonaws.com/salonclouds-uploads/blog/blog_16003400141580661114.png"
        }
      ]
      
  
    try {
      const result = await Offers.insertMany(offers); // Save multiple packages to the database
      console.log("Offers inserted:", result);
    } catch (err) {
      console.error("Error inserting packages:", err.message);
    } finally {
      mongoose.disconnect(); // Disconnect from the database
    }
  }

// Call the function to insert data
createOffers();