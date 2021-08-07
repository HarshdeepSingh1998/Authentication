// to keep the secrets safe to that no one can get access to our app.js
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")


const app = express();


// how to access variables from the environment
console.log(process.env.SECRET)

app.use(express.static("public"));

app.set('view engine' , 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB" , {useUnifiedTopology :true , useNewUrlParser : true});

// schema
// its an object that is created using themongoose schema class
const userSchema = new mongoose.Schema({
  email :String ,
   password :String
});

// this is the variable that we want to be safe copy it to .env file
// const secret = "Thisisourlittlesecret.";


// userSchema.plugin(encrypt , {secret :secret , encryptedFields : ["password"]});
userSchema.plugin(encrypt , {secret :process.env.SECRET , encryptedFields : ["password"]});


const User = new mongoose.model("User" , userSchema);




app.get("/" , function(req , res){
  res.render("home");
});

app.get("/login" , function(req , res){
  res.render("login");
});


app.get("/register" , function(req , res){
  res.render("register");
});

// trigerring register post request

app.post("/register" , function(req , res){
  const newUser = new User({
    email : req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  });
});



app.post("/login" , function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email : username}, function(err , foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser)
      {if(foundUser.password === password){
        res.render("secrets");
      }
      }

      }

  });

});


























app.listen(3000 , function(req , res){
  console.log("Server running on port 3000");
});
