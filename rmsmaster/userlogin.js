
const express = require('express');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const Path = require("path");
const ejs = require('ejs');
const http = require('http');
const sqlite3 = require('sqlite3');


const rmsfun = require('./rmsfun')
const memdb = rmsfun.memdb;



const { MongoClient , ObjectId} = require('mongodb');
const uri = 'mongodb://localhost:27017/mytech-med';
//const uri = "mongodb+srv://techmed:benzene@cluster0.bdrk79r.mongodb.net/techmed?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//const mgdb = client.db("techmed");
// const mymongodb = client.db("mytech-med");



const app = express();
var tclc = {};
var rscr = {};

const oneDay = 1000 * 60 * 60 * 24;

var sess = {
  secret: 'keyboard cat',
  cookie: {maxAge: oneDay, 
          "username":null,"userid":null,
        },
  saveUninitialized:false,
  resave: true,
  proxy : false,
  rolling:true
}

app.set('trust proxy', 1) // trust first proxy
sess.cookie.secure = 'auto';

app.set('view engine', 'ejs');
app.set('views',__dirname + '/vws');

app.use(sessions(sess));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var ccccdefaultUser ={
  "ownerstatic": ["RMS DEMO", "RMS DEMO ADDRESS 1", "RMS DEMO ADDRESS 2", "Empty Yet ADDRESS3"],
  "printsettings": {"A4":true, "A6":false, "A5":false},
  "diaplaysettings": {"batchlist":false,},
  "ownervar": {"info": "xxxx", "phone": "1234567890", "phone1": "1234567890", "tpname": "", 
  "bank2": {"add": "BANK ADDRESS", "ifsc": "ABCDD123123", "upid": "", "name": "MY BANK", "ac": "123457543212312"},
  "bank1": {"add": "", "ifsc": "HDICIC53177", "upid": "", "name": "", "ac": ""},
  "email": "abcd@efg.com", "regn":"Owner Reg. Number","gstn":"Owner GSTN", },
  "bill" :{"main":"S", "esti":"E", "challan":"CHL", "saleorder":"SO","purchaseorder":"PO","receipt":"R"},
  "keys": ["H1","H2", "H3", "H4"]
          };


var defaultUser ={
  "userinfo" :{"ownerstatic": ["RMS DEMO", "RMS DEMO ADDRESS 1", "RMS DEMO ADDRESS 2", "Empty Yet ADDRESS3"],
             "printsettings": "A4", 
             "displaysettings": {"batchlist":false,},
            "info": "xxxx", "phone": "1234567890", "phone1": "1234567890", "tpname": "", 
            "email": "abcd@efg.com", "regn":"Owner Reg. Number","gstn":"Owner GSTN",
    },
   "bankinfo" :{
      "bank2": {"add": "BANK ADDRESS", "ifsc": "ABCDD123123", "upid": "", "name": "MY BANK", "ac": "123457543212312"},
      "bank1": {"add": "", "ifsc": "HDICIC53177", "upid": "", "name": "", "ac": ""},
   },
   "billseriesinfo" : {
    "bill" :{"main":"S", "esti":"E", "challan":"CHL", "saleorder":"SO","purchaseorder":"PO","receipt":"R"},
   }
};

function getFinencialYearRange(lastfyeardict){
if(lastfyeardict){
  var todrangedb = lastfyeardict["frm"];
  var fy = lastfyeardict["partname"];
  var fynum = lastfyeardict["partid"];
  var partid = fynum+1;
  var strDateArray = todrangedb.split('-');
  var intYear = parseInt(strDateArray[0]);
  var nextYear = parseInt(intYear)+1;
  var frange = {"partid": partid, "partname":"fy"+fynum.toString(), 
      "frm":intYear.toString()+"-04-01", "tod":nextYear.toString()+"-03-31","partnum": ""}
  return frange;
}else{
  var dtt = new Date();
  var strDateArray =  dtt.toISOString().split('T')[0].split('-');
  var intYear = parseInt(strDateArray[0])
  var intMonth = parseInt(strDateArray[1])
  if(intMonth < 4 ){
    var todrange = strDateArray[0]+"-04-01"
    intYear -- 
    var frmrange = intYear.toString()+"-03-31"
    var frange = {"partid": 1, "partname":"fy0", "frm":frmrange, "tod":todrange,"partnum": ""}
    return frange;
  }else{
    var frmrange = strDateArray[0]+"-04-01"
    intYear ++
    var todrange = intYear.toString()+"-03-31"
    var frange = {"partid": 1, "partname":"fy0", "frm":frmrange, "tod":todrange,"partnum": ""}
    return frange;
  } 
}
}

