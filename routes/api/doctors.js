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
const Status = require("../../models/Status");

// test
router.get("/test", (req, res) => {
  res.json({ msg: "Doctor works" });
});

//signup
router.post("/signup", (req, res) => {
  password = req.body.password;
  Doctor.findOne({ _id: req.body.id })
    .then(dr => {
      if (dr === null) {
        return res.status(400).json({ msg: "Check your id" });
      } else if (dr.password != null) {
        return res.status(400).json({ msg: "You are already registered" });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;

            Doctor.findOneAndUpdate(
              { _id: req.body.id },
              { $set: { password: password } }
            )
              .then(dr => {
                const payload = {
                  id: dr.id,
                  name: dr.name,
                  phone: dr.phone,
                  hospital: dr.hospital
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

  Doctor.findById(id)
    .then(dr => {
      if (!dr) {
        // errors.email = "Admin not found";
        return res.status(404).json({ msg: "Doctor not found" });
      }
      bcrypt
        .compare(password, dr.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              id: dr.id,
              name: dr.name,
              phone: dr.phone,
              hospital: dr.hospital
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

// Open patient account
router.get(
  "/patients/open/:id",
  passport.authenticate("doctor", { session: false }),
  (req, res) => {
    patient = req.body.patient;
    Patient.findOne({ _id: req.params.id })
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

//get results by patients
router.get(
  "/results/:id",
  passport.authenticate("doctor", { session: false }),
  (req, res) => {
    Result.find({ patient: req.params.id })
      .then(result => {
        if (result.length === 0) {
          return res.json({ msg: "No results uploaded" });
        }
        res.json(result);
      })
      .catch(err => res.json(err));
  }
);

// Add result
router.post(
  "/result/add",
  passport.authenticate("doctor", { session: false }),
  (req, res) => {
    const newResult = {};
    newResult.doctor = req.user.id;
    newResult.patient = req.body.patient;
    newResult.date = req.body.date;
    newResult.subject = req.body.subject;
    newResult.description = req.body.description;
    newResult.result = req.body.result;

    Result.findOne({ doctor: req.user.id }).then(rst => {
      new Result(newResult).save().then(rst => {
        res.json(rst);
      });
    });
  }
);

// Add medicine
router.post(
  "/medicine/add",
  passport.authenticate("doctor", { session: false }),
  (req, res) => {
    const newMedicine = {};
    newMedicine.doctor = req.user.id;
    newMedicine.patient = req.body.patient;
    newMedicine.pharmacy = req.body.pharmacy;
    newMedicine.date = req.body.date;
    newMedicine.medicines = [];

    Medicine.findOne({ doctor: req.user.id }).then(med => {
      req.body.medicine.map(item => {
        return newMedicine.medicines.push(item);
      });
      new Medicine(newMedicine).save().then(med => {
        res.json(med);
        const newStatus = {};
        newStatus.medicine = med._id;
        newStatus.doctor = true;

        // updating status
        Status.findOne({ medicine: med._id }).then(st => {
          new Status(newStatus)
            .save()
            .then(st => {
              res.json(st);
            })
            .catch(err => {
              res.json(err);
            });
        });
      });
    });
  }
);

// Get medicines of a patient
router.get(
  "/medicines/:id",
  passport.authenticate("doctor", { session: false }),
  (req, res) => {
    Medicine.find({ patient: req.params.id })
      .then(med => {
        if (med.length === 0) {
          return res.json({ msg: "No medcines given" });
        }
        res.json(med);
      })
      .catch(err => res.json(err));
  }
);

// Get appointments
router.get(
  "/appointments/:month/:year",
  passport.authenticate("doctor", { session: false }),
  (req, res) => {
    const month = req.params.month;
    const year = req.params.year;
    const apptmnts = [];
    Doctor.findById(req.user.id)
      .then(dr => {
        dr.appointments.map(item => {
          if (item.date.month === month && item.date.year === year) {
            apptmnts.push(item);
          }
        });
        if (apptmnts.length === 0) {
          return res.json({ msg: "No Appointments" });
        }
        res.json(apptmnts);
      })
      .catch(err => res.json(err));
  }
);

// Add max and booking
router.post(
  "/appointments/add/:month/:year",
  passport.authenticate("doctor", { session: false }),
  (req, res) => {
    Doctor.findById(req.user.id)
      .then(dr => {
        if (dr.length === 0) {
          return res.json({ msg: "Check your id" });
        } else {
          dr.appointments.map(item => {
            if (item.date.month === month && item.date.year === year) {
              item.remove();
            }
          });
          var apt;
          req.body.appointments.map(item => {
            return apt.push({
              day: item.day,
              month: item.month,
              year: item.year,
              max: item.max,
              booking: item.booking
            });
          });
          Doctor.findOneAndUpdate(
            { _id: req.user.id },
            {
              $set: {
                appointments: apt
              }
            }
          )
            .then(aptmnt => res.json(aptmnt))
            .catch(err => res.json(err));
        }
      })
      .catch(err => res.json(err));
  }
);

// Edit appointments
router.patch(
  "/appointments/edit",
  passport.authenticate("doctor", { session: false }),
  (req, res) => {
    date = req.body.date;
    max = req.body.max;
    Doctor.findById(req.user.id).then(dr => {
      if (dr.length === 0) {
        return res.json({ msg: "Check your id" });
      } else {
        dr.appoinments.map((item, index) => {
          if (item.date === date && item.max === 0) {
            max;
          }
        });
      }
    });
  }
);

module.exports = router;
