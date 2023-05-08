
const express = require('express');
const sessions = require('express-session');
const bodyParser = require('body-parser');
const Path = require("path");
const ejs = require('ejs');

const medifun = require('./medifun')

const { MongoClient , ObjectId} = require('mongodb');


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


var defaultUser ={
  "userinfo" :{"ownerstatic": ["MEDI-TRADE SOLUTIONS", "MEDI-TRADE ADDRESS 1", "MEDI-TRADE ADDRESS 2", "Empty Yet ADDRESS3"],
             "printsettings": "A4", 
             "displaysettings": {"batchlist":false,},
            "info": "xxxx", "phone": "1234567890", "phone1": "1234567890", "tpname": "", 
            "email": "abcd@efg.com", "regn":"Owner Reg. Number","gstn":"Owner GSTN",
    },
   "bankinfo" :{
      "bank2": {"add": "BANK ADDRESS", "ifsc": "ABCD123123", "upid": "", "name": "MY BANK", "ac": "123457543212312"},
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
  collectionList.forEach(function(collectionName) {emptydb.createCollection(collectionName);})
}

function DefaultInsert(totalcl, colkarray, colvarray, insertname){ 
    // colarray = ["ledg","ac"], ["ledg","sup"], ["ledg","cust"]
     if(colkarray.length==2){
         totalcl[colkarray[0]].insertOne(colvarray[0]).then(function(result){
             totalcl[colkarray[1]].insertOne(colvarray[1]).then(function(result){console.log(insertname+" Insert Successfully !")});
         });
     }else{totalcl[colkarray[0]].insertOne(colvarray[0]).then(function(result){console.log(insertname+" Insert Successfully !")});}
  }

function CreateDefaultData(totalcl){
    const ObjectID = require('mongodb').ObjectId; 
    var ledgid_ac1 = new ObjectID().toString();
    var ledgid_ac2 = new ObjectID().toString();
    var ledgid_ac3 = new ObjectID().toString();
    var supid_ac1 = new ObjectID().toString();
    var supid_ac2 = new ObjectID().toString();
    var supid_ac3 = new ObjectID().toString();

    var ledgid_sup = new ObjectID().toString();
    var ledgid_comp = new ObjectID().toString();
    var ledgid_cust = new ObjectID().toString();
    var supid_sup = new ObjectID().toString();
    var supid_comp = new ObjectID().toString();
    var supid_cust = new ObjectID().toString();//insertMany 
    
    var ledger_obj = {"ledgid":ledgid_ac1, "ac_type": "3","sale_pur_ID": "3"};
    var insert_ac1 = {"csid":supid_ac1,"ledgid":ledgid_ac1,"ac_type": "3","name":"FREIGHT","add1":"LOCAL 1","add2":"LOCAL 2","add3":"09","area":"LOCAL","mode":2};
    DefaultInsert(totalcl, ["ledg","ac"], [ledger_obj, insert_ac1], "FREIGHT");

    ledger_obj = {"ledgid":ledgid_ac2, "ac_type": "3","sale_pur_ID": "3"};
    var insert_ac2 = {"csid":supid_ac2,"ledgid":ledgid_ac2,"ac_type": "3","name":"DISCOUNT","add1":"LOCAL 1","add2":"LOCAL 2","add3":"09","area":"LOCAL","mode":2};
    DefaultInsert(totalcl, ["ledg","ac"], [ledger_obj, insert_ac2], "DISCOUNT");

    ledger_obj = {"ledgid":ledgid_ac2, "ac_type": "3","sale_pur_ID": "3"};
    var insert_ac3 = {"csid":supid_ac3,"ledgid":ledgid_ac3,"ac_type": "3","name":"TRANSPORT","add1":"LOCAL 1","add2":"LOCAL 2","add3":"09","area":"LOCAL","mode":2};
    DefaultInsert(totalcl, ["ledg","ac"], [ledger_obj, insert_ac3], "TRANSPORT");

    ledger_obj = {"ledgid":ledgid_sup, "ac_type": "4","sale_pur_ID": "1"};
    var insert_sup = {"csid":supid_sup,"ledgid":ledgid_sup,"name":"MEDI-TRADE SAMPLE SUPPLIER","add1":"SAMPLE ADDRESS 1","add2":"SAMPLE ADDRESS 2","add3":"09","pincode":"234567",
    "area":"LOCAL","mobile":"8888888888","email":"abcdefgh@abcd.com","ophone":"9999999999","pan":"ABCDE0123F","bal":0.00,"regn":"REG.N","gstn":"09ABCDE0123F1ZM","cmnt":"","mode":1};
    DefaultInsert(totalcl, ["ledg","sup"], [ledger_obj, insert_sup], "SUPPLIER");

    ledger_obj = {"ledgid":supid_comp, "ac_type": "6","sale_pur_ID": "6"};
    var insert_comp = {"csid":supid_comp,"ledgid":ledgid_comp,"name":"MEDI-TRADE SAMPLE COMPANY","add1":"","add2":"","add3":"","pincode":"",
    "area":"","mobile":"","email":"","ophone":"","pan":"","bal":0.00,"regn":"REG.N","gstn":"","cmnt":"","mode":6};
    DefaultInsert(totalcl, ["ledg","sup"], [ledger_obj, insert_comp], "COMPANY");

    ledger_obj = {"ledgid":ledgid_cust, "ac_type": "4","sale_pur_ID": "2"};
    var insert_cust = {"csid":supid_cust,"ledgid":ledgid_cust,"name":"MEDI-TRADE SAMPLE CUSTOMER","add1":"SAMPLE ADDRESS 1","add2":"SAMPLE ADDRESS 2","add3":"09","pincode":"222222",
    "area":"LOCAL","mobile":"6666666666","email":"lmnopqrs@wxyz.com","ophone":"7777777777","pan":"FGHIJ0456K","bal":0.00,"regn":"REG.N","gstn":"09FGHIJ0456K1ZM","cmnt":"","mode":1};
    DefaultInsert(totalcl, ["ledg","cust"], [ledger_obj, insert_cust], "CUSTOMER");

    var ledgid_cust_cash = new ObjectID().toString();
    ledger_obj = {"ledgid":ledgid_cust_cash, "ac_type": "4","sale_pur_ID": "2"};
    var supid_cust_cash = new ObjectID().toString();
    var insert_cust_cash = {"csid":supid_cust_cash,"ledgid":ledgid_cust_cash,"name":"CASH SALE","add1":"CASH","add2":"CASH","add3":"09","pincode":"",
    "area":"LOCAL","mobile":"","email":"","ophone":"","pan":"","bal":"0.00","regn":"","gstn":"","cmnt":"","mode":1};
    DefaultInsert(totalcl, ["ledg","cust"], [ledger_obj, insert_cust_cash], "CASH CUSTOMER");

    var itemid1 = new ObjectID().toString();
    var item_obj1 = {"itemid":itemid1,"name":"MEDI-TRADE ITEM 1","pack":"1*10","unit":"TAB","netrate":44.80,"prate":40.00,"srate":50.00,"cgst":9,"sgst":9,"gst":18,"dis":0.00,
      "mrp":60.00,"hsn":"2106","igroup":"SAMPLE SALT","irack":"RACK 1","compid":ledgid_comp,"csid":supid_sup};
    DefaultInsert(totalcl, ["itm"], [item_obj1], "DEFAULT ITEM 1");

    var itemid2 = new ObjectID().toString();
    var item_obj2 = {"itemid":itemid2,"name":"MEDI-TRADE ITEM 2","pack":"200ml","unit":"BOTT","netrate":134.40,"prate":120.00,"srate":135.00,"cgst":6,"sgst":6,"gst":12,"dis":0.00,
      "mrp":160.00,"hsn":"2106","igroup":"SAMPLE SYRUP","irack":"RACK 1","compid":ledgid_comp,"csid":supid_sup};
    DefaultInsert(totalcl, ["itm"], [item_obj2], "DEFAULT ITEM 2");

    var itemid3 = new ObjectID().toString();
    var item_obj3 = {"itemid":itemid3,"name":"MEDI-TRADE ITEM 3","pack":"1*2","unit":"VIAL","netrate":63.00,"prate":60.00,"srate":68.00,"cgst":2.5,"sgst":2.5,"gst":5,"dis":0.00,
      "mrp":72.00,"hsn":"3002","igroup":"SAMPLE TYPE SALT","irack":"RACK 1","compid":ledgid_comp,"csid":supid_sup};
    DefaultInsert(totalcl, ["itm"], [item_obj3], "DEFAULT ITEM 3");  
}

function MemberConnect(){
  var client = new MongoClient('mongodb://0.0.0.0:27017');
  try {client.connect().then(()=> {console.log("Mongo Member Connected");});}
  catch(e) {console.log(e);}
  return client.db("memberdb");
}

function MongoConnect(getuseraddress){
  var url = 'mongodb://0.0.0.0:27017//'+getuseraddress;
  //var url = 'mongodb://localhost:27017//'+getuseraddress;
  var client = new MongoClient(url);
  
  try {client.connect().then(()=> {console.log("Mongo Connected");});}
  catch(e) {console.log(e);}

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
        rscr = medifun.emptyRSCR();
        rscr['title']='MediTrade-Login'
        res.render('medipages/login',{root:__dirname, rscr:rscr})
        
    }
    else{
        rscr = medifun.emptyRSCR();
        rscr['title']='MediTrade-Login'
        res.render('medipages/login',{root:__dirname, rscr:rscr})
        
     }
});

