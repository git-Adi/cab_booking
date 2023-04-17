const mysql = require("mysql2");
const express = require("express");
const bodyparser = require("body-parser");
const session = require('express-session');
const cp = require ("cookie-parser");
const encoder = bodyparser.urlencoded();
const ejs = require('ejs');

const app = express();
app.use("/assets",express.static("assets"));
app.use("/images",express.static("images"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
// app.use(cp());
// app.set('view engine', 'ejs');

// var users ={};

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
  }));

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


app.get("/h",function(req,res){
    connection.query("SELECT Arrival_address, Departure_address, COUNT(*) FROM trips GROUP BY Arrival_address, Departure_address with ROLLUP;", (err, results) => {
        res.send(results);
        console.log(results);
    })
})

app.get("/l",function(req,res){
    connection.query("SELECT Arrival_address, Email, AVG(ride_duration) FROM trips GROUP BY Arrival_address, Email with ROLLUP;", (err,results) =>{
        res.send(results);
        console.log(results);
    });

});

app.get("/m",function(req,res){
    connection.query("SELECT date_of_travel, Count(*) AS Total_Bookings FROM trips GROUP BY date_of_travel with ROLLUP ORDER BY Total_Bookings DESC LIMIT 5;", (err,results) =>{
        res.send(results);
        console.log(results);
    });

});

app.get("/n",function(req,res){
    connection.query("SELECT Arrival_Address, date_of_travel, SUM(Amount_Payable) FROM Trips GROUP BY date_of_travel,Arrival_Address  with ROLLUP ORDER BY SUM(Amount_Payable);", (err,results) =>{
        res.send(results);
        console.log(results);
    });

});





app.listen(7000)




