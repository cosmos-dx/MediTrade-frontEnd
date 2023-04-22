
var express=require('express');
var mongoose = require("mongoose");
var session = require('express-session');
const bodyParser = require('body-parser');
const Path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3');
var ejs = require('ejs');
const myapp = require('./rmsmaster/userlogin');
const mainpage = require('./rmsmaster/mainsp');
const sbsearch = require('./rmsmaster/dbsearch');
// const customer_model = require('./rmsconfig/model/customer');
const port = process.env.PORT ||  8080;
const { MongoClient , ObjectId} = require('mongodb');
const app = myapp.app ;

app.set('port', process.env.port || port); // set express to use this port

app.set('views',__dirname + '/vws');
app.use(express.static(__dirname));
app.use(express.static(Path.join(__dirname, 'rmsmaster')))
app.use(express.static(Path.join(__dirname, 'public'))) // configure express to use public folder

//const uri = "mongodb+srv://techmed:benzene@cluster0.bdrk79r.mongodb.net/techmed?retryWrites=true&w=majority";
const uri = 'mongodb://localhost:27017/mytech-med';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

try {
    client.connect().then(()=> {
       
    console.log("Mongo Connected");
    });
}
catch(e) {
    console.log(e);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse form data client
app.use(express.json());

//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


module.exports.app = app;


app.listen(port , () => console.log(`Script tser.js is Running at port ${port}`));