app.get('/medilogin', function(req, res) {
  //response.sendFile(path.join(__dirname + '/login.html'));
  var username = req.session.userid;
  var firstname = req.session.firstname;
  var info = '';
  if (!username){username = ''}
  else{info = username+'-LogOut Successfully !'}
  rscr = medifun.emptyRSCR(); 
  
  req.session.destroy();
  rscr['title']='MediTrade-Login'
  res.render('medipages/login' , {root:__dirname, rscr: rscr});
  //res.redirect('/');
  
});

app.post('/medilogin', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  
  if (username && password) {
     const mnogmemberdb = MemberConnect();
     mnogmemberdb.collection("members").find({"username":username,"password":password}).toArray().then(function(members){
      if (members.length>0){
          let results = members[0];
          
          rscr = medifun.readRSCR(); 
          var dbfname = results["username"]+"_"+results["phone"]+"_"+results["username"] ;
          let tclc_db = MongoConnect(dbfname);
          tclc = tclc_db[0];
          mgodb = tclc_db[1];
          rscr['uqpath']['dbname']=dbfname;
          rscr['uqpath']['dbfname']=dbfname;
          tclc["owner"].find().limit(1).toArray().then(function(ownerdet){
            if (ownerdet.length < 1){
                ownerdet = defaultUser;
                tclc["owner"].insertOne(ownerdet).then(function(ownerids){})
                CreateEmptyCollections(mgodb);
                CreateDefaultData(tclc);
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
                request.session._id = results._id;
                request.session.name = results.name;
                request.session.lastname = results.lastname;
                request.session.phone = results.phone;
                request.session.verified = results.verified;
                
                rscr['htmlheaderdp']=ownerstatic[0]+', '+ownerstatic[1]+', '+ownerstatic[2];
                rscr['title']='MediTrade-Panel';
                rscr['gblink']='/medihome';
                rscr['linktitle']='MediTrade-MainPanel';
                module.exports.rscr = rscr;
                module.exports.tclc = tclc;
                response.render('medipages/medihome', {spinfo: rscr})

            })
           
           })

           request.session.loggedin = true;
           request.session.username = username;
           request.session._id = results._id;
           request.session.name = results.name;
           request.session.lastname = results.lastname;
           request.session.phone = results.phone;
           request.session.verified = results.verified;
           
           rscr['title']='MediTrade-Panel';
           rscr['gblink']='/medihome';
           rscr['linktitle']='MediTrade-MainPanel';
           module.exports.rscr = rscr;
           module.exports.tclc = tclc;
           
        }
      else{
          rscr = medifun.readRSCR(); 
          rscr['info'] = "Wrong UserID - Password !";
          rscr['alert'] = "Wrong UserID - Password !";
          response.render('medipages/login' , {root:__dirname, rscr: rscr});
      }
     })
   }
   else{
          rscr = medifun.readRSCR(); 
          rscr['info'] = "UserID - Password is EMPTY !";
          rscr['alert'] = "UserID - Password is EMPTY !";
          response.render('medipages/login' , {root:__dirname, rscr: rscr});
   }
});

