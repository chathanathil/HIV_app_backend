const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load models
const Admin = require("../../models/Admin");
const Councellor = require("../../models/Councellor");
const Doctor = require("../../models/Doctor");
const Guidlines = require("../../models/Guidlines");
const Pharmacy = require("../../models/Pharmacy");

// test
router.get("/test", (req, res) => {
  res.json({ msg: "Admin works" });
});

//signup
router.post("/signup", (req, res) => {
  Admin.findOne({ email: req.body.email }).then(admin => {
    if (admin) {
      return res.status(400).json({ msg: "Email already exist" });
    } else {
      const newAdmin = new Admin({
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
          if (err) throw err;
          newAdmin.password = hash;

          newAdmin
            .save()
            .then(admin => {
              const payload = {
                id: admin.id,
                email: admin.email
              };
              console.log(admin);
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
  });
});

// Login
router.post("/login", (req, res) => {
  // const { errors, isValid } = validateLoginInput(req.body);

  // if (!isValid) {
  //   return res.status(400).json(errors);
  // }
  const email = req.body.email;
  const password = req.body.password;

  Admin.findOne({ email }).then(admin => {
    if (!admin) {
      // errors.email = "Admin not found";
      res.status(404).json({ msg: "Admin not found" });
    }
    bcrypt
      .compare(password, admin.password)
      .then(isMatch => {
        if (isMatch) {
          const payload = {
            id: admin.id,
            email: admin.email
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
  });
});

// Add Councellor
router.post(
  "/councellors/add",
  passport.authenticate("admin", { session: false }),
  (req, res) => {
    const newCouncellor = {};
    newCouncellor.admin = req.user.id;
    newCouncellor.name = req.body.name;
    newCouncellor.phone = req.body.phone;
    newCouncellor.address = req.body.address;

    Councellor.findOne({ admin: req.user.id }).then(cslr => {
      new Councellor(newCouncellor).save().then(cslr => {
        res.json(cslr);
      });
    });
  }
);

// Get Councellors
router.get(
  "/councellors/",
  passport.authenticate("admin", { session: false }),
  (req, res) => {
    Councellor.find({ admin: req.user.id })
      .then(dr => {
        res.json(dr);
      })
      .catch(err => res.json(err));
  }
);

// add doctor
router.post(
  "/doctors/add",
  passport.authenticate("admin", { session: false }),
  (req, res) => {
    const newDoctor = {};
    newDoctor.admin = req.user.id;
    newDoctor.name = req.body.name;
    newDoctor.phone = req.body.phone;
    newDoctor.hospital = req.body.hospital;

    Doctor.findOne({ admin: req.user.id }).then(dr => {
      new Doctor(newDoctor).save().then(dr => {
        res.json(dr);
      });
    });
  }
);

// Get doctors
router.get(
  "/doctors",
  passport.authenticate("admin", { session: false }),
  (req, res) => {
    Doctor.find({ admin: req.user.id })
      .then(dr => {
        res.json(dr);
      })
      .catch(err => res.json(err));
  }
);

// Add Guidlines
router.post(
  "/guidlines/add",
  passport.authenticate("admin", { session: false }),
  (req, res) => {
    const newGuidlines = {};
    newGuidlines.admin = req.user.id;
    newGuidlines.subject = req.body.subject;
    newGuidlines.text = req.body.text;
    newGuidlines.image = req.body.image;

    Guidlines.findOne({ admin: req.user.id }).then(gdlns => {
      new Guidlines(newGuidlines).save().then(gdlns => {
        res.json(gdlns);
      });
    });
  }
);

// Get Guidliness
router.get(
  "/guidlines",
  passport.authenticate("admin", { session: false }),
  (req, res) => {
    Guidlines.find({ admin: req.user.id })
      .then(gdlns => {
        res.json(gdlns);
      })
      .catch(err => res.json(err));
  }
);

// Add Pharmacy
router.post(
  "/pharmacy/add",
  passport.authenticate("admin", { session: false }),
  (req, res) => {
    const newPharmacy = {};
    newPharmacy.admin = req.user.id;
    newPharmacy.name = req.body.name;
    newPharmacy.phone = req.body.phone;
    newPharmacy.address = req.body.address;

    Pharmacy.findOne({ admin: req.user.id }).then(phmcy => {
      new Pharmacy(newPharmacy).save().then(phmcy => {
        res.json(phmcy);
      });
    });
  }
);

// Get Pharmacys
router.get(
  "/pharmacy",
  passport.authenticate("admin", { session: false }),
  (req, res) => {
    Pharmacy.find({ admin: req.user.id })
      .then(phmcy => {
        res.json(phmcy);
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;
