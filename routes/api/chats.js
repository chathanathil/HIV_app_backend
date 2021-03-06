const express = require("express");
const router = express.Router();
const passport = require("passport");

const DoctorChat = require("../../models/DoctorChat");
const CouncellorChat = require("../../models/CouncellorChat");

router.get(
  "/drGetChat",
  passport.authenticate("doctor", { session: false }),
  (req, res) => {
    DoctorChat.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .populate("sender")
      .exec((err, chats) => {
        if (err) return res.status(400).send(err);

        res.status(200).send(chats);
      });
  }
);

router.get(
  "/crGetChat",
  passport.authenticate("councellor", { session: false }),
  (req, res) => {
    CouncellorChat.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .populate("sender")
      .exec((err, chats) => {
        if (err) return res.status(400).send(err);

        res.status(200).send(chats);
      });
  }
);
module.exports = router;
