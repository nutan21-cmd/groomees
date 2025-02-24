const { Cart, validate } = require("../models/cart");
const validateObject = require("../middleware/validateObjectId");
const { Order } = require("../models/order");
const { Rental } = require("../models/rental");
const { Bookstore } = require("../models/bookstore");
const moment = require("moment");

const express = require("express");
const router = express.Router();

//get all carts
router.get("/", async (req, res) => {
  const carts = await Cart.find();
  res.send(carts);
});

//get the cart for the customer
router.get("/customer/:customerId", async (req, res) => {
  const carts = await Cart.find({ customerID: req.params.customerId })
    .populate("rentals")
    .populate("orders")
    .populate({
      path: "orders",
      populate: "storeID bookID"
    });

  if (carts.length == 0) {
    const cart = new Cart({
      customerID: req.params.customerId,
      orders: [],
      rentals: []
    });
    const saved = await cart.save();
    res.send(saved);
  } else {
    res.send(carts[0]);
  }
});

//adding books to the cart
router.put("/addToCart", async (req, res) => {
  const { customerID, storeID, bookID } = req.body;
  let customerCart = await Cart.findOne({ customerID });
  if (!customerCart) {
    customerCart = new Cart({
      customerID,
      orders: [],
      rentals: []
    });
  }
  //we got the customer cart now

  //check if customer has already added this book from this store to his cart
  const order = await Order.findOne({
    customerID,
    storeID,
    bookID,
    status: "ADDED TO CART"
  });

  if (order) {
    console.log("book from this store is already added to cart");
    order.quantity += 1;
    await order.save();
    res.send(order);
  } else {
    //create new order-add to cart,find its price and push it to cart
    const store = await Bookstore.findById(storeID);
    const price = store.inventory.filter(i => i.bookID == bookID)[0].price;

    const newOrder = new Order({
      customerID: customerID,
      storeID: storeID,
      bookID: bookID,
      status: "ADDED TO CART",
      price: price,
      quantity: 1
    });

    const saved = await newOrder.save();
    customerCart.orders.push(saved._id);
    const updated = await customerCart.save();
    res.send(updated);
  }
});

//Renting book
router.put("/rentToCart", async (req, res) => {
  const { customerID, storeID, bookID } = req.body;
  let customerCart = await Cart.findOne({ customerID });
  if (!customerCart) {
    customerCart = new Cart({
      customerID,
      orders: [],
      rentals: []
    });
  }
  //we got the customer cart now

  //check if customer has already added this book from this store to his cart
  const order = await Rental.findOne({
    customerID,
    storeID,
    bookID,
    status: "ADDED TO CART"
  });

  if (order) {
    console.log("book from this store is already added to cart");
    order.quantity += 1;
    await order.save();
    res.send(order);
  } else {
    //create new order-add to cart,find its price and push it to cart
    const store = await Bookstore.findById(storeID);
    const price =
      store.inventory.filter(i => i.bookID == bookID)[0].price * 0.01;

    const newOrder = new Rental({
      customerID: customerID,
      storeID: storeID,
      bookID: bookID,
      status: "ADDED TO CART",
      dailyRentalRate: price,
      quantity: 1
    });

    const saved = await newOrder.save();
    customerCart.rentals.push(saved._id);
    const updated = await customerCart.save();
    res.send(updated);
  }
});

//get the cart by cartID
router.get("/:id", async (req, res) => {
  const carts = await Cart.findById(req.params.id);
  res.send(carts);
});

//add a new cart
router.post("/", async (req, res) => {
  const newCart = new Cart({
    customerID: req.body.customerID,
    orders: req.body.orders,
    rentals: req.body.rentals
  });

  const saved = await newCart.save();
  res.send(saved);
});

//update a cart by adding new orders to cart
router.put("/:id/order", validateObject, async (req, res) => {
  const cart = await Cart.findById(req.params.id);

  cart.orders.push(req.body.orderId);
  const saved = await cart.save();
  res.send(saved);
});

