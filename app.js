require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
const bcrypt = require("bcrypt");


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//using mongoose to connect to our mongoDB database
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

//this will encrypt the password data when newUser.save() is called in the post method for "/register"
// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

//get request coming from login Button In the home route
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      // to create newUser we use the "User" Model that is created previously
      const newUser = new User({
        email: req.body.username,
        password: hash
      });
      newUser.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          res.render("secrets");
        }
      });
    });
  
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        //checking if the password entered by user matches the password in DB
        // if (foundUser.password === password) {
          //res.render("secrets");
        // }
        bcrypt.compare(
          password,
          /*hash*/foundUser.password,
          function (err, result) {
              if(result === true){
                 res.render("secrets");
              }
          }
        );
      }
    }
  });

});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
