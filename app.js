///////////////////////////////////In order to access the MongoDb Atlas, paste //////////////////////////////////////
//mongo "mongodb+srv://cluster0.ok0ns.mongodb.net/myFirstDatabase" --username admin ///////////////////////////
///////////////on your terminal////////////////////////////////////////////

/////////credentials for signing in on Atlas are email: postm4105@gmail.com password: ABCD4321


//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb+srv://admin:admin@cluster0.ok0ns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser =  new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if (err) {
        console.log(err);
      } else {
        res.render("newUser");
      }
    });
  });

});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("existingUser");
          }
          else if(result=== false){
          console.log('User Id and password doesnt match');
          res.render('invalid');
        }
        });
      }
    }
  });
});



let port = process.env.PORT;
if (port== null ||port ==""){
  port= 3000;
}


app.listen(port, function() {
  console.log("Server started on port 3000.");
});