//update a cart by removing all orders and rentals from cart
router.put("/:id/checkout/", validateObject, async (req, res) => {
  const cart = await Cart.findById(req.params.id);

  for (let i = 0; i < cart.orders.length; i++) {
    const order = await Order.findById(cart.orders[i]);
    order.status = "BOUGHT";
    order.orderedDate = moment();
    await order.save();
    //update bookstore

    //update bookshelf
    //update followers
  }
  //updating rentals

  for (var j = 0; j < cart.rentals.length; j++) {
    const rental = await Rental.findById(cart.rentals[j]);
    rental.status = "RENTED";
    (rental.startDate = moment()),
      (rental.returnDate = moment().add(30, "days"));
    await rental.save();
  }

  //UPDATING QUANTITY IN BOOKSTORES
  for (let i = 0; i < cart.orders.length; i++) {
    const order = await Order.findById(cart.orders[i]);
    const store = await Bookstore.findById(order.storeID);
    // console.log(store.inventory);
    // console.log(order.bookID);
    const bookID = order.bookID.toString();
    const inventory = store.inventory.filter(inv => inv.bookID == bookID)[0];
    //console.log(inventory);
    const index = store.inventory.indexOf(inventory);
    //console.log(index);
    store.inventory[index].quantity -= order.quantity;
    await store.save();
  }
  for (let i = 0; i < cart.rentals.length; i++) {
    const order = await Rental.findById(cart.rentals[i]);
    const store = await Bookstore.findById(order.storeID);
    // console.log(store.inventory);
    // console.log(order.bookID);
    const bookID = order.bookID.toString();
    const inventory = store.inventory.filter(inv => inv.bookID == bookID)[0];
    //console.log(inventory);
    const index = store.inventory.indexOf(inventory);
    //console.log(index);
    store.inventory[index].quantity -= order.quantity;
    await store.save();
  }

  cart.orders = [];
  cart.rentals = [];

  const saved = await cart.save();
  res.send(saved);
});

//update a cart by adding new rentals to cart
router.put("/:id/rental", validateObject, async (req, res) => {
  const cart = await Cart.findById(req.params.id);

  cart.rentals.push(req.body.rentalId);
  const saved = await cart.save();
  res.send(saved);
});

// delete an order from a cart
router.delete("/:id/order/:orderId", validateObject, async (req, res) => {
  const cart = await Cart.findById(req.params.id);

  if (!cart) {
    return res.status(404).send("The given cart ID doesn't exist");
  }

  var obj = cart.orders.filter(x => x == req.params.orderId.toString());
  if (obj.length == 0) {
    return res.status(404).send("The given order ID doesn't exist in cart");
  } else {
    await Order.findByIdAndRemove(req.params.orderId);
    const index = cart.orders.indexOf(obj[0]);
    cart.orders.splice(index, 1);
    const saved = await cart.save();
    res.send(saved);
  }
});

router.delete("/:id/rental/:rentalId", validateObject, async (req, res) => {
  const cart = await Cart.findById(req.params.id);

  if (!cart) {
    return res.status(404).send("The given cart ID doesn't exist");
  }

  var obj = cart.rentals.filter(x => x == req.params.rentalId);
  if (obj.length == 0) {
    return res.status(404).send("The given rental ID doesn't exist in cart");
  } else {
    await Rental.findByIdAndRemove(req.params.rentalId);

    const index = cart.rentals.indexOf(obj[0]);
    cart.rentals.splice(index, 1);
    const saved = await cart.save();
    res.send(saved);
  }
});

//delete the cart for a given customer
router.delete("/:id", validateObject, async (req, res) => {
  const deletedCart = await Cart.findByIdAndRemove(req.params.id);

  if (!deletedCart) {
    return res.status(404).send("The cart for given customer was not found");
  }

  res.send(deletedCart);
});

module.exports = router;
