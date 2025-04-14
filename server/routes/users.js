const { Person, validate } = require("../models/person");
const bcrypt = require("bcryptjs");
const validateObject = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Joi = require("joi");


router.get("/:id", validateObject, async (req, res) => {
  const users = await Person.findById(req.params.id)
    .select("-__v")
    .select("-password")
    .sort("firstName");
  res.send(users);
});

router.get("/phone/:phone", async (req, res) => {
  const users = await Person.findOne({phone: req.params.phone})
    .select("-__v")
  res.send(users);
});

//get all the followers of the current user
router.get("/:id/followers", validateObject, async (req, res) => {
  const user = await Person.findById(req.params.id)
    .populate("followers")
    .select("-password");
  const followers = user.followers;
  if (followers.length == 1 && followers[0] == null) {
    res.send([]);
  }
  res.send(followers);
});

//get all users that i am following
router.get("/:id/following", validateObject, async (req, res) => {
  const allUsers = await Person.find()
    .select("-__v")
    .select("-password")
    .sort("firstName");

  const following = allUsers.filter(user =>
    user.followers.includes(req.params.id)
  );
  if (following.length == 1 && following[0] == null) {
    res.send([]);
  }

  res.send(following);
});

//add the current user as a follower of someone else
//id-->follows -->personId
router.put("/:id/follow/:personId", validateObject, async (req, res) => {
  const person = await Person.findById(req.params.personId);

  if (!person) {
    return res.status(404).send("The given person doesn't exist");
  }

  if (!person.followers.includes(req.params.id)) {
    //if already following ignore
    if (req.params.personId != req.params.id) {
      //i cant follow myself
      person.followers.push(req.params.id);
    }
  }
  const saved = await person.save();
  res.send(saved);
});

router.post("/register", async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let person = await Person.findOne({ phone: req.body.phone });
  if (person) return res.status(400).send("User is already registered.");

  person = new Person(
    _.pick(req.body, ["firstName", "lastName", "phone", "email", "address"])
  );
  person.TYPE = "User";
  await person.save();
    res.send(_.pick(person, ["_id", "firstName", "lastName", "TYPE", "email", "address"]));
});

function validateRegisterUser(body) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    firstName: Joi.string()
      .max(40)
      .required(),
    lastName: Joi.string()
      .max(40)
      .required(),
    phone: Joi.number().required(),
    address: Joi.object({
      flat: Joi.string().required(),
      area: Joi.string().required(),
      landmark: Joi.string().required(),
      pincode: Joi.string(),
      city: Joi.string().required()
    })
  };

  return Joi.validate(body, schema);
}

