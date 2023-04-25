
const fs = require('fs');

const rmsfun = require('./rmsfun');
const rmslogin = require('./userlogin');


const app = rmslogin.app ;
app.set('views',__dirname + '/vws');

//var rscr = rmslogin.rscr ;

var updict ={};

app.get('/rmsnav', function(req, res){

    if (req.query.id === 'undefined'){
        res.redirect('/rmslogin');
    }

    if(req.query.id == 'userinfo'){
        var rscr = req.session.rscr;
        res.render('rmspages/user-info',{spinfo : rscr['userinfo'], update :" "});

       
    }
    if(req.query.id == 'bankinfo'){
        var rscr = req.session.rscr; 
        res.render('rmspages/bank-info',{spinfo : rscr['bankinfo'], update :" "}); 
        
    }
    if(req.query.id == 'seriesinfo'){
        var rscr = req.session.rscr; 
        res.render('rmspages/billseries-info',{spinfo : rscr['billseriesinfo']['bill'], update: " "});
    }
    if(req.query.id == 'deleteallcoll'){
        rmslogin.tclc["trns"].drop();
        rmslogin.tclc["cash"].drop();
        rmslogin.tclc["pr"].drop();
        rmslogin.tclc["cust"].drop();
        rmslogin.tclc["sup"].drop();
        rmslogin.tclc["itm"].drop();
        rmslogin.tclc["stk"].drop(); 
        rmslogin.tclc["sale"].drop();
        rmslogin.tclc["sitm"].drop();
        rmslogin.tclc["pur"].drop();
        rmslogin.tclc["pitm"].drop();
        res.redirect('/rmslogin');


        
    }
})

app.post('/rmsnav', function(req, res) {
    var rscr = req.session.rscr ;
    //console.log(req.body);
    if (typeof rscr === 'undefined' ){
    // Session interrupted, logout
        res.redirect('/rmslogin');
      }
    else{
       
        if (req.body.name == 'rmshome'){
            rscr['title']="MediTrade-Home";
            rscr['cssearch']="";
            rscr['cs']="";
            //console.log(rscr['daterow']);
            res.render('rmspages/rmshome', {spinfo: rscr})
            //res.render('rmspages/pmain', {spinfo: rscr});
        }
        if (req.body.name == 'logout'){
            rscr['title']="MediTrade-Login";
            rscr['cssearch']="";
            rscr['cs']="";
            res.redirect('/rmslogin');
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



app.post('/rmsqueries', function(req, res) {
    console.log('working in rmsqueries');
    
});


module.exports.app = app