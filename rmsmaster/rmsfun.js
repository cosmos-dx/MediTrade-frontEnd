const fs = require('fs');
const Path = require("path");
const sqlite3 = require('sqlite3');

const memdb = require(Path.join(Path.dirname(__dirname),"rmsconfig\\member"));
var db = null; //require(Path.join(Path.dirname(__dirname),"rmsconfig\\rmsdb"));
//const memdb = require('nod/rmsconfig/member');
//const db = require('./rmsconfig/rmsdb');

function emptyRSCR(){
    var rscr = {"info":"MediTrade-Soft", "alert":"","title":"","htmlheaderdp":"","pathinfo":"",
        "updatermsregister":false, "rmsregister":"","getsdc":"", "csinfo":"","cinfo":"","sinfo":"",
        "dbfname":"", "loginpage":"/","homepage":"","tables":null,"recdic":null,"daterow":null,"daterange":[],
        "owner":"","uqpath":"","estidict":"","dbcscr":"","cscr":"","fyear":0, "sfyear":null,}//'sfyear'==>> Selected Fyear 
    return rscr;
}

function readRSCR(){
      let dbcscr={"CASH":"1","CREDIT":"2", "CHALLAN":"3", "ORDER":"4","":"1","0":"1"} // Force to CASH if empty values in keys
      let cscr={"1":"CASH","2":"CREDIT", "3":"CHALLAN", "4":"ORDER", "0":"","":""}
      //pan =>> hold panel headr or party (while billing) info related to bill
      //spid==>> saleID or purchaseID, transid==>>transationID, csid==>>customerID or supplierID
      //ledgid==>ledgerID, nameid==>ledgerID,id==>>saleID or purchaseID, billas==>>('M':Main GST Bill, 'E':EstimateBill, 'I':InterState GST Bill) 
      //itype = Invoice Type (GST Registered Party or Un-Registered Pary Usually Cash Bill, 1==>GST UnRegisterd 2==>GST Registered) 
      //dbcscr==> Cash Credit Value that sores in Database ('1'='CASH','2'='CREDIT','3'='CHALLAN','4'='Pending ORDER')
      //cscr==>('CASH','CREDIT'.'CHALLAN','ORDER'), area==> Where Party Work Place
      //regn==> Party's Registeration Number, gstn=>GST Number, pan==> Pancard Number,acentries==>>Account Entries
      //billdate==> dd/mm/yyyy, dbbilldate==>'yyyy/mm/dd', prolo==>> Profit or Loss on Bill
      //dis==>Discount on Bill, ddis==>Default Discount, mode==> Basically Payment Method
      //tdisamt=Total Discount Amount, tamt==>> Total Amount, pexpense==>Purchase Expences
      //tsubtot==>Amount without Discount or Bonus, updtval==>if Bill Updated then Diffenece After Update Bill 

      let pan={"spid":0,"transid":0,"csid":0,"nameid":0,"ledgid":0,"id":0,"billas":"M","itype":1,
        "name":0, "partyname":0, "add1":0, "add2":0, "add3":0, "pincode":0, "area":0,  "mobile":0,
        "email":0, "ophone":0, "pan":0, "bal":0, "regn":0, "gstn":0, "cmnt":"", "mode":0, "esti":0,
        "dbcscr":0, "cscr":0, "billdate":0, "invoicedate":0, "dbbilldate":0, "dbinvdate":0,"fyear":0,
        "ddisc":0, "dis":0, "billno":0, "mode":0,"prolo":0, "roundoff":0,"gtotwords":0,    
        "taxamt1":0,"taxamt2":0,"sgst":0,"cgst":0,"tdisamt":0,"ttaxamt":0,"tamt":0,"ttaxable":0,
        "tsubtot":0,"rgtot":0,"gtot":0, "acentries":false,"pexpense":0, "updtval":0,}

      // Stores Bill Item Details
      //sno==>>Serial Number, spitemid==>> Sale or Purchase ItemID,nameid==>ProductID, id==>ProductID
      //expdbf==> ExpieryDate of Idem in yyyy/mm/dd DataBase Format
      //stkvariable==>balance stock while user entering Quantity  

      let itemtemplate={"sno":0,"spitemid":"","id":"","nameid":"","name":"","pack":"","unit":"","hsn":"",
         "compid":"", "supid":"", "pgroup":"","prack":"","qty":"", "tqty":"","bbool":false,
         "bonus":"","cgst":0, "sgst":0,"tax1":0, "tax2":0, "dis":0, "mrp":"","prate":"","srate":"",
         "srate_a":"0","rate":"","tax":"", "ttax":"","amt":"","bat":"","nd":"","exp":"01/01",
         "expdbf":"01-01-2001","tdisamt":"","multibat":false,"stkinsert":false,"taxamt":"",
         "ttaxamt":"","amttot":"","netrate":"","netamt":"","ttaxamt":"","amttot":"","netrate":"",
         "netamt":"","edited":false,"batreplace":false,"staticbatinfo":[],"stockid":"", "updatedqty":"",
         "stkvariable":"", "dbstock":"", "batstock":"", "staticstk":"", "totalstock":"","pnet":""}
           
      //acid1 ==> Account ID 1
      let ac={"acid1":0,"acid2":0,"acid3":0,"acval1":0,"acval2":0,"acval3":0,}
      //recdic==>store records of sales or purchase bill 
      let recdic={"pan":pan,"grid":itemtemplate,"ac":ac,"static":{},"edit":false, "other":{}}
      let estidict={"e":"E","E":"E","m":"M","M":"M","":"M","undefined":"M", " ":"M"}
      let sdcinfo={"1":"Pharma Distribution","2":"Retail Medical","11":"General Trade",
                1:"Pharma Distribution",2:"Retail Medical",11:"General Trade",};
      // ownerstatic will get values from usersettings json ownerstatic as keys 
      // ownervar will get values from usersettings json ownervar as keys stores user info including user bank details   

      let owner={"o":"own", "cal":null,"oth":"","ownername":"","ownerstatic":"","ownervar":"",} // "cal" =>> finencial year calander
      let uqpath={"dbdir":null,"odb":null,"usersettingspath":null,"dbfname":null} // odb will be sqlitedb connection ready 
      let csinfo={"c":"", "s":"","sdc":1,"sdcinfo":"Pharma Distribution",}; // 1 for wholesale medical; 2 for retail medical; and 11 for general trade 

      //Database Table Name in Short
      let tables = {"CUST":"customer","SUP":"suppliers","CASH":"cash",
      "TRANS":"mytrans","ACNT":"`account`","AC_TRN":"ac_trans","P_R":"pay_rcpt","LEDG":"ledger",
      "PROD":"products","PURC":"purchase","SALE":"sales","SL_ITM":"sales_item","PR_ITM":"purchase_item",
      "STK":"stock","OWN_DT":"owner_det","OT_SETT":"oth_sett","BANK":"bank","TAX_RT":"vat_rate",
      "STK_FOR":"stockist_for","SALE_O":"sales_order","SL_O_ITM":"sales_order_item","PURC_O":"purchase_order",
      "PR_O_ITM":"purchase_order_item", "E_STK":"estistock",}
      let cinfo = {"cs":"sale","title":"Sale Panel","csname":"Customer",
              "cssearch":"Customer","recdic":recdic,}
      let sinfo = {"cs":"purchase","title":"Purchase Panel","csname":"Supplier",
              "cssearch":"suppliers","recdic":recdic,"tables":tables};

      //rscr==>Resources
      var rscr = {"info":"MediTrade-Soft", "alert":"","title":"","htmlheaderdp":"","pathinfo":"",
        "updatermsregister":false, "rmsregister":"","getsdc":"", "csinfo":csinfo,"cinfo":cinfo,"sinfo":sinfo,
        "dbfname":"", "loginpage":"/","homepage":"","tables":tables,"recdic":recdic,"daterow":null,"daterange":[],
        "owner":owner,"uqpath":uqpath,"estidict":estidict,"dbcscr":dbcscr,"cscr":cscr,"fyear":0, "sfyear":null,}//"sfyear"==>> Selected Fyear  
      return rscr;
}