router.post("/:id", async (req, res) => {
  try {
    // Validate the request body
    const schema = Joi.object({
      firstName: Joi.string().max(40),
      lastName: Joi.string().max(40),
      phone: Joi.number(),
      email: Joi.string().email(),
      TYPE: Joi.string(),
      address: Joi.object({
        flat: Joi.string(),
        area: Joi.string(),
        landmark: Joi.string(),
        pincode: Joi.string(),
        city: Joi.string()
      })
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find the person by ID
    const person = await Person.findById(req.params.id);
    if (!person) return res.status(404).send("The person with the given ID was not found.");

    // Update the fields if they exist in the request body
    if (req.body.firstName) person.firstName = req.body.firstName;
    if (req.body.lastName) person.lastName = req.body.lastName;
    if (req.body.phone) person.phone = req.body.phone;
    if (req.body.email) person.email = req.body.email;
    if (req.body.address) person.address = req.body.address;

    // Save the updated person
    const updatedPerson = await person.save();

    // Send the updated person details in the response
    res.send(_.pick(updatedPerson, ["_id", "firstName", "lastName", "phone", "email", "address","TYPE"]));
  } catch (error) {
    res.status(500).send({ error: "An error occurred while updating the person.", details: error.message });
  }
});



//new user
// router.post("/", async (req, res) => {
//   let person = new Person({
//     TYPE: req.body.type,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     gender: req.body.gender,
//     email: req.body.email,
//     password: req.body.password,
//     dateOfBirth: new Date(req.body.dob),

//     addresses: [
//       {
//         street: req.body.street1,
//         city: req.body.city1,
//         state: req.body.state1,
//         zip: req.body.zip1,
//         isPrimary: true
//       },
//       {
//         street: req.body.street2,
//         city: req.body.city2,
//         state: req.body.state2,
//         zip: req.body.zip2
//       }
//     ],
//     phones: [
//       {
//         phone: req.body.phone1,
//         isPrimary: true
//       },
//       {
//         phone: req.body.phone2
//       }
//     ]
//   });

//   person.followers.push(req.params.id);
//   const saved = await person.save();
//   res.send({ _id: saved._id });
// });

//remove(unfollow) the current user as a follwer of someone else
router.delete("/:id/unfollow/:personId", validateObject, async (req, res) => {
  const person = await Person.findById(req.params.personId);

  if (!person) {
    return res.status(404).send("The given person doesn't exist");
  }

  var obj = person.followers.filter(x => x == req.params.id);

  if (obj.length == 0) {
    return res.status(404).send("The given person doesn't exist");
  } else {
    const index = person.followers.indexOf(obj[0]);
    person.followers.splice(index, 1);
    const saved = person.save();

    res.send(saved);
  }
});

router.put("/:id/feeds/", validateObject, async (req, res) => {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send("The given person doesn't exist");
  }
  person.feeds.push(req.body.feed);
  const saved = await person.save();
  res.send(saved);
});

router.get("/:id/feeds/", validateObject, async (req, res) => {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send("The given person doesn't exist");
  }
  res.send(person.feeds);
});

router.put("/:id/updateFollowers", validateObject, async (req, res) => {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send("The given person doesn't exist");
  }

  for (let i = 0; i < person.followers.length; i++) {
    if (person.followers[i] == null) continue;

    let follower = await Person.findById(person.followers[i]);
    follower.feeds.unshift(req.body.feed);
    await follower.save();
  }

  res.send(person);
});

router.put("/:id", validateObject, async (req, res) => {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send("The given person doesn't exist");
  }
  //only can update phone number and addresses
  if (person.addresses.length == 0) {
    if (req.body.street1)
      person.addresses.push({
        street: req.body.street1,
        city: req.body.city1,
        state: req.body.state1,
        zip: req.body.zip1
      });

    if (req.body.street2) {
      person.addresses.push({
        street: req.body.street2,
        city: req.body.city2,
        state: req.body.state2,
        zip: req.body.zip2
      });
    }
  } else if (person.addresses.length == 1) {
    if (req.body.street2) {
      person.addresses.push({
        street: req.body.street2,
        city: req.body.city2,
        state: req.body.state2,
        zip: req.body.zip2
      });
    }
  } else {
    person.addresses[0].street = req.body.street1;
    person.addresses[0].city = req.body.city1;
    person.addresses[0].state = req.body.state1;
    person.addresses[0].zip = req.body.zip1;

    person.addresses[1].street = req.body.street2;
    person.addresses[1].city = req.body.city2;
    person.addresses[1].state = req.body.state2;
    person.addresses[1].zip = req.body.zip2;
  }

  //phones
  if (person.phones.length == 0) {
    if (req.body.phone1) person.phones.push({ phone: req.body.phone1 });
  } else if (person.phones.length == 1) {
    if (req.body.phone2) person.phones.push({ phone: req.body.phone2 });
  } else {
    person.phones[0].phone = req.body.phone1;
    person.phones[1].phone = req.body.phone2;
  }
  const saved = await person.save();
  res.send(saved);
});

router.delete("/:id", validateObject, async (req, res) => {
  const person = await Person.findById(req.params.id);

  if (!person) {
    return res.status(404).send("The given person doesn't exist");
  }

  const deleted = await Person.findByIdAndRemove(req.params.id);

  res.send(deleted);
});

module.exports = router;
