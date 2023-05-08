
const fs = require('fs');

const mlog = require('./userlogin');

const qry = require('./qrystore');
var ObjectId = require('mongodb').ObjectId;
const app = mlog.app ;
app.set('views',__dirname + '/vws');


// ========= Testing Area ============== //

// var tclc = mlog.MongoConnect("123_1231231231_123");
// // {"$match": { "igroup" : new RegExp("^" +textlike)} }; 
// var frm ="2023-04-01";
// var tod ="2023-04-30";
// var rp = {_id: '6454b0fd1fd25b98d2ee2863',spid: '6454b0fd1fd25b98d2ee285f',ledgid: 'x644ba658d82040a5a6ed37eb',transid: '644ba6bfd82040a5a6ed3808',
//           itype: '2',billautono: '',billno: 'S00005',billdate: '05/05/2023',cscr: 'CREDIT',csid: '644ba658d82040a5a6ed37f0',amount: '240',billas: 'M',
//           cmnt: 'Hello',fyear: '0',name: 'MEDI TEC SAMPLE CUSTOMER',add1: 'SAMPLE ADDRESS 1',add2: 'SAMPLE ADDRESS 2',stcode: '09',regn: 'REG.N',
//           gstn: '09FGHIJ0456K1ZM',mode: '2',mobile: '6666666666',invdate: '05/05/2023',gamt: '269',amt: '240',dbbilldate: '2023-05-05',
//           dbinvdate: '2023-05-05',esti: 'M',ddisc: '0',dbcscr: '1',gtot: '269',tsubtot: '240',tamt: '240',tdisamt: '0',ttaxamt: '28.8'
//         };

// var cscr = rp["cscr"];
// var fyear = 0;

// function pay_rcpt_cash_update(db, typ, rp, cr, dr, fyear){
//   const cfilter = {"transid":rp["transid"],"ledgid":rp["ledgid"]};
//   const cupdate = {"$set": {"type":typ, "billno":rp["billno"], "credit":cr,"debit":dr,"date":rp["dbbilldate"],"comment":rp["cmnt"]}};
//   const cinsert = {"cashid":0, "ledgid":rp["ledgid"], "transid":rp["transid"],"type":typ, "billno":rp["billno"], 
//                   "credit":cr,"debit":dr, "date":rp["dbbilldate"],"comment":rp["cmnt"]};
//   const prupdate = {"$set": {"type":typ, "billno":rp["billno"], "credit":dr,"debit":cr,"date":rp["dbbilldate"]}};
//   const prinsert = {"prid":0, "ledgid":rp["ledgid"], "transid":rp["transid"],"vautono":"","type":typ,"cash":0,
//                    "billno":rp["billno"], "credit":dr,"debit":cr,"date":rp["dbbilldate"],"status":0, "fyear":fyear,};

//   if(rp["cscr"] == 'CASH'){
//     db["pr"].deleteOne(cfilter).then(function(result){}); // have to delete pay_rcpt document if exists or not
//     db["cash"].find(cfilter).toArray().then(function(cdata){
//       if(cdata.length>0){
//         db["cash"].updateOne(cfilter, cupdate).then(function(cupdt){})
//         // "UPDATE cash document Here because data Exists";
//       }else{
//         cinsert["cashid"]= new ObjectId().toString(); // updating required cashid 
//         db["cash"].insertOne(cinsert).then(function(cinsert){})
//         // "Insert cash document Here because data NOT-Exists";
//       }
//     })
//   }
//   if(rp["cscr"] == 'CREDIT'){
//     db["cash"].deleteOne(cfilter).then(function(result){});
//     if(rp['mode'] == 2){
//       db["pr"].find(cfilter).toArray().then(function(prdata){
//         if(prdata.length>0){
//           db["pr"].updateOne(cfilter, prupdate).then(function(pr_updt){})
//           // "UPDATE pay_rcpt document Here because data Exists";
//         }else{
//           prinsert["prid"]= new ObjectId().toString(); // updating required prid 
//           db["pr"].insertOne(prinsert).then(function(pr_insert){})
//           // "Insert pay_rcpt document Here because data NOT-Exists";
//         }
//       })
//     }
//   }
// };

//pay_rcpt_cash_update(tclc[0], "2", rp, 0, parseFloat(rp["gtot"]), fyear);


