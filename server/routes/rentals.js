const { Rental, validate } = require("../models/rental");

const validateObject = require("../middleware/validateObjectId");

const express = require("express");
const router = express.Router();

//get all rentals
router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

router.get("/detailed", async (req, res) => {
  const order = await Rental.find()
    .populate("storeID")
    .populate("bookID")
    .populate({
      path: "storeID",
      populate: {
        path: "owner",
        model: "Persons",
        select: "-password"
      }
    });
  res.send(order);
});

//get all rentals for customer
router.get("/customer/:id", validateObject, async (req, res) => {
  const rentals = await Rental.find({ customerID: req.params.id });
  res.send(rentals);
});

//get all rentals for store
router.get("/store/:id", validateObject, async (req, res) => {
  const rentals = await Rental.find({ storeID: req.params.storeID });
  res.send(rentals);
});

//add new rentals to cart
router.post("/", async (req, res) => {
  const newRental = new Rental({
    customerID: req.body.customerID,
    storeID: req.body.storeID,
    bookID: req.body.bookID,
    status: req.body.status,
    quantity: req.body.quantity,
    price: req.body.price,
    startDate: req.body.startDate,
    returnDate: req.body.returnDate,
    depositAmount: req.body.depositAmount
  });

  const saved = await newRental.save();
  res.send(saved);
});

//update existing rental status and quantity
router.put("/:id/updateRental", validateObject, async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    return res.status(404).send("The order with the given ID was not found.");
  } else {
    rental.status = req.body.status;
    rental.quantity = req.body.quantity;
    const saved = await rental.save();

    res.send(saved);
  }
});

//delete the rental from rental table
router.delete("/:id", validateObject, async (req, res) => {
  const deletedRental = await Rental.findByIdAndRemove(req.params.id);

  if (!deletedRental) {
    return res.status(404).send("The rental was not found");
  }

  res.send(deletedRental);
});

module.exports = router;
