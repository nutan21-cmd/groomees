const { Bookstore, validate } = require("../models/bookstore");
const { Person } = require("../models/person");
const validateObject = require("../middleware/validateObjectId");
const { authMiddleware } = require("../middleware/auth");
const { Book } = require("../models/book");
//const admin = require("../middleware/admin");
//const validateObjectId = require("../middleware/validateObjectId");
//const moment = require("moment");
const express = require("express");
const router = express.Router();

//get all books
router.get("/", async (req, res) => {
  const bookstores = await Bookstore.find()
    .populate("owner", "-password")
    .populate("inventory.bookID");
  res.send(bookstores);
});

router.get("/owner/:id", async (req, res) => {
  const bookstore = await Bookstore.findOne({ owner: req.params.id });

  res.send(bookstore);
});

//get all books
router.get("/books", async (req, res) => {
  const bookstores = await Bookstore.find()
    .populate("owner", "-password")
    .populate("inventory.bookID")
    .populate({
      path: "inventory.bookID",
      populate: {
        path: "author",
        model: "Persons",
        select: "-password"
      }
    });
  let resultArray = [];

  for (var i = 0; i < bookstores.length; i++) {
    let id = bookstores[i]._id;
    let address = bookstores[i].owner.addresses[0];
    for (var j = 0; j < bookstores[i].inventory.length; j++) {
      let resultObject = JSON.parse(
        JSON.stringify(bookstores[i].inventory[j].bookID)
      );
      resultObject["storeID"] = id;
      resultObject.storeAddress = address;
      resultObject.storeName =
        bookstores[i].owner.firstName +
        " " +
        bookstores[i].owner.lastName +
        "-" +
        resultObject.storeAddress.zip;
      resultObject.zip = resultObject.storeAddress.zip;
      resultObject.quantity = bookstores[i].inventory[j].quantity;
      resultObject.price = bookstores[i].inventory[j].price;
      resultArray.push(resultObject);
    }
  }
  res.send(resultArray);
});

//get bookstore by id
router.get("/:id", async (req, res) => {
  const bookstores = await Bookstore.findById(req.params.id);
  res.send(bookstores);
});

//todo get/:id
router.post("/", async (req, res) => {
  const already = await Bookstore.findOne({ owner: req.body.owner });
  if (already) {
    return res.status(400).send("Owner already owns a store.");
  }
  const person = await Person.findById(req.body.owner);
  if (!person || person.TYPE != "Owner")
    return res.status(400).send("Invalid owner.");

  const store = new Bookstore({
    owner: req.body.owner,
    inventory: req.body.inventory
  });
  const saved = await store.save();
  res.send(saved);
});

//update the bookstore
//1.change the owner
//2.replace the array of inventory
router.put("/:id", validateObject, async (req, res) => {
  const bookStore = await Bookstore.findByIdAndUpdate(
    req.params.id,
    {
      owner: req.body.owner,
      inventory: req.body.inventory
    },
    { new: true }
  );

  if (!bookStore)
    return res
      .status(404)
      .send("The Bookstore with the given ID was not found.");

  res.send(bookStore);
});

//add a new book to this store's inventory
router.put("/:id/add", validateObject, async (req, res) => {
  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
  if (req.body.quantity < 0) {
    return res.status(400).send("quantity must be positive");
  }

  if (req.body.price < 0) {
    return res.status(400).send("price must be positive");
  }
  const bookStore = await Bookstore.findById(req.params.id);
  var obj = bookStore.inventory.filter(x => x.bookID == req.body.bookID);
  if (obj.length == 0) {
    //no such book exists already
    bookStore.inventory.push(req.body);
    const updated = await bookStore.save();
    res.send(updated);
  } else {
    //bookstore contains this book
    const index = bookStore.inventory.indexOf(obj[0]);
    bookStore.inventory[index].quantity = req.body.quantity;

    bookStore.inventory[index].price = req.body.price;
    const updated = await bookStore.save();
    res.send(updated);
  }
});

// router.get("/addhack", async (req, res) => {
//   const books = Book.find({ genre: "" });
// });

//delete an existing book from the store's inventory
router.delete("/:id/book/:bookID", validateObject, async (req, res) => {
  const bookStore = await Bookstore.findById(req.params.id);

  var obj = bookStore.inventory.filter(x => x.bookID == req.params.bookID);
  if (obj.length == 0) {
    return res.status(404).send("This book doesn't exist in this bookstore");
  } else {
    //bookstore contains this book
    const index = bookStore.inventory.indexOf(obj[0]);
    bookStore.inventory.splice(index, 1);

    const updated = await bookStore.save();
    res.send(updated);
  }
});

router.delete("/:id", validateObject, async (req, res) => {
  const bookStore = await Bookstore.findById(req.params.id);

  if (!bookStore) {
    return res.status(404).send("This bookstore doesn't exist!");
  }
  const deleted = await Bookstore.deleteOne({ _id: req.params.id });
  res.send(deleted);
});

module.exports = router;
