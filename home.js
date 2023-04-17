const mysql = require("mysql2");
const express = require("express");
const bodyparser = require("body-parser");
const session = require('express-session');
const encoder = bodyparser.urlencoded();
const cp  = require("cookie-parser")
const users = require('./users');

const app = express();
app.use(cp());
app.use("/assets",express.static("assets"));
app.use("/images",express.static("images"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"12345",
    database: "taxido_new"
});

connection.connect(function(error){
    if(error)  throw err;
    else console.log("connected to mysql successfully!");
});
console.log("hello");
app.get("/",function(req,res){
    res.sendFile(__dirname + "/home.html");
});

app.get('/home', (req, res) => {
    const data = cp("userdata")
    console.log(data);
    res.send(data)
    // Retrieve user data from session
    // const user = JSON.parse(req.query.user);
    // console.log(user);
    // // If user is logged in and has admin privileges, render the admin home page
    // if (user && user.isAdmin) {
    //   res.render('/home', { user });
    // } else {
    //   // Otherwise, render the regular home page
    //   res.render('/home', { user });
    // }
  });

app.listen(4000);

