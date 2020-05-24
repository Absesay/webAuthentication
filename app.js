require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bycrypt = require("bycrypt");
const saltRounds = 10;

const PORT = process.env.PORT || 3000;

const app = new express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

// create schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



// create model
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req,res)=> {
    // create a new user
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    
    // save and encrypt
    newUser.save((err)=>{
        if(!err) {
            console.log("new user created");
            res.render("secrets");
        }
        else console.log(err);
        
    })
});

app.post("/login", (req, res)=> {
    const userName = req.body.username;
    const pswd = md5(req.body.password);
    

    // find user in DB, if found show secrets/decrypt
    User.findOne({email:userName}, (err, foundUser)=> {
        if(err){
            console.log("record not match");
        } else {
            if(foundUser) {
                if(foundUser.password === pswd){
                    res.render("secrets")
                }
            }
        }
        
    });
    
});

app.listen(PORT, ()=> {
    console.log(`Server at port ${PORT}`);
});