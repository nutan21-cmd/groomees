const { Order, validate } = require("../models/order");
const { Bookstore } = require("../models/bookstore");

const validateObject = require("../middleware/validateObjectId");

const express = require("express");
const router = express.Router();

//get all orders
router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.send(orders);
});

router.get("/detailed", async (req, res) => {
  const order = await Order.find()
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

//get all orders for customer
router.get("/customer/:id", validateObject, async (req, res) => {
  const orders = await Order.find({ customerID: req.params.id });
  res.send(orders);
});

//get all orders for store
router.get("/store/:id", validateObject, async (req, res) => {
  const orders = await Order.find({ storeID: req.params.storeID });
  res.send(orders);
});

//add new order to cart
router.post("/", async (req, res) => {
  //calculate price
  const store = await Bookstore.findById(req.body.storeID);
  const price = store.inventory.filter(i => i.bookID == req.body.bookID)[0]
    .price;
  const inventory = store.inventory.filter(i => i.bookID == req.body.bookID)[0];
  const index = store.inventory.indexOf(inventory);
  store.inventory[index].quantity -= 1;

  await store.save();

  const newOrder = new Order({
    customerID: req.body.customerID,
    storeID: req.body.storeID,
    bookID: req.body.bookID,
    status: req.body.status,
    price: price,
    quantity: req.body.quantity
  });

  const saved = await newOrder.save();
  res.send(saved);
});

//update existing order status and quantity
router.put("/:id/updateOrder", validateObject, async (req, res) => {
  const order = await Order.findById(req.params.id);
  //console.log(order);
  //update quantity in store
  const store = await Bookstore.findById(order.storeID);
  console.log(store);
  console.log(bookID);
  const inventory = store.inventory.filter(i => i.bookID == order.bookID)[0];
  const index = store.inventory.indexOf(inventory);
  //console.log(index);
  //console.log(inventory);
  store.inventory[index].quantity -= req.body.quantity;
  await store.save();

  if (!order) {
    return res.status(404).send("The order with the given ID was not found.");
  } else {
    order.status = req.body.status;
    order.quantity = req.body.quantity;
    const saved = await order.save();
    res.send(saved);
  }
});

//delete the order from order table
router.delete("/:id", validateObject, async (req, res) => {
  const deletedOrder = await Order.findByIdAndRemove(req.params.id);

  if (!deletedOrder) {
    return res.status(404).send("The order was not found");
  }

  res.send(deletedOrder);
});

module.exports = router;
