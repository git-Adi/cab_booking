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
app.use(cp());
app.set('view engine', 'ejs');
var users ={}

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

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
    var username= req.body.username;
    var password = req.body.password;
    // console.log(req.body);
    
    console.log("username and password daala tha "+ username+ " " + password);

    connection.query("select * from user where Email = ? and password = ?",[username,password],function(error,results,fields){
        if(results.length>0){
            req.session.userData = {
                username: username,
                isAdmin: true
              };

            res
            .cookie("userdata", username)
            .redirect("/home")
            return
        }

        res.redirect("/");
        // res.end();
    })
});
 
app.get("/home",function(req,res){ 
    const data = req.cookies.userdata;
    const userData = data;
    console.log(userData);
    res.render('home',{ userData });
    // document.getElementById("cookie-data").innerHTML = "hi, " + cookies + " data";
    res.sendFile(__dirname + "/home.html");
})


app.get("/new_map",function(req,res){
    res.sendFile(__dirname + "/new_map.html");
});

app.get("/new_location",function(req,res){
    res.sendFile(__dirname + "/new_location.html");
});

app.get("/cost",function(req,res){
    const data2 = req.cookies.ud;
    const d1= data2;
    // res.send(d1);
    const vehicle_used = req.cookies.veh;
    const d2 = vehicle_used;
    // console.log(d2);
    res.render('cost',{d1,d2});
    // res.render('cost',{d2});
    // res.sendFile(__dirname + "/cost.html");
});

app.post("/home",function(req,res){
    res.redirect("/new_map");
})

app.get("/signup",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/signup",function(req,res){
    var email= req.body.email;
    var name = req.body.name;
    var dob = req.body.dob;
    var password = req.body.password;
    console.log("username and paaword daala tha "+ email + password + name + dob);
    

    connection.query("select * from user where Email = ? and Name = ?",[email,name],function(error,results,fields){
        if(error){
            console.log(error );
        }
        if(results.length>0){
            res.redirect("/signup");
            console.log("Entry exists with same credential");
            return
            
            
        }
        console.log("hello");
        connection.query("insert into User (Email, Name, Date_of_Birth, Riding_History, Current_Rating, Offers, Ride_Conformation, Ride_Completion, SUV, SEDAN, Auto, Bike,password) values (?, ?, ?, null, null, null, false, false, false, false, false, false,?)",[email,name,dob,password],function(error,results,fields){
            res.redirect("/");
            return
        });
        
        // res.end();
    });
});

// console.log(window.glo_var);
// console.log(locn);

app.post("/new_map",function(req,res){
    var vehicle = req.body.vehicle;
    console.log(vehicle);
    if(vehicle == "SUV"){
        console.log("suv hai bhai");
        // console.log(window.exportedVariable);
        connection.query("Update user SET SUV = true",function(error,results,fields){
            res.cookie("veh", vehicle)
            res.redirect("/new_location");
            
            return;
        })
    }
    else if(vehicle == "Sedan"){
        console.log("Sedan hai bhai");
        // console.log(window.exportedVariable);
        connection.query("Update user SET Sedan = true",function(error,results,fields){
            res.cookie("veh", vehicle)
            res.redirect("/new_location");
            
            return;
        })
    }
    else if(vehicle == "Bike"){
        console.log("Bike hai bhai");
        // console.log(window.exportedVariable);
        connection.query("Update user SET Bike = true",function(error,results,fields){
            res.cookie("veh", vehicle)
            res.redirect("/new_location");
      
            return;
        })
    }
    else if(vehicle == "Auto"){
        console.log("Auto hai bhai");
        // console.log(window.exportedVariable);
        connection.query("Update user SET Auto = true",function(error,results,fields){
            res.cookie("veh", vehicle)
            res.redirect("/new_location");
            
            return;
        })
    }
    

});

// app.post('/location', (req, res) => {
//     const locn = req.body.location;
//     console.log(locn); // prints the value of `locn` to the console
//     // Your logic here
//     const data1 = req.cookies.userdata;
//     const d1= data1;
//     console.log(d1);
//     connection.query("Update trips SET Departure_Address=?,Arrival_Address='Indraprastha Institute of Information Technology,110020,New Delhi' where Email=?",[locn,d1],function(error,results,field){
//         res.send('Location received!');
//     })
    
//   });

  app.post('/new_location', (req, res) => {
    const main_data = JSON.parse(req.body.final_data);

    console.log((main_data.loc_name));
    console.log(main_data.distance);
    const data1 = req.cookies.userdata;
    const d1= data1;
    console.log(d1);
    
    connection.query("Update trips SET Departure_Address='Indraprastha Institute of Information Technology,110020,New Delhi',Arrival_Address=? where Email=?",[main_data.loc_name,d1],function(error,results,field){
        res.cookie("ud", parseFloat(main_data.distance/1000));
        // res.send('Location received!');
        // console.log(typeof(main_data.distance));
        // console.log(Number.isInteger(main_data.distance));
        res.redirect("/cost")
        return
    })
    
  });
  app.post("/cost",(req,res)=>{
    const amount =(req.body.amount_n);
    console.log(req.body);
    const data3 = req.cookies.userdata;
    const d3= data3;
    console.log("its d3"+d3);
    const data4 = req.cookies.veh;
    const d4 = data4
    console.log(d4);
    if(vehicle == "Auto")
    connection.query("Update trips SET Auto=true where Email=?",[d3],function(error,results,field){
        res.send("auto true hogya");
    })
  })


app.get("/driver_login", (req, res) => {
    res.sendFile(__dirname + "/driver_login.html");
})

app.get("/driver_signup", (req, res) => {
    res.sendFile(__dirname + "/driver_signup.html");
})

app.post("/driver_signup",(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var dob = req.body.dob;
    var newdate = dob.split("-").join("/");
    // if(typeof(newdate)==="string"){
    //     console.log("yes");
    // }
    const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)
    // var xyz = _calculateAge(newdate);
    console.log(getAge(newdate));
    var password = req.body.password;
    // console.log(getAge);
    console.log(name);
    console.log(email);
    console.log(dob);
    console.log(password);
    connection.query("SELECT DriverID FROM taxido_new.driver ORDER BY DriverID DESC LIMIT 1 ",function(err,result,field){
        console.log(result);
        const arr = result;
        console.log(arr[0].DriverID);
        connection.query("insert into driver (DriverID, Name, Email, Date_of_Birth, Riding_History, Age, Current_Rating, password) values (?,?,?,?,null,?,null,?);",[arr[0].DriverID+1,name,email,newdate,getAge(newdate),password],function(error,results,field){
        
            res.send("update hogya");
            
            
        })

    })
    




})
  
  

app.listen(4000);
module.exports = users;