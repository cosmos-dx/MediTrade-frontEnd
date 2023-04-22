
const fs = require('fs');

const rmsfun = require('./rmsfun');
const rmslogin = require('./userlogin');


const app = rmslogin.app ;
app.set('views',__dirname + '/vws');

//var rscr = rmslogin.rscr ;

var updict ={};

app.get('/rmsnav', function(req, res){

    if (req.query.id === 'undefined'){
        // Session interrupted, logout
            res.redirect('/rmslogin');
          }

    if(req.query.id == 'userinfo'){
        var userinfo = rmslogin.tclc["owner"].find({}).sort({'itemid' : -1}).toArray();
        userinfo.then(function(result){
            updict['update'] = " ";
            updict['name'] = result[0]['ownerstatic'][0];
            updict['add1'] = result[0]['ownerstatic'][1];
            updict['add2'] = result[0]['ownerstatic'][2];
            updict['add3'] = result[0]['ownerstatic'][3];
            updict['phone'] = result[0]['ownervar']['phone'];
            updict['phone1'] = result[0]['ownervar']['phone1'];
            updict['email'] = result[0]['ownervar']['email'];
            updict['regn'] = result[0]['ownervar']['regn'];
            updict['gstn'] = result[0]['ownervar']['gstn'];
            updict['userinfocode'] = 
            res.render('rmspages/user-info',{spinfo : updict});
        })

       
    }
    if(req.query.id == 'bankinfo'){
        var userinfo = rmslogin.tclc["owner"].find({}).sort({'itemid' : -1}).toArray();
        userinfo.then(function(result){
            updict['update'] = " ";
            updict['add1'] = result[0]['ownervar']['bank1']['add'];
            updict['ifsc1'] = result[0]['ownervar']['bank1']['ifsc'];
            updict['upid1'] = result[0]['ownervar']['bank1']['upid'];
            updict['name1'] = result[0]['ownervar']['bank1']['name'];
            updict['acno1'] = result[0]['ownervar']['bank1']['ac'];

            updict['add2'] = result[0]['ownervar']['bank2']['add'];
            updict['ifsc2'] = result[0]['ownervar']['bank2']['ifsc'];
            updict['upid2'] = result[0]['ownervar']['bank2']['upid'];
            updict['name2'] = result[0]['ownervar']['bank2']['name'];
            updict['acno2'] = result[0]['ownervar']['bank2']['ac'];

            res.render('rmspages/bank-info',{spinfo : updict}); 
        })
       
        
    }
    if(req.query.id == 'seriesinfo'){

        var userinfo = rmslogin.tclc["owner"].find({}).sort({'itemid' : -1}).toArray();
        userinfo.then(function(result){
            updict['update'] = " ";
            updict['main'] = result[0]['bill']['main'];
            updict['esti'] = result[0]['bill']['esti'];
            updict['challan'] = result[0]['bill']['challan'];
            updict['saleorder'] = result[0]['bill']['saleorder'];
            updict['purchaseorder'] = result[0]['bill']['purchaseorder'];
            updict['receipt'] = result[0]['bill']['receipt'];

            res.render('rmspages/billseries-info',{spinfo : updict});
        })
         
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
            rscr['title']="RMS-Home";
            rscr['cssearch']="";
            rscr['cs']="";
            //console.log(rscr['daterow']);
            res.render('rmspages/rmshome', {spinfo: rscr})
            //res.render('rmspages/pmain', {spinfo: rscr});
        }
        if (req.body.name == 'logout'){
            rscr['title']="RMS-Login";
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