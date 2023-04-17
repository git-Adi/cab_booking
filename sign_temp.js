const mysql = require("mysql2");
const express = require("express");
const bodyparser = require("body-parser");
const encoder = bodyparser.urlencoded();

const app = express();
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
    else console.log("connected to mysql for signup successfully!");
});

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
    var email= req.body.email;
    var name = req.body.name;
    var dob = req.body.dob;
    var password = req.body.password;
    console.log("username and paaword daala tha "+ email + password + name + dob);
    

    connection.query("select * from user where Email = ? and Name = ? or Date_of_Birth = ? and password = ?",[email,name,dob,password],function(error,results,fields){
        if(error){
            console.log(error );
        }
        if(results.length>0){
            res.redirect("/");
            console.log("Entry exists with same credential");
            
        }
        console.log("hello");
        connection.query("insert into User (Email, Name, Date_of_Birth, Riding_History, Current_Rating, Offers, Ride_Conformation, Ride_Completion, SUV, SEDAN, Auto, Bike,password) values (?, ?, ?, null, null, null, false, false, false, false, false, false,?)",[email,name,dob,password],function(error,resul,fields){
            res.redirect("/");
        });
        
        // res.end();
    });
});

app.get("/welcome",function(req,res){
    res.sendFile(__dirname + "/welcome.html");
})

app.listen(7000);