function AdminMongoConnect(){
  var url = 'mongodb://0.0.0.0:27017//';
  //var url = 'mongodb://localhost:27017//'+getuseraddress;
  var client = new MongoClient(url);
  client.connect();
  var dbmongo = "mrms"
  //var dbmongo = "mrms_"+getuseraddress
  var mgodb = client.db(dbmongo);
  var tclc = {
    "owner":mgodb.collection("owner"),    
    "mycal":mgodb.collection("mycalendar"),  
    "trns":mgodb.collection("mytrans"),
    "cash":mgodb.collection("cash"),
    "bank":mgodb.collection("bank"),
    "ac":mgodb.collection("account"),
    "actr":mgodb.collection("ac_trans"),
    "pr":mgodb.collection("pay_rcpt"),
    "cust":mgodb.collection("customer"),
    "sup":mgodb.collection("suppliers"),
    "itm":mgodb.collection("products"),
    "stk":mgodb.collection("stock"),
    "ledg":mgodb.collection("ledger"),
    "sale":mgodb.collection("sales"),
    "sitm":mgodb.collection("sales_item"),
    "pur":mgodb.collection("purchase"),
    "pitm":mgodb.collection("purchase_item"),
    "saleo":mgodb.collection("sales_order"),
    "sitmo":mgodb.collection("sales_order_item"),
    "puro":mgodb.collection("purchase_order"),
    "pitmo":mgodb.collection("purchase_order_item"),
  };
  return tclc;
};

function CreateEmptyCollections(emptydb){
  var collectionList = ["mytrans", "cash", "bank", "account", "ac_trans", "pay_rcpt",
      "customer", "suppliers", "products", "stock", "ledger", "sales",
      "sales_item", "purchase", "purchase_item", "sales_order", "sales_order_item", "purchase_order", "purchase_order_item"];
  collectionList.forEach(function(collectionName) {emptydb.createCollection(collectionName)})
}
function MongoConnect(getuseraddress){
  var url = 'mongodb://0.0.0.0:27017//'+getuseraddress;
  //var url = 'mongodb://localhost:27017//'+getuseraddress;
  var client = new MongoClient(url);
  client.connect();
  var dbmongo = "mrms_"+getuseraddress
  
  var mgodb = client.db(dbmongo);
  
  var tclc = {
    "owner":mgodb.collection("owner"),    
    "mycal":mgodb.collection("mycalendar"),  
    "trns":mgodb.collection("mytrans"),
    "cash":mgodb.collection("cash"),
    "bank":mgodb.collection("bank"),
    "ac":mgodb.collection("account"),
    "actr":mgodb.collection("ac_trans"),
    "pr":mgodb.collection("pay_rcpt"),
    "cust":mgodb.collection("customer"),
    "sup":mgodb.collection("suppliers"),
    "itm":mgodb.collection("products"),
    "stk":mgodb.collection("stock"),
    "ledg":mgodb.collection("ledger"),
    "sale":mgodb.collection("sales"),
    "sitm":mgodb.collection("sales_item"),
    "pur":mgodb.collection("purchase"),
    "pitm":mgodb.collection("purchase_item"),
    "saleo":mgodb.collection("sales_order"),
    "sitmo":mgodb.collection("sales_order_item"),
    "puro":mgodb.collection("purchase_order"),
    "pitmo":mgodb.collection("purchase_order_item"),
  };
  return [tclc, mgodb];
};



app.get('/',(req,res) => { 
   var info = ''; 
   if(req.session.userid){
        //res.send("Welcome User <a href=\'/logout'>click to logout</a>");
        rscr = rmsfun.emptyRSCR();
        rscr['title']='MediTrade-Login'
        res.render('rmspages/login',{root:__dirname, rscr:rscr})
        
    }
    else{
        rscr = rmsfun.emptyRSCR();
        rscr['title']='MediTrade-Login'
        res.render('rmspages/login',{root:__dirname, rscr:rscr})
        
     }
});

app.get('/rmslogin', function(req, res) {
  //response.sendFile(path.join(__dirname + '/login.html'));
  var username = req.session.userid;
  var firstname = req.session.firstname;
  var info = '';
  if (!username){username = ''}
  else{info = username+'-LogOut Successfully !'}
  rscr = rmsfun.emptyRSCR(); 
  
  req.session.destroy();
  rscr['title']='MediTrade-Login'
  res.render('rmspages/login' , {root:__dirname, rscr: rscr});
  //res.redirect('/');
  
});

