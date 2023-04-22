
const fs = require('fs');

const rmsfun = require('./rmsfun');
const rmslogin = require('./userlogin');

const qry = require('./qrystore');
var ObjectId = require('mongodb').ObjectId;
const app = rmslogin.app ;
app.set('views',__dirname + '/vws');

// const { MongoClient } = require('mongodb');


// const url = 'mongodb://0.0.0.0:27017';
// const client = new MongoClient(url);

// client.connect();
// const dbName = 'mytech-med';
// const tablename = "customer";
// const mgodb = client.db(dbName);
// const tclc = {
//   "trns":mgodb.collection("mytrans"),
//   "cash":mgodb.collection("cash"),
//   "bank":mgodb.collection("bank"),
//   "ac":mgodb.collection("account"),
//   "actr":mgodb.collection("ac_trans"),
//   "pr":mgodb.collection("pay_rcpt"),
//   "cust":mgodb.collection("customer"),
//   "sup":mgodb.collection("suppliers"),
//   "itm":mgodb.collection("products"),
//   "stk":mgodb.collection("stock"),
//   "ledg":mgodb.collection("ledger"),
//   "sale":mgodb.collection("sales"),
//   "sitm":mgodb.collection("sales_item"),
//   "pur":mgodb.collection("purchase"),
//   "pitm":mgodb.collection("purchase_item"),
// };

app.get('/partysearchenter',function(req,res){ 
  var column = "name";
 
  var idf = req.query.idf.trim(); // removal of white space is important
 
  if (typeof req.query.getcolumn == 'undefined'){
      column = "all"; // send message to fetch all column available in select query
     }
  else{
     column = req.query.getcolumn;
   }
   var textlike = req.query.name.toUpperCase() ;
   var limit = req.query.limit;
   
   

   qry.csfind_by_name(rmslogin.tclc, "GET", idf, textlike, column, limit, function(data){
         res.send(JSON.stringify(data));
     });
 
 });
 
 app.post('/partysearchenter', (req, res) => {
   //Update recdic only on POST method on ejs pages
   var raw_idf = req.body.idf.split("||");
   var idf = raw_idf[3];
   var column = raw_idf[2];
   var selection = raw_idf[1];
   var search_for = raw_idf[0];
   
   qry.csfind_by_name(rmslogin.tclc, "POST", idf, req.body.searchtxt, column, 1, function(data){
         res.send(JSON.stringify(data));
     });
   
 });
 

app.get('/itemsearchenter',function(req,res){
  var column = "name";
  var idf = req.query.idf.trim(); // removal of white space is important
  
  if (typeof req.query.getcolumn == 'undefined'){
     column = "all"; // send message to fetch all column available in select query
    }
 else{
    column = req.query.getcolumn;
  }
  var limit = parseInt(req.query.limit);

  qry.csfind_by_name(rmslogin.tclc, "GET", idf, req.query.name.toUpperCase(), column, limit, function(data){
        res.send(JSON.stringify(data));
    });
  
});

app.post('/itemsearchenter', (req, res) => {
  var raw_idf = req.body.idf.split("||");
  var idf = raw_idf[3];
  var column = raw_idf[2];
  var selection = raw_idf[1];
  var search_for = raw_idf[0];
  
  qry.csfind_by_name(rmslogin.tclc, "POST", idf, req.body.searchtxt.toUpperCase(), column, 3, function(data){ 
        res.send(JSON.stringify(data));
    });
  
});

app.post('/sppartysearch',function(req,res){
  //console.log(req.body);
  //var db = rmslogin.db;
  var idf = req.body.name; // sale or purchase
  var column = "all";
  
  var limit = {"frm":req.body.frm,"tod":req.body.tod,
          "itype":req.body.itype,"billas":req.body.billas,}; 
  
  qry.csfind_by_name(rmslogin.tclc, "POST", idf, req.body.searchtxt.toUpperCase(), column, limit, function(data){
        res.send(JSON.stringify(data));
    });
});

var seditdata = {};

