const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const admins = require("./routes/api/admins");
const doctors = require("./routes/api/doctors");
const councellors = require("./routes/api/councellors");
const pharmacy = require("./routes/api/pharmacies");
const guidlines = require("./routes/api/guidlines");
const patients = require("./routes/api/patients");
const chats = require("./routes/api/chats");

const DoctorChat = require("./models/DoctorChat");
const CouncellorChat = require("./models/CouncellorChat");

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
const connect = mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

io.on("connection", socket => {
  socket.on("Message from doctor", msg => {
    connect.then(db => {
      try {
        let doctorChat = new DoctorChat({
          message: msg.chatMessage,
          sender: msg.sender,
          receiver: msg.receiver
        });
        doctorChat.save((err, doc) => {
          // if (err) return res.json({ success: false, err });
          console.log(err);
          DoctorChat.find({ _id: doc._id })
            .populate("sender")
            .exec((err, doc) => {
              return io.emit("Output DR Chat Message", doc);
            });
        });
      } catch (err) {
        console.log(err);
      }
    });
  });

  socket.on("Message from councellor", msg => {
    connect.then(db => {
      try {
        let councellorChat = new CouncellorChat({
          message: msg.chatMessage,
          sender: msg.sender,
          receiver: msg.receiver
        });
        councellorChat.save((err, doc) => {
          // if (err) return res.json({ success: false, err });
          console.log(err);
          CouncellorChat.find({ _id: doc._id })
            .populate("sender")
            .exec((err, doc) => {
              return io.emit("Output CR Chat Message", doc);
            });
        });
      } catch (err) {
        console.log(err);
      }
    });
  });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

// Use routes
app.use("/api/admins", admins);
app.use("/api/doctors", doctors);
app.use("/api/councellors", councellors);
app.use("/api/pharmacies", pharmacy);
// app.use("/api/guidlines", guidlines);
app.use("/api/patients", patients);
app.use("/api/chats", chats);

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Server running on port ${port}`));
