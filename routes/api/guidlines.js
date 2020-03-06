// const express = require("express");
// const router = express.Router();
// const passport = require("passport");

// // Load Admin model
// const Guidlines = require("../../models/Guidlines");

// // test
// router.get("/test", (req, res) => {
//   res.json({ msg: "Guidlines works" });
// });

// // Add Guidlines
// router.post(
//   "/add",
//   passport.authenticate("admin", { session: false }),
//   (req, res) => {
//     const newGuidlines = {};
//     newGuidlines.admin = req.user.id;
//     newGuidlines.subject = req.body.subject;
//     newGuidlines.text = req.body.text;
//     newGuidlines.image = req.body.image;

//     Guidlines.findOne({ admin: req.user.id }).then(gdlns => {
//       new Guidlines(newGuidlines).save().then(gdlns => {
//         res.json(gdlns);
//       });
//     });
//   }
// );

// // Get Guidliness
// router.get(
//   "/",
//   passport.authenticate("admin", { session: false }),
//   (req, res) => {
//     Guidlines.find({ admin: req.user.id })
//       .then(gdlns => {
//         res.json(gdlns);
//       })
//       .catch(err => res.json(err));
//   }
// );

// module.exports = router;