app.post('/rmslogin', function(request, response) {
  
  var username = request.body.username;
  var password = request.body.password;
  
  if (username && password) {
     memdb.get(`SELECT mid, name, lastname, username, phone, password, serverid FROM member WHERE username = ? AND password = ? `,
      [username, password], (err, results) => {
        if (err) {
          console.log("error", err.message);
          response.send('Incorrect Username and/or Password!');
          response.end();
          //response.status(400).json({"error":err.message});
          //return;
        }
        if (results){
           rscr = rmsfun.readRSCR(); 
           var UserDirInfo = rmsfun.GetUserDirName(results.username, results.phone);
           
           var dbpath = UserDirInfo['dbpath'];
           
          //  var db =  new sqlite3.Database(dbpath);

           // UPDATE rscr Values
           // let uqpath={'dbdir':null,'odb':null,'usersettingspath':null,'dbfname':null} // odb will be sqlitedb connection ready 
           
           let dbdir = UserDirInfo['userDbPath'];
           let dbfname = UserDirInfo['userDirName']; //dbFolderName 
           let usersettingpath = Path.join(dbdir, "usersettings.json");

           let tclc_db = MongoConnect(dbfname);
           tclc = tclc_db[0];
           mgodb = tclc_db[1];

           rscr['uqpath']['dbdir']=dbdir;
           rscr['uqpath']['dbname']=dbfname;
           rscr['uqpath']['dbfname']=dbfname;
           rscr['uqpath']['dbpath']=UserDirInfo['dbpath'];
           rscr['uqpath']['usersettingpath']=usersettingpath;
         
          
          tclc["owner"].find().limit(1).toArray().then(function(ownerdet){
            if (ownerdet.length < 1){
                ownerdet = defaultUser;
                tclc["owner"].insertOne(ownerdet).then(function(ownerids){})
                CreateEmptyCollections(mgodb)
                }
              tclc["mycal"].find().sort({"_id":-1}).toArray().then(function(frange){
                if (frange.length < 1){
                    //var lastfyeardict = {"_id": {"$oid": "6437a343678cb10c9240a23c"},"partid": 8,
                    //"partname":"fy8","frm": "2023-04-01","tod":"2024-03-31","partnum": ""}
                    // when user want to create new finencial year after 31-March 
                    // then we have to send previous imediate last dictionary object into getFinencialYearRange as parameter
                    // getFinencialYearRange will return new finencial year range which we have to insert into mycalander ;
                    frange = getFinencialYearRange(false);
                    tclc["mycal"].insertOne(frange).then(function(ownerids){})
                }
                if(typeof(ownerdet.length)!=="undefined"){
                    ownerdet = ownerdet[0];
                    } 

                let ownerstatic = ownerdet['userinfo']['ownerstatic']; 
                let ownervar = ownerdet['userinfo']; 
                rscr['userinfo'] = ownervar;
                rscr['bankinfo'] = ownerdet['bankinfo'];
                rscr['billseriesinfo']=ownerdet['billseriesinfo'];
                rscr['billseries'] = ownerdet['billseriesinfo']['bill'];
                rscr['uqpath']['usersettingdata']=ownerdet;
                rscr['owner']['ownerstatic']=ownerstatic;
                rscr['owner']['ownervar']=ownervar;
                rscr['owner']['o']=ownerstatic[0];
                rscr['owner']['ownername']=ownerstatic[0];
                rscr['owner']['cal']=frange;
                request.session.loggedin = true;
                request.session.username = username;
                request.session.mid = results.mid;
                request.session.name = results.name;
                request.session.lastname = results.lastname;
                request.session.phone = results.phone;
                request.session.serverid = results.serverid;
                
                rscr['htmlheaderdp']=ownerstatic[0]+', '+ownerstatic[1]+', '+ownerstatic[2];
                rscr['title']='Rms-Panel';
                rscr['gblink']='/rmshome';
                rscr['linktitle']='Rms-MainPanel';
                module.exports.rscr = rscr;
                module.exports.tclc = tclc;
                response.render('rmspages/rmshome', {spinfo: rscr})

            })
           
           })


           request.session.loggedin = true;
           request.session.username = username;
           request.session.mid = results.mid;
           request.session.name = results.name;
           request.session.lastname = results.lastname;
           request.session.phone = results.phone;
           request.session.serverid = results.serverid;

           rscr['title']='Rms-Panel';
           rscr['gblink']='/rmshome';
           rscr['linktitle']='Rms-MainPanel';
           module.exports.rscr = rscr;
           module.exports.tclc = tclc;
           //response.render('rmspages/rmshome', {spinfo: rscr})
        }else{
          rscr = rmsfun.readRSCR(); 
          rscr['info'] = "Wrong UserID - Password !";
          rscr['alert'] = "Wrong UserID - Password !";
          response.render('rmspages/login' , {root:__dirname, rscr: rscr});
        }
        //response.status(200).json(row);
      
      
      });
   } else {
    response.send('Please enter Username and Password!');
    response.end();
  }

});

