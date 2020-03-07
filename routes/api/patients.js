const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// TODO:Add pharmacy in add medicine
// TODO:Profile part of doctor

// Load Admin model
const Doctor = require("../../models/Doctor");
const Result = require("../../models/Result");
const Patient = require("../../models/Patient");
const Medicine = require("../../models/Medicine");
const Councellor = require("../../models/Councellor");
const Guidlines = require("../../models/Guidlines");
const Appointment = require("../../models/Appointments");
const Status = require("../../models/Status");

// test
router.get("/test", (req, res) => {
  res.json({ msg: "Patient works" });
});

//signup
router.post("/signup", (req, res) => {
  password = req.body.password;
  Patient.findOne({ _id: req.body.id })
    .then(ptnt => {
      if (ptnt === null) {
        return res.status(400).json({ msg: "Check your id" });
      } else if (ptnt.password != null) {
        return res.status(400).json({ msg: "You are already registered" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;

            Patient.findOneAndUpdate(
              { _id: req.body.id },
              { $set: { password: password } }
            )
              .then(ptnt => {
                const payload = {
                  id: ptnt.id
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

  Patient.findById(id)
    .then(ptnt => {
      if (!ptnt) {
        // errors.email = "Admin not found";
        return res.status(404).json({ msg: "Patient not found" });
      }
      bcrypt
        .compare(password, ptnt.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: ptnt.id
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

// Get councelling centers
router.get(
  "/councellors",
  //   passport.authenticate("patient", { session: false }),
  (req, res) => {
    Councellor.find().then(cslr => {
      // if (cslr.length === 0) {
      //   res.json({ msg: "No councelling centers" });
      // }
      res.json(cslr);
    });
  }
);

// Councellor By Id
router.get("/councellor/:id", (req, res) => {
  Councellor.findById(req.params.id).then(cslr => {
    // if (cslr.length === 0) {
    //   res.json({ msg: "Data not found" });
    // }
    res.json(cslr);
  });
});

// Get Doctors
router.get(
  "/doctors",
  // passport.authenticate("patient", { session: false }),
  (req, res) => {
    Doctor.find().then(dr => {
      // if (dr.length === 0) {
      //   res.json({ msg: "No doctors" });
      // }
      res.json(dr);
    });
  }
);

// Doctor By Id
router.get("/doctor/:id", (req, res) => {
  Doctor.findById(req.params.id).then(dr => {
    // if (dr.length === 0) {
    //   res.json({ msg: "Data not found" });
    // }
    res.json(dr);
  });
});

// Book dr
router.post(
  "/doctor/book",
  passport.authenticate("patient", { session: false }),
  (req, res) => {
    const newBooking = {};
    newBooking.doctor = req.body.doctor;
    newBooking.patient = req.user.id;
    newBooking.date = req.body.date;

    Appointment.findOne({ patient: req.user.id })
      .then(apt => {
        new Appointment(newAppointment).save().then(apt => {
          res.json(apt);
        });
      })
      .catch(err => res.json(err));
  }
);

// Get Medicines
router.get(
  "/medicines",
  passport.authenticate("patient", { session: false }),
  (req, res) => {
    Medicine.find({ patient: req.user.id })
      .then(med => {
        if (med.length === 0) {
          return res.json({ msg: "No medicines" });
        }
        res.json(med);
      })
      .catch(err => res.json(err));
  }
);

// Get status
router.get(
  "medicines/:id/status",
  passport.authenticate("patient", { session: false }),
  (req, res) => {
    Status.find({ medicine: req.params.id }).then(st => {
      // if (st.length === 0) {
      //   res.json({ msg: "Status not updated" });
      // }
      res.json(st);
    });
  }
);

// Get Secret Key
router.get(
  "/medicine/:id/key",
  passport.authenticate("patient", { session: false }),
  (req, res) => {
    Medicine.findById(req.params.id).then(med => {
      // if (med.length === 0) {
      //   return res.json({ msg: "No key" });
      // }
      res.json({ key: med.key });
    });
  }
);

// Save delivery Address
router.post(
  "/delivery/address",
  passport.authenticate("patient", { session: false }),
  (req, res) => {
    Patient.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { deliveryAddress: req.body.deliveryAddress } }
    )
      .then(() => {
        res.json({ msg: "Success" });
      })
      .catch(err => {
        res.json(err);
      });
  }
);

// Get guidlines
router.get("/guidlines", (req, res) => {
  Guidlines.find().then(gd => {
    if (gd.length === 0) {
      res.json({ msg: "No guidlines" });
    }
    res.json(gd);
  });
});

// Results
router.get(
  "/results",
  passport.authenticate("patient", { session: false }),
  (req, res) => {
    Result.find({ patient: req.user.id })
      .then(results => {
        // if (results.length === 0) {
        //   return res.json({ msg: "No results" });
        // }
        res.json(results);
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;
