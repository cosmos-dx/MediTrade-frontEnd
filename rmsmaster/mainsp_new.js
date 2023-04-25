
const fs = require('fs');

const rmsfun = require('./rmsfun');
const rmslogin = require('./userlogin');


const app = rmslogin.app ;
app.set('views',__dirname + '/vws');

//var rscr = rmslogin.rscr ;


app.post('/rmsnav', function(req, res) {
    var rscr = req.session.rscr ;
    if (typeof rscr === 'undefined' ){
        // Session interrupted, logout
        res.redirect('/rmslogin');
      }
    else{
        if (req.body.name == 'rmslogout'){
            res.redirect('/rmslogin');
        }
        if (req.body.name == 'rmshome'){
            rscr['title']="RMS-Home";
            rscr['cssearch']="";
            rscr['cs']="";
            //console.log(rscr['daterow']);
            res.render('rmspages/rmshome', {spinfo: rscr})
            //res.render('rmspages/pmain', {spinfo: rscr});
        }
        if (req.body.name == 'usersettings'){
            rscr['title']="User-Settings";
            rscr['cssearch']="";
            rscr['cs']="";
            var settingdata = rscr["uqpath"]["usersettingdata"];
            //console.log(settingdata)
            res.render('rmspages/usersettings', {spinfo: rscr, settingdata:settingdata, error:""});
        }

        if (req.body.name == 'purchase'){
            rscr['title']="RMS-Purchase";
            rscr['cssearch']="purchase";
            rscr['cs']="supplier";
            res.render('rmspages/pmain', {spinfo: rscr});
        }
        if (req.body.name == 'sales'){
            rscr['title']="RMS-Sale";
            rscr['cssearch']="sale";
            rscr['cs']="customer";
            res.render('rmspages/smain', {spinfo: rscr});
        }
        if (req.body.name == 'spurchase'){
            rscr['title']="RMS-Purchase Search";
            rscr['cssearch']="purchase";
            rscr['cs']="supplier";
            res.render('rmspages/spsearch', {spinfo: rscr});
        }
        if (req.body.name == 'ssales'){
            rscr['title']="RMS-Sale Search";
            rscr['cssearch']="sale";
            rscr['cs']="customer";
            res.render('rmspages/spsearch', {spinfo: rscr});
        }
        if (req.body.name == 'addcustomer'){
            rscr['title']="RMS-AddCustomer";
            rscr['cssearch']="addcustomer";
            rscr['cs']="customer";
            res.render('rmspages/addp', {spinfo: rscr});
        }
        if (req.body.name == 'addsupplier'){
            rscr['title']="RMS-AddSupplier";
            rscr['cssearch']="addsupplier";
            rscr['cs']="supplier";
            res.render('rmspages/addp', {spinfo: rscr});
        }
        if (req.body.name == 'additem'){
            rscr['title']="RMS-AddItem";
            rscr['cssearch']="additem";
            rscr['cs']="items";
            res.render('rmspages/addp', {spinfo: rscr});
        }
    }
  });

app.post('/backtormshome', function(req, res){
    var rscr = req.session.rscr ;
    if (typeof rscr === 'undefined' ){
        // Session interrupted, logout
        res.redirect('/rmslogin');
      }
    if (req.body.name == 'rmshome'){
        rscr['title']="RMS-Home";
        rscr['cssearch']="";
        rscr['cs']="";
        //console.log(rscr['daterow']);
        res.render('rmspages/rmshome', {spinfo: rscr})
        //res.render('rmspages/pmain', {spinfo: rscr});
    }
    if (req.body.name == 'rmslogout'){
        res.redirect('/rmslogin');
    }
    
    if (req.body.name == 'usersettingsave'){
        // ownerstatic should be verified by admin
        var ownersettings = {
        "ownerstatic": ["RMS DEMO", "RMS DEMO ADDRESS 1", "RMS DEMO ADDRESS 2", "Empty Yet ADDRESS3"],
        "printsettings": {"A4":true, "A6":false, "A5":false},
        "displaysettings": {"batchlist":false,},
        "ownervar": {"info": req.body["info"], "phone":req.body["phone"], "phone1":req.body["phone1"], 
                    "tpname":req.body["tpname"], 
        "bank2": {"add":req.body["bankadd2"], "ifsc":req.body["bankifsc2"], "upid":req.body["bankupid2"], 
                 "name":req.body["bankname2"], "ac":req.body["bankac2"]},
        "bank1": {"add":req.body["bankadd1"], "ifsc":req.body["bankifsc1"], "upid":req.body["bankupid1"], 
                 "name":req.body["bankname1"], "ac":req.body["bankac1"]},
        "email":req.body["email"], "regn":req.body["regn"],"gstn":req.body["gstn"], },
        "bill" :{"main":req.body["billmain"], "esti":req.body["billesti"], "challan":req.body["billchallan"],
                "saleorder":req.body["billsaleorder"],"purchaseorder":req.body["billpurchaseorder"],
                "receipt":req.body["billreceipt"]},
        "keys": ["H1","H2", "H3", "H4"]
            };
        //var _id = rscr["uqpath"]["usersettingdata"]["_id"];
        var ObjectId = require('mongodb').ObjectId;
        var _id = new ObjectId(rscr["uqpath"]["usersettingdata"]["_id"]) 
        const filter = { "_id": _id};
        const updateval = {"$set": ownersettings};
        rmslogin.tclc["owner"].updateOne(filter, updateval).then(function(ownerupdate){
            rscr["uqpath"]["usersettingdata"] = ownersettings;
            res.render('rmspages/usersettings', {spinfo: rscr, settingdata:ownersettings, error:"RECORDS UPDATED SUCCESSFULLY !"})
        })   
    }  
})

app.post('/rmsqueries', function(req, res) {
    console.log('working in rmsqueries');
});

module.exports.app = app