app.post('/rmsregister', function(request, response) {
    rscr = {'info':'', 'alert':"",'title':"RMS-Registration",
    'updatermsregister':false, 'rmsregister':"New Registration",};
    response.render('rmspages/register', {spinfo: rscr})
});

app.get('/onuserValidation', function(req, res, next){
    var username = req.query.username
    //var qry = 'SELECT username FROM member WHERE username LIKE "'+username+'%" ';
    var qry = 'SELECT username FROM member WHERE username = "'+username+'" ';
    
    memdb.get(qry, function (error, row){
        
        if (row){
            var result = {'username':'Username Already in Use', 'status':200,};
            res.json({success : result, status : 200});
            //res.end(JSON.stringify(result));
            return true;
            }
        else{
            var result = {'username':null,  'status':200};
            res.json({success : result, status : 200});
            //res.end(JSON.stringify(result));
            return true;
            }
      })
    
});

app.get('/onphoneValidation', function(req, res, next){
    var phone = req.query.phone ;
    var qry = 'SELECT phone FROM member WHERE phone = "'+phone+'" ';
    
    memdb.get(qry, function (error, row){
        
        if (row){
            var result = {'phone':'Phone Already in Use', 'status':200,};
            res.json({success : result, status : 200});
            //res.end(JSON.stringify(result));
            return true;
            }
        else{
            var result = {'phone':null,  'status':200};
            res.json({success : result, status : 200});
            //res.end(JSON.stringify(result));
            return true;
            }
      })
    
});


app.post('/save_member', function(req, res) {
    var fvar = req.body;
    var fmval = fvar.phone;
    var info = '';
    var alrt = '';
   
    rscr = rmsfun.emptyRSCR();
    

    if (fvar){
        if (fmval.length < 9)
        { 
         rscr['rmsregister']='Phone Number is Wrong!';
         // $query = "SELECT username as username FROM member WHERE username = '".$username."' " ;
         // you can send html text seperatle from here; as per your requirments 
         //res.send("<html> <head>server Response</head><body><h1> This page was render direcly from the server <p>Hello there welcome to my website</p></h1></body></html>");
         res.render('rmspages/register', {spinfo: rscr,});
         rscr['rmsregister']='';
        }

        else {
           
            memdb.all('INSERT INTO member (name, lastname, username, phone, password) '+
            'VALUES ("'+fvar.firstname+'","'+fvar.lastname+'","'+fvar.username+'","'+fvar.phone+'","'+fvar.password[0]+'")', 
            function (error, rows){
                if (error){
                    rscr['info'] = 'Sorry Cannot Save !';
                    rscr['alert'] = 'Database Error Found';
                    // ** important** redirect is important otherwise REFRESH page will Re-Submit Query Again ***
                    ///res.redirect('/rmslogin');
                    res.render('rmspages/login' , {root:__dirname, rscr: rscr});
                    //res.redirect('vws/mysm/login.html?'+info+'&'+alrt+'');
                }
                else{
                
                rmsfun.dbfileCreate(fvar.username, fvar.phone, flag='0');
                rscr['info'] = fvar.username+' - Add Successfully !';
                rscr['alert'] = 'Database Error Found';
                res.render('rmspages/login' , {root:__dirname, rscr: rscr});
                //res.redirect('/rmslogin');
                
                }
            });
        }
    }
    else{
        rscr['info'] = 'Sorry Cannot Save !';
        rscr['alert'] = 'Database Error Found';
        rscr['rmsregister'] = 'Cannot Save ! Try Again !!';
        res.render('mysm/register', {rscr: rscr,});
    }
    
});

app.get('/selectfyear', function(req, res) {
   console.log('selectfyear GET');
  });

app.post('/selectfyear', function(req, res) {
    rscr["fyear"]=req.body.fyear;
    rscr["sfyear"]=req.body.daterow;
    rscr["daterow"]=req.body.daterow;
    rscr["daterange"]=req.body.daterange;
    rscr["billseries"]["fyear"]=req.body.fyear;
    rscr["billseries"]["daterange"]=req.body.daterange;
    
    req.session.rscr = rscr;
    res.send(JSON.stringify(rscr));
  });

module.exports.rscr = rscr
module.exports.app = app
module.exports.memdb = memdb
// module.exports.mymongodb = mymongodb
module.exports.tclc = tclc;
module.exports.AdminMongoConnect = AdminMongoConnect;
module.exports.sessions = sessions