app.get('/speditcalculate',function(req,res){
  console.log("");
  //console.log(req.query);
  var rscr = req.session.rscr;
  //console.log(rscr);
  let db = rmslogin.db;
  let transid = req.query.transid ;
  let ledgid = req.query.ledgid ;
  let fyear = req.query.fyear ;
  let billdt = req.query.dt ;
  let invdt = req.query.invdt ;
  let billno = req.query.billno ;
  let tabpur = "purchase"
  let tabsale = "sales"
  let tabcs = "suppliers" 
  let tabitem = "products"
  let tabpit = "purchase_item"
  let tabsit = "sales_item"
  let dtformat = "%b/%y";
  let stk = "stock";
  let gamt = req.query.gamt ;
  
  if (req.query.name == "supplier"){
        qry.SPINFO(rmslogin.tclc, ledgid, transid, "sup", "pur", "pitm", fyear, 
          function(err, rows, itemrows, acrows){
            if(rows){
              rows[0]['gamt'] = gamt;
              rows[0]['amt'] = 0;
              rscr['cssearch']==='purchase'
              rscr['cs']="customer";
              seditdata = {'prows':rows, 'itemrows':itemrows, 'acrows':acrows};
              console.log("from db search ----- ",seditdata);
              res.send(JSON.stringify(seditdata)); 
              //res.end(JSON.stringify(seditdata));
            }
          });
      }

  if (req.query.name == "customer"){
    qry.SPINFO(rmslogin.tclc, ledgid, transid, "cust", "sale", "sitm", fyear, 
          function(err, rows, itemrows, acrows){
            //console.log(rows);
            rows[0]['gamt'] = gamt;
            rows[0]['amt'] = 0;
            rscr['cssearch']="sale";
            rscr['cs']="customer";
            seditdata = {'prows':rows, 'itemrows':itemrows, 'acrows':acrows};
            res.send(JSON.stringify(seditdata));
          });
      }
  });

app.get('/spedit',function(req,res){
  var rscr = req.session.rscr;
  try{
    res.render('rmspages/spedit', {spinfo: rscr, prows:seditdata['prows'][0], 
      itemrows:seditdata['itemrows'], acrows:seditdata['acrows']});
  }catch(err){}  
  });

app.post('/sendbilltodb', (req, res) => {
  //console.log(req.body.getdata)
  console.log("yaha agaye kya");
  var idf = req.body.idf;
  var mode = req.body.mode;
  var redicdata = req.body.getdata;
  var main = req.body.main; 
  console.log("idf=",idf);
  if(main == "undefined"){
    main = true;
  }
  
  //var returndata = {"mode":mode, "recdic":redicdata};
  //redicdata['grid']["stockarray"]);
  //expiry date not given of grid ------------- stk insert ---- important -- have to be given
  //till then its default given empty in stkinsert
  qry.csfinalbill(rmslogin.tclc, idf, redicdata, mode, main, function(){
        console.log("xxxx data ");
        res.send(JSON.stringify(redicdata));
    });
  
});

app.get('/addtodb',function(req,res){

  var rscr = req.session.rscr;
  var idf = req.query.cs ;
  var text = req.query.text;
  var column = req.query.getcolumn;
  var limit = req.query.limit;
  var mode = req.query.mode;
 console.log('mode get - ',mode);
 console.log('idf get - ',idf);
  qry.add_to_db(rmslogin.tclc, idf, text, column, mode, limit, function(data){
        res.send(JSON.stringify(data));
    });

  });

app.post('/addtodb',function(req,res){
  
  var rscr = req.session.rscr;
  var idf = req.body.cs ;
  var text = req.body.text; 
  var column = req.body.getcolumn;
  var limit = 1;
  var mode = req.body.mode;
  console.log('mode post - ',mode);
  console.log('idf post - ',idf);
  

  
  
  qry.add_to_db(rmslogin.tclc, idf, text, column, mode, limit, function(data){
        res.send(JSON.stringify(data));
    });

  });

app.post('/adduserinfo', function(req, res){

  var owner = req.session.rscr['owner'];
  var uqpath = req.session.rscr['uqpath'];
  
    ownerstat =[];
    ownerstat.push(req.body.name.toUpperCase());
    ownerstat.push(req.body.add1.toUpperCase());
    ownerstat.push(req.body.add2.toUpperCase());
    ownerstat.push(req.body.add3.toUpperCase());
    var printstat = {}
   
  
    if(req.body['Bill Page Type'] == '1'){printstat['A4'] = true; printstat['A6'] = false; printstat['A5'] = false; }
    else if(req.body['Bill Page Type'] == '3'){printstat['A4'] = false; printstat['A6'] = false; printstat['A5'] = true; }
    else if(req.body['Bill Page Type'] == '2') {printstat['A4'] = false; printstat['A6'] = true; printstat['A5'] = false; }
    else{printstat['A4'] = true; printstat['A6'] = false; printstat['A5'] = false;}

      var filter = { };
      var updatedata = { $set:{
        'ownerstatic':ownerstat,
        'ownervar.phone' : req.body.phone1.toString(),
        'ownervar.phone1' : req.body.phone2.toString(),
        'ownervar.email' : req.body.email.toString().toUpperCase(),
        'ownervar.regn' : req.body.regn.toString(),
        'ownervar.gstn' : req.body.gstn.toString(),
        'printsettings' : printstat
      }}
      var updateuserinfo = rmslogin.tclc["owner"].updateOne(filter, updatedata);
      updateuserinfo.then(function(upres){
        var updtosess = rmslogin.tclc["owner"].find({}).sort({'itemid' : -1}).toArray();
        updtosess.then(function(gotinfo){
          owner['o'] = gotinfo[0]['ownerstatic'][0];
          owner['oth'] = gotinfo[0]['ownervar'];
          owner['ownername']=  gotinfo[0]['ownerstatic'][0];
          owner['ownerstatic'] = gotinfo[0]['ownerstatic'];
          owner['ownervar'] = gotinfo[0]['ownervar'];
          uqpath['usersettingdata']['ownerstatic'] =  gotinfo[0]['ownerstatic'];
          uqpath['usersettingdata']['printsettings'] = gotinfo[0]['printsettings'];
          uqpath['usersettingdata']['ownervar'] = gotinfo[0]['ownervar'];
          uqpath['usersettingdata']['_id'] = gotinfo[0]['_id'].toString();
          req.session.rscr['htmlheaderdp'] = ownerstat[0]+" , "+ownerstat[1]+ " , "+ownerstat[2];
          res.render('rmspages/user-info', {spinfo: {"update": "Updated"}});
            
        }) 
      })
});

