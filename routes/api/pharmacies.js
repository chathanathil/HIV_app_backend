const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const uniqueRandom = require("unique-random");
const random = uniqueRandom(1, 1000);

// Load Admin model
const Pharmacy = require("../../models/Pharmacy");
const Medicine = require("../../models/Medicine");
// test
router.get("/test", (req, res) => {
  res.json({ msg: "Pharmacy works" });
});

//signup
router.post("/signup", (req, res) => {
  password = req.body.password;
  Pharmacy.findOne({ _id: req.body.id })
    .then(ph => {
      if (ph === null) {
        return res.status(400).json({ msg: "Check your id" });
      } else if (ph.password != null) {
        return res.status(400).json({ msg: "You are already registered" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;

            Pharmacy.findOneAndUpdate(
              { _id: req.body.id },
              { $set: { password: password } }
            )
              .then(ph => {
                const payload = {
                  id: ph.id,
                  name: ph.name,
                  phone: ph.phone,
                  address: ph.address
                };
                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  { expiresIn: 86400 },
                  (err, token) => {
                    res.json({
                      success: true,
                      token: "Bearer " + token
                    });
                  }
                );
              })
              .catch(err => res.json(err));
          });
        });
      }
    })
    .catch(err => res.json({ msg: "Check your id" }));
});

// Login
router.post("/login", (req, res) => {
  // const { errors, isValid } = validateLoginInput(req.body);

  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const id = req.body.id;
  const password = req.body.password;

  Pharmacy.findById(id)
    .then(ph => {
      if (!ph) {
        // errors.email = "Admin not found";
        return res.status(404).json({ msg: "Pharmacy not found" });
      }
      bcrypt
        .compare(password, ph.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: ph.id,
              name: ph.name,
              phone: ph.phone,
              address: ph.address
            };
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 86400 },
              (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              }
            );
          } else {
            return res.status(400).json({ msg: "Incorrect Password" });
          }
        })
        .catch(err => res.json(err));
    })
    .catch(err => res.json({ msg: "Check your id" }));
});

// Get medicines of the pharmacy
router.get(
  "/medicines",
  passport.authenticate("pharmacy", { session: false }),
  (req, res) => {
    Medicine.find({ pharmacy: req.user.id })
      .then(med => {
        if (med.length === 0) {
          return res.json({ msg: "No medcines given" });
        }
        res.json(med);
      })
      .catch(err => res.json(err));
  }
);

// Dispatch medicine
router.patch(
  "/dispatch",
  passport.authenticate("pharmacy", { session: false }),
  (req, res) => {
    var key = random();
    Medicine.findOneAndUpdate(
      { _id: req.body.medicine },
      {
        $set: {
          key: key,
          dispatched: true
        }
      }
    )
      .then(
        Status.findOneAndUpdate(
          { medicine: req.body.medicine },
          {
            $set: {
              dispatched: true
            }
          }
        )
      )
      .then(med => {
        res.json(med);
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;
