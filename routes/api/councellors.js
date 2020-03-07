const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load model
const Councellor = require("../../models/Councellor");
const Patient = require("../../models/Patient");
const Result = require("../../models/Result");

// test
router.get("/test", (req, res) => {
  res.json({ msg: "Councellor works" });
});

//signup
router.post("/signup", (req, res) => {
  password = req.body.password;

  Councellor.findOne({ _id: req.body.id })
    .then(cslr => {
      if (cslr === null) {
        return res.status(400).json({ msg: "Check your id" });
      } else if (cslr.password != null) {
        return res.status(400).json({ msg: "You are already registered" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;

            Councellor.findOneAndUpdate(
              { _id: req.body.id },
              { $set: { password: password } }
            )
              .then(cslr => {
                const payload = {
                  id: cslr.id,
                  name: cslr.name,
                  phone: cslr.phone,
                  address: cslr.address
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
    .catch(err => res.json(err));
});

// Login
router.post("/login", (req, res) => {
  // const { errors, isValid } = validateLoginInput(req.body);

  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const id = req.body.id;
  const password = req.body.password;

  Councellor.findById(id)
    .then(cslr => {
      if (!cslr) {
        // errors.email = "Admin not found";
        return res.status(404).json({ msg: "Councellor not found" });
      }
      bcrypt
        .compare(password, cslr.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: cslr.id,
              name: cslr.name,
              phone: cslr.phone,
              address: cslr.address
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

// Register a patient
router.post(
  "/patients/add",
  passport.authenticate("councellor", { session: false }),
  (req, res) => {
    const newPatient = {};
    newPatient.councellor = req.user.id;
    Patient.findOne({ councellor: req.user.id }).then(pts => {
      new Patient(newPatient).save().then(pts => res.json(pts));
    });
  }
);

// Open patient account
router.get(
  "/patients/open/:id",
  passport.authenticate("councellor", { session: false }),
  (req, res) => {
    id = req.params.id;
    Patient.findById(id)
      .then(pts => {
        if (!pts) {
          return res.status(404).json({ msg: "Patient not found" });
        } else {
          res.json({ msg: "Success" });
        }
      })
      .catch(err => res.json({ msg: "Check id" }));
  }
);

// Add result
router.post(
  "/result/add",
  passport.authenticate("councellor", { session: false }),
  (req, res) => {
    const newResult = {};
    newResult.councellor = req.user.id;
    newResult.patient = req.body.patient;
    newResult.date = req.body.date;
    newResult.subject = req.body.subject;
    newResult.description = req.body.description;
    newResult.result = req.body.result;

    Result.findOne({ councellor: req.user.id }).then(rst => {
      new Result(newResult).save().then(rst => {
        res.json(rst);
      });
    });
  }
);

module.exports = router;
