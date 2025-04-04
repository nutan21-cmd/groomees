const { Treatment, validate } = require("../models/treatment");
const auth = require("../middleware/auth");

const express = require("express");
const { Categories } = require("../models/categories");
const router = express.Router();

//get all Treatments
router.get("/", async (req, res) => {
  const books = await Treatment.find()
    .sort("title");
  res.send(books);
});

router.get("/:id", async (req, res) => {
  const treatment = await Treatment.findById(req.params.id);
  res.send(treatment);
});

router.post("/", async (req, res) => {
  try {
      const { title, price, contentDescription, contentHighlights, imageUrl, categoryId, type } = req.body;
      // save person's address from booking if not already exist
      const category = await Categories.findById(categoryId);
      if (!category._id) {
          res.status(404).send("category not found")
      }

      const newTreatment = new Treatment({
          title,
          price,
          contentDescription,
          contentHighlights,
          imageUrl,
          categoryId,
          type,
      });
      const savedTreatment = await newTreatment.save();

      // Populate the treatmentId field to include the full Treatment object
      const populatedTreatment = await Treatment.findById(savedTreatment._id)
          .populate("categoryId") // Populate the treatmentId field
      res.status(200).send(populatedTreatment);
  } catch (error) {
      res.status(500).send({ error: "Error creating Treatment", details: error.message });
  }
});



module.exports = router;