app.post('/mediregister', function(request, response) {
    rscr = {'info':'', 'alert':"",'title':"MediTrade-Registration",
    'updatemediregister':false, 'mediregister':"New Registration",};
    response.render('medipages/register', {spinfo: rscr})
});

app.get('/onuserValidation', function(req, res, next){
    var username = req.query.username
    const mnogmemberdb = MemberConnect();
    mnogmemberdb.collection("members").find({"username":username.trim()}).toArray().then(function(members){
       if(members.length>0){
          res.json({success : {'username':'Username Already in Use', 'status':200,}, status : 200});
          return true;
       }else{
          res.json({success : {'username':null,  'status':200}, status : 200});
          return true;
       }
     });
});

app.get('/onphoneValidation', function(req, res, next){
    var phone = req.query.phone
    const mnogmemberdb = MemberConnect();
    mnogmemberdb.collection("members").find({"phone":phone.trim()}).toArray().then(function(members){
       if(members.length>0){
          res.json({success : {'phone':'Contact Number Already in Use', 'status':200,}, status : 200});
          return true;
       }else{
          res.json({success : {'phone':null,  'status':200}, status : 200});
          return true;
       }
     });
});

app.post('/save_member', function(req, res) {
    var fvar = req.body;
    var fmval = fvar.phone;
    var info = '';
    var alrt = '';
   
    rscr = medifun.emptyRSCR();
    

    if (fvar){
        if (fmval.length < 9)
        { 
         rscr['mediregister']='Phone Number is Wrong!';
         res.render('medipages/register', {spinfo: rscr,});
         rscr['mediregister']='';
        }

        else {
            const mnogmemberdb = MemberConnect();
            var verified = false; //leaving blank would be used further for verifing customer; default is false; 
            insertobj = {"name":fvar.firstname, "lastname":fvar.lastname,"username":fvar.username,
                        "phone":fvar.phone,"password":fvar.password[0],"verified":verified}
            try{
              mnogmemberdb.collection("members").insertOne(insertobj).then(function(members){
                  rscr['info'] = fvar.username+' - Add Successfully !';
                  rscr['alert'] = fvar.username+' - Add Successfully !';
                  res.render('medipages/login' , {root:__dirname, rscr: rscr});
              });
            }catch(err){
              rscr['info'] = 'Database Error Found '+err.message+' !';
              rscr['alert'] = 'Sorry Cannot Save !';
              res.render('medipages/login' , {root:__dirname, rscr: rscr});
            }
        }
    }
    else{
        rscr['info'] = 'Sorry Cannot Save !';
        rscr['alert'] = 'Sorry Cannot Save !';
        rscr['mediregister'] = 'Cannot Save ! Try Again !!';
        res.render('medipages/register', {spinfo: rscr,});
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
module.exports.tclc = tclc; 
module.exports.MongoConnect = MongoConnect;
module.exports.AdminMongoConnect = AdminMongoConnect;
module.exports.sessions = sessions