app.post('/addbankinfo', function(req, res){

  var owner = req.session.rscr['owner'];
  var uqpath = req.session.rscr['uqpath'];

      var filter = {};
      var updatedata = { $set:{
        'ownervar.bank2.add' : req.body.add2.toString().toUpperCase(),
        'ownervar.bank2.ifsc' : req.body.ifsc2.toString().toUpperCase(),
        'ownervar.bank2.upid' : req.body.upi2.toString(),
        'ownervar.bank2.name' : req.body.name2.toString().toUpperCase(),
        'ownervar.bank2.ac' : req.body.acno2,

        'ownervar.bank1.add' : req.body.add1.toString().toUpperCase(),
        'ownervar.bank1.ifsc' : req.body.ifsc1.toString().toUpperCase(),
        'ownervar.bank1.upid' : req.body.upi1.toString(),
        'ownervar.bank1.name' : req.body.name1.toString().toUpperCase(),
        'ownervar.bank1.ac' : req.body.acno1,

      }}
      
      var updateuserinfo = rmslogin.tclc["owner"].updateOne(filter, updatedata);
      updateuserinfo.then(function(upres){
        var updtosess = rmslogin.tclc["owner"].find({}).sort({'itemid' : -1}).toArray();
        updtosess.then(function(gotinfo){
          owner['oth'] = gotinfo[0]['ownervar'];
          owner['ownervar'] = gotinfo[0]['ownervar'];
          uqpath['usersettingdata']['ownervar'] = gotinfo[0]['ownervar'];
          uqpath['usersettingdata']['_id'] = gotinfo[0]['_id'].toString();
          res.render('rmspages/bank-info', {spinfo: {"update": "Updated"}});
            
        }) 
      })
});

app.post('/addbillseriesinfo', function(req, res){

      var filter = {};
      var updatedata = { $set:{
        'bill.main' : req.body.add2.toString().toUpperCase(),
        'bill.esti' : req.body.ifsc2.toString().toUpperCase(),
        'ownervar.bank2.upid' : req.body.upi2.toString(),
        'ownervar.bank2.name' : req.body.name2.toString().toUpperCase(),
        'ownervar.bank2.ac' : req.body.acno2,

        'ownervar.bank1.add' : req.body.add1.toString().toUpperCase(),
        'ownervar.bank1.ifsc' : req.body.ifsc1.toString().toUpperCase(),
        'ownervar.bank1.upid' : req.body.upi1.toString(),
        'ownervar.bank1.name' : req.body.name1.toString().toUpperCase(),
        'ownervar.bank1.ac' : req.body.acno1,

      }}
      
      var updateuserinfo = rmslogin.tclc["owner"].updateOne(filter, updatedata);
      updateuserinfo.then(function(upres){
        var updtosess = rmslogin.tclc["owner"].find({}).sort({'itemid' : -1}).toArray();
        updtosess.then(function(gotinfo){
          owner['oth'] = gotinfo[0]['ownervar'];
          owner['ownervar'] = gotinfo[0]['ownervar'];
          uqpath['usersettingdata']['ownervar'] = gotinfo[0]['ownervar'];
          uqpath['usersettingdata']['_id'] = gotinfo[0]['_id'].toString();
          res.render('rmspages/bank-info', {spinfo: {"update": "Updated"}});
            
        }) 
      })
});



module.exports.app = app