const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Admin = mongoose.model("admins");
const Councellor = mongoose.model("councellors");
const Doctor = mongoose.model("doctors");
const Pharmacy = mongoose.model("pharmacies");
const Patient = mongoose.model("patients");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    "admin",
    new JwtStrategy(opts, (jwt_payload, done) => {
      Admin.findById(jwt_payload.id)
        .then(admin => {
          if (admin) {
            return done(null, admin);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );

  passport.use(
    "councellor",
    new JwtStrategy(opts, (jwt_payload, done) => {
      Councellor.findById(jwt_payload.id)
        .then(cslr => {
          if (cslr) {
            return done(null, cslr);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );

  passport.use(
    "doctor",
    new JwtStrategy(opts, (jwt_payload, done) => {
      Doctor.findById(jwt_payload.id)
        .then(dr => {
          if (dr) {
            return done(null, dr);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );

  passport.use(
    "pharmacy",
    new JwtStrategy(opts, (jwt_payload, done) => {
      Pharmacy.findById(jwt_payload.id)
        .then(ph => {
          if (ph) {
            return done(null, ph);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );

  passport.use(
    "patient",
    new JwtStrategy(opts, (jwt_payload, done) => {
      Patient.findById(jwt_payload.id)
        .then(ptnt => {
          if (ptnt) {
            return done(null, ptnt);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