function GetUserDirName(username, phone){
    var currentDir = Path.join(Path.dirname(__dirname),"rmsconfig");
    var newDirName = Path.join(currentDir,"userdb");
    var userDirName = username+"_"+phone+"_"+username ; 
    var userDbPath = Path.join(newDirName,userDirName);
    var dbpath = Path.join(userDbPath,"mrms.db");
    return {"currentDir":currentDir, "newDirName":newDirName,
           "userDirName":userDirName,"userDbPath":userDbPath,"dbpath":dbpath,};
}

function dbfileCreate(username, phone, flag='1'){
    var dirinfo = GetUserDirName(username, phone); 
    var currentDir = dirinfo['currentDir']; //Path.join(Path.dirname(__dirname),"rmsconfig");
    var newDirName = dirinfo['newDirName']; //Path.join(currentDir,"userdb");
    var srcDirFile = Path.join(Path.dirname(__dirname),"public", "mrms.db");
    
    
    if (!fs.existsSync(newDirName)){
        fs.mkdirSync(newDirName);
    }

    var userDirName = dirinfo['userDirName']; //GetUserDirName(username, phone); 
    var userDbPath = dirinfo['userDbPath']; //Path.join(newDirName,userDirName);
    var targetDirFile = Path.join(userDbPath,"mrms.db");
    var usesrSettingsFilePath = Path.join(userDbPath, "usersettings.json");
    var usesrSettings ={
                "ownerstatic": ["RMS DEMO", "RMS DEMO ADDRESS 1", "RMS DEMO ADDRESS 2", "Empty Yet ADDRESS3"],
                "ownervar": {"info": "xxxx", "phone": "1234567890", "phone1": "1234567890", "tpname": "", 
                "bank2": {"add": "BANK ADDRESS", "ifsc": "ABCDD123123", "upid": "", "name": "MY BANK", "ac": "123457543212312"},
                "bank1": {"add": "", "ifsc": "HDICIC53177", "upid": "", "name": "", "ac": ""},
                "email": "abcd@efg.com", "regn":"Owner Reg. Number","gstn":"Owner GSTN", },
                "bill" :{"main":"S", "esti":"E", "challan":"CHL", "saleorder":"SO","purchaseorder":"PO","receipt":"R"},
                "keys": ["H1","H2", "H3", "H4"]
                        };
    if (!fs.existsSync(userDbPath)){
        fs.mkdirSync(userDbPath);
        fs.copyFile(srcDirFile, targetDirFile, (err) => {
            if (err) throw err;
            console.log('srcDirFile was copied to targetDirFile');
        });
        fs.writeFileSync(usesrSettingsFilePath, JSON.stringify(usesrSettings, null, 4), 'utf8');
        
    }


 }

module.exports.memdb = memdb
module.exports.db = db
module.exports.emptyRSCR = emptyRSCR
module.exports.readRSCR = readRSCR
module.exports.GetUserDirName = GetUserDirName
module.exports.dbfileCreate = dbfileCreate