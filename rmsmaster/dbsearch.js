
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
  var stockfetchlimit = 5;
  
  try{
    qry.csfind_by_name(rmslogin.tclc, "POST", idf, req.body.searchtxt.toUpperCase(), column, stockfetchlimit, function(data){ 
         
          res.send(JSON.stringify(data));
      });
  }
  catch(e){
    res.redirect('/rmslogin');
  }
  
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

  var rscr = req.session.rscr;
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
            
              res.send(JSON.stringify(seditdata)); 
              //res.end(JSON.stringify(seditdata));
            }
          });
      }

  if (req.query.name == "customer"){
    qry.SPINFO(rmslogin.tclc, ledgid, transid, "cust", "sale", "sitm", fyear, 
          function(err, rows, itemrows, acrows){
         
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

  var idf = req.body.idf;
  var mode = req.body.mode;
  var redicdata = req.body.getdata;
  var main = req.body.main; 

  if(main == "undefined"){
    main = true;
  }
  


  try{
  qry.csfinalbill(rmslogin.tclc, idf, redicdata, mode, main, function(){

        res.send(JSON.stringify(redicdata));
    });
  }
  catch(e){
    res.redirect('/rmslogin');
  }
  
});

app.get('/addtodb',function(req,res){

  var rscr = req.session.rscr;
  var idf = req.query.cs ;
  var text = req.query.text;
  var column = req.query.getcolumn;
  var limit = req.query.limit;
  var mode = req.query.mode;

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


  
  
  qry.add_to_db(rmslogin.tclc, idf, text, column, mode, limit, function(data){
        res.send(JSON.stringify(data));
    });

  });

app.post('/adduserinfo', function(req, res){
  var rscr =  req.session.rscr;
    ownerstat = {
      "userinfo" :{"ownerstatic": [req.body.name, req.body.add1, req.body.add2, req.body.add3],
      "printsettings": req.body['pagetype'], 
      "displaysettings": {"batchlist":false,},
      "info": req.body.info, "phone": req.body.phone1, "phone1": req.body.phone2, "tpname": "", 
      "email": req.body.email, "regn":req.body.regn,"gstn":req.body.gstn,
      },
    }
    
    var filter ={};
    var updatedta = {$set : ownerstat}
      var updateuserinfo = rmslogin.tclc["owner"].updateOne(filter, updatedta);
      updateuserinfo.then(function(upres){
      rscr['userinfo'] = ownerstat['userinfo'];
      var hederdpinfo = ownerstat['userinfo']['ownerstatic'];
      req.session.rscr['htmlheaderdp'] = hederdpinfo[0]+" , "+hederdpinfo[1]+ " , "+hederdpinfo[2];
      res.render('rmspages/user-info', {spinfo: rscr['userinfo'] ,update:"Updated"});
            
      })
});

app.post('/addbankinfo', function(req, res){

  var rscr =  req.session.rscr;
  var bankstat = {
    "bankinfo" :{
      "bank2": {"add": req.body.add2.toUpperCase() , "ifsc": req.body.ifsc2.toUpperCase(), "upid": req.body.upid2, 
      "name": req.body.name2.toUpperCase(), "ac": req.body.acno2},
      "bank1": {"add": req.body.add1.toUpperCase(), "ifsc": req.body.ifsc1.toUpperCase(), "upid": req.body.upid1, 
      "name": req.body.name1.toUpperCase(), "ac": req.body.acno1},
   },
  }

      var filter = {};
      var updatedata = { $set:bankstat}
      
      var updateuserinfo = rmslogin.tclc["owner"].updateOne(filter, updatedata);
      updateuserinfo.then(function(upres){

          rscr['bankinfo'] = bankstat['bankinfo'];
          res.render('rmspages/bank-info', {spinfo:rscr['bankinfo'], update:"Updated"});
      })
});

app.post('/addbillseriesinfo', function(req, res){
  var rscr =  req.session.rscr;
  var billstat = {
    "billseriesinfo" : {
      "bill" :{"main":req.body.main.toUpperCase(), "esti":req.body.esti.toUpperCase(), "challan":req.body.challan.toUpperCase(),
       "saleorder":req.body.saleorder.toUpperCase(),"purchaseorder":req.body.purchaseorder.toUpperCase(),"receipt":req.body.receipt.toUpperCase()},
     }
  }

      var filter = {};
      var updatedata = { $set: billstat}
      
      var updateuserinfo = rmslogin.tclc["owner"].updateOne(filter, updatedata);
      updateuserinfo.then(function(upres){
        
        rscr['billseries'] = billstat['billseriesinfo']["bill"];
        rscr['billseriesinfo'] = billstat['billseriesinfo'];
        res.render('rmspages/billseries-info', {spinfo: rscr['billseriesinfo']['bill'], update:"Updated" });

      })
});



module.exports.app = app