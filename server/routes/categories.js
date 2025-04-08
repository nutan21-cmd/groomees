const { Categories } = require("../models/categories");
const { Treatment } = require("../models/treatment");

const isoLangs = require("../utilities/language");

const auth = require("../middleware/auth");

const express = require("express");
const router = express.Router();

//get all category
router.get("/", async (req, res) => {
  const books = await Categories.find()
    .sort("title");
  res.send(books);
});

// Create a new category
router.post("/", async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    // Validate the input
    if (!title || title.trim() === "") {
      return res.status(400).send({ error: "Title is required" });
    }

    // Create a new category
    const newCategory = new Categories({
      title,
      imageUrl,
    });

    const savedCategory = await newCategory.save();
    res.status(201).send(savedCategory);
  } catch (error) {
    res.status(500).send({ error: "Error creating category", details: error.message });
  }
});

// Delete a category by ID
router.delete("/:id", async (req, res) => {
  try {
    const category = await Categories.findByIdAndRemove(req.params.id);

    if (!category) {
      return res.status(404).send({ error: "Category not found" });
    }

    res.status(200).send({ message: "Category deleted successfully", category });
  } catch (error) {
    res.status(500).send({ error: "Error deleting category", details: error.message });
  }
});

// Update a category by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    // Validate the input
    if (!title || title.trim() === "") {
      return res.status(400).send({ error: "Title is required" });
    }

    // Find and update the category
    const updatedCategory = await Categories.findByIdAndUpdate(
      req.params.id,
      { title, imageUrl },
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).send({ error: "Category not found" });
    }

    res.status(200).send(updatedCategory);
  } catch (error) {
    res.status(500).send({ error: "Error updating category", details: error.message });
  }
});

router.get("/:id/treatments", async (req, res) => {
  const books = await Treatment.find({ categoryId: req.params.id})
  res.send(books);
});
module.exports = router;