// ========= Testing Area ============== //

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
   
   qry.csfind_by_name(mlog.tclc, "GET", idf, textlike, column, limit, function(data){
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
   
   qry.csfind_by_name(mlog.tclc, "POST", idf, req.body.searchtxt, column, 1, function(data){
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

  qry.csfind_by_name(mlog.tclc, "GET", idf, req.query.name.toUpperCase(), column, limit, function(data){
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
  qry.csfind_by_name(mlog.tclc, "POST", idf, req.body.searchtxt.toUpperCase(), column, stockfetchlimit, function(data){ 
        res.send(JSON.stringify(data));
    });
  
});

app.post('/sppartysearch',function(req,res){
  //console.log(req.body);
  //var db = mlog.db;
  var idf = req.body.name; // sale or purchase
  var column = "all";
  
  var limit = {"frm":req.body.frm,"tod":req.body.tod,
          "itype":req.body.itype,"billas":req.body.billas,}; 
  
  qry.csfind_by_name(mlog.tclc, "POST", idf, req.body.searchtxt.toUpperCase(), column, limit, function(data){
        res.send(JSON.stringify(data));
    });
});

var seditdata = {};

app.get('/speditcalculate',function(req,res){
  
  //console.log(req.query);
  var rscr = req.session.rscr;
  //console.log(rscr);
  let db = mlog.db;
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
        qry.SPINFO(mlog.tclc, ledgid, transid, "sup", "pur", "pitm", fyear, 
          function(err, rows, itemrows, acrows){
            if(rows){
              rows[0]['gamt'] = gamt;
              rows[0]['amt'] = 0;
              rscr['cssearch']==='purchase'
              rscr['cs']="supplier";
              seditdata = {'prows':rows, 'itemrows':itemrows, 'acrows':acrows};
              
              res.send(JSON.stringify(seditdata)); 
              //res.end(JSON.stringify(seditdata));
            }
          });
      }

  if (req.query.name == "customer"){
    qry.SPINFO(mlog.tclc, ledgid, transid, "cust", "sale", "sitm", fyear, 
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
    res.render('medipages/spedit', {spinfo: rscr, prows:seditdata['prows'][0], 
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
  
  qry.csfinalbill(mlog.tclc, idf, redicdata, mode, main, function(){
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
 
  qry.add_to_db(mlog.tclc, idf, text, column, mode, limit, function(data){
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
  
  qry.add_to_db(mlog.tclc, idf, text, column, mode, limit, function(data){
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
      var updateuserinfo = mlog.tclc["owner"].updateOne(filter, updatedta);
      updateuserinfo.then(function(upres){
      rscr['userinfo'] = ownerstat['userinfo'];
      var hederdpinfo = ownerstat['userinfo']['ownerstatic'];
      req.session.rscr['htmlheaderdp'] = hederdpinfo[0]+" , "+hederdpinfo[1]+ " , "+hederdpinfo[2];
      res.render('medipages/user-info', {spinfo: rscr['userinfo'] ,update:"Updated"});
            
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
      
      var updateuserinfo = mlog.tclc["owner"].updateOne(filter, updatedata);
      updateuserinfo.then(function(upres){

          rscr['bankinfo'] = bankstat['bankinfo'];
          res.render('medipages/bank-info', {spinfo:rscr['bankinfo'], update:"Updated"});
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
      
      var updateuserinfo = mlog.tclc["owner"].updateOne(filter, updatedata);
      updateuserinfo.then(function(upres){
        
        rscr['billseries'] = billstat['billseriesinfo']["bill"];
        rscr['billseriesinfo'] = billstat['billseriesinfo'];
        res.render('medipages/billseries-info', {spinfo: rscr['billseriesinfo']['bill'], update:"Updated" });

      })
});

app.get('/ledgersearch', function(req, res){
  var rscr =  req.session.rscr;
  var fyear = rscr["fyear"];
  
  var idf = req.query.idf;
  var text = req.query.text;
  var ledgid = req.query.ledgid;
  var frm = req.query.frm;
  var tod = req.query.tod;
  var itype = req.query.itype;
  var billas = req.query.billas;
  var limitrange = req.query.limitrange;
  
  qry.ledger_n_tax_search(mlog.tclc, idf, text, ledgid, frm, tod, itype, billas, fyear, limitrange, function(data){
        //console.log(">>>",data)
        res.send(JSON.stringify(data))
    });
  

});

module.exports.app = app