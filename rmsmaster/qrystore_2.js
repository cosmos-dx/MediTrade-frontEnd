 function add_to_db(db, idf, text, column, mode, limit, callback){
	var data = []; 
	var qrystr = "";
	var actype = 4; // profite-loss ; 3=Expense; 2:Liability; 1:Assests Account Types 
	var sp_id = 1; // 1 for suppliers and 2 for customers

	if(mode==="search"){
	    if(idf==="compsupsearch"){
	    	qrystr = "SELECT supplier_name as name FROM suppliers WHERE ledgerID = "+text[0]+" AND mode =6 "+
	    	         " UNION "+
	    	         "SELECT supplier_name as name FROM suppliers WHERE supplierID = "+text[1]+" AND mode !=6";
	    	
	    	}
	    if(idf==="hsn"){qrystr = "SELECT DISTINCT hsn_code as name FROM products WHERE hsn_code LIKE '"+text+"%' LIMIT "+limit+" ";}
	    if(idf==="comp"){
	    	qrystr = "SELECT supplierID as id, ledgerID as nameid, supplier_name as name, supplier_address as add1, "+  
			" supplier_city as add2, supplier_state as add3, pincode as pincode, area as area, "+ 
			" mobile as mobile, email as email, office_phone as ophone, pan as pan, adh as bal, "+ 
			" drug_licence_no as regn, tin_no as gstn, comment as cmnt, mode as mode  "+ 
			" FROM suppliers WHERE supplier_name LIKE '"+text+"%' AND `mode` = 6 LIMIT "+limit+" ; " 
	    }
	    if(idf==="sup"){
	    	qrystr = "SELECT supplierID as id, ledgerID as nameid, supplier_name as name, supplier_address as add1, "+  
			" supplier_city as add2, supplier_state as add3, pincode as pincode, area as area, "+ 
			" mobile as mobile, email as email, office_phone as ophone, pan as pan, adh as bal, "+ 
			" drug_licence_no as regn, tin_no as gstn, comment as cmnt, mode as mode  "+ 
			" FROM suppliers WHERE supplier_name LIKE '"+text+"%' LIMIT "+limit+" ; " 
	    }
	    if(idf==="supplier_area"){qrystr="SELECT DISTINCT `area` as name FROM suppliers WHERE `area` LIKE '"+text+"%' AND `area` != '' LIMIT "+limit+" ;"}
	    if(idf==="customer_area"){qrystr="SELECT DISTINCT `area` as name FROM customer WHERE `area` LIKE '"+text+"%' AND `area` != '' LIMIT "+limit+" ;"}

	    if(idf==="items_igroup"){qrystr="SELECT DISTINCT `product_group` as name FROM products WHERE `product_group` LIKE '"+text+"%' AND `product_group` != '' LIMIT "+limit+" ;"}
	    
	    if(idf==="items_irack"){qrystr="SELECT DISTINCT `product_rack` as name FROM products WHERE `product_rack` LIKE '"+text+"%' AND `product_rack` != '' LIMIT "+limit+" ;"}
	    
	    if(idf==="ITEMDBSEARCH"){}	
	    if (idf==="items"){
		   // bonus column in products store netrate 
			qrystr = "SELECT product_name as name, pack, unit, bonus as netrate, purchase_price as prate,"+
      		" sale_price as srate,vat as tax1,sat as tax2,cst as tax, discount as dis, m_r_p as mrp, '0' as bonus, " +
      		" hsn_code as hsn, product_group as igroup, product_rack as irack, '' as batchno, '0' as batchstk,"+
      		" prym_sellerID as compid, supplierID as supid, productID as proid FROM products WHERE product_name LIKE "+
      		" '"+text+"%' LIMIT "+limit+" " ;
			};
   
		if (idf==="customer"){
			
			// const { MongoClient , ObjectId} = require('mongodb');
			// const uri = "mongodb+srv://techmed:benzene@cluster0.bdrk79r.mongodb.net/techmed?retryWrites=true&w=majority";
			// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
			// const db = client.db("techmed");
			// const collection = db.collection("customer");
			// cursor = await collection.find({'customer_name': {'$regex': text}});

			qrystr = "SELECT customer_name as name, customer_address as add1, customer_city as add2, customer_state as add3, "+
		    " pincode,`area`,mobile,email,office_phone as ophone,pan,adh as bal, drug_licence_no as regn, tin_no as gstn, comment as cmnt,`mode`, "+
		    " ledgerID as ledgid,  customerID as supid "+
		    " FROM customer WHERE customer_name LIKE "+
		    " '"+text+"%' LIMIT "+limit+" " ;
			};
		if (idf==="supplier"){
			 qrystr = "SELECT supplier_name as name, supplier_address as add1, supplier_city as add2, supplier_state as add3, "+
		    " pincode,`area`,mobile,email,office_phone as ophone,pan,adh as bal, drug_licence_no as regn, tin_no as gstn, comment as cmnt,`mode`, "+
		    " ledgerID as ledgid,  supplierID as supid "+
		    " FROM suppliers WHERE supplier_name LIKE "+
		    " '"+text+"%' LIMIT "+limit+" ";
			};
		if(qrystr===""){
	 		callback([">>>*** Wrong Methods Check Again !"]);
	 		return true;
	 		}

	 	// db.serialize(function() {
	    //     db.each(qrystr, function(err, row) {
	    //     	   //console.log(err, qrystr); 
	    //     	if (column == 'all'){
	    //         data.push(row); 
	    //     	}else{
	    //     		data.push(row[column]); 
	    //     	}
	    //       }, function(){ // calling function when all rows have been pulled
	    //         callback(data); 
	    //       });
	    //   });

	}; 
	if(mode==="save"){
		if (idf==="items"){
			
			qrystr = "INSERT INTO products(product_name, pack, unit, bonus,purchase_price, sale_price, vat, sat, cst, "+
			  " discount, m_r_p, hsn_code, product_group, product_rack,prym_sellerID, supplierID)  "+
			  " VALUES ('"+text['name']+"', '"+text['pack']+"', '"+text['unit']+"', '0', "+
			  " '"+text['prate']+"',  '"+text['srate']+"', '"+text['cgst']+"', '"+text['sgst']+"', "+
			  " '"+text['igst']+"', '0', '"+text['mrp']+"', '"+text['hsn']+"', "+
			  " '"+text['igroup']+"','"+text['irack']+"', '"+text['compid']+"', '"+text['supid']+"') "; 
			
		    db.serialize(function (){
				db.run(qrystr, function(err){
				  	if (err) {return [true, "items", err.message];} // will check further if error treu says;
		         
				}, function(){ // calling function when all rows have been pulled
	            callback([" "+text['name']+" Data "+mode+" Successfully !"]); 
	          });
			});
		}
		if (idf==="customer"){
			sp_id = 2;   // 1 for suppliers and 2 for customers 
			actype = 4;  // profite-loss
			qrystr0 = "INSERT INTO ledger(ac_type, sale_pur_ID) VALUES ("+actype+", "+sp_id+") ";
			
			console.log("Start 1");
			const collectionledge = db.collection("ledger");
			const collectioncustomer = db.collection("customer");
			//cursor = await collection.find({'customer_name': {'$regex': text}});

			var inledge = collectionledge.insertOne({ 'ac_type': actype, 'sale_pur_ID': sp_id });
			console.log("Start 2",inledge.insertedId);
			ledgerID = inledge.insertedId;




			// const insertdict_testing ={
			// 	ledgerID : 007,
			// 	name : "RAMAKANT GUPTA",
			// 	add1 : "kjkljkljklj",
			// 	add2 : "dfklsdjfsdf",
			// 	add3 : "09",
			// 	pincode : "sdfsdfsdf",
			// 	area : "dfklsdjfsdf",
			// 	mobile : "2349023423904723497234",
			// 	email :"dfklsdjfsdf",
			// 	ophone : "234234234",
			// 	pan : "dfklsdjfsdf",
			// 	bal : "dfklsdjfsdf",
			// 	regn : "dfklsdjfsdf",
			// 	gstn : "dfklsdjfsdf",
			// 	cmnt : "dfklsdjfsdf",
			// 	mode : 2,
			//   };

			  const insertdict ={
				ledgerID : 007,
				name : text['name'],
				add1 : text['add1'],
				add2 : text['add2'],
				add3 : text['stcode'],
				pincode : text['pincode'],
				area : text['area'],
				mobile : text['phone'],
				email : text['email'],
				ophone : text['offphone'],
				pan : text['pan'],
				bal : text['obal'],
				regn : text['regn'],
				gstn : text['gstn'],
				cmnt : text['cmnt'],
				mode : text['mode']
			  };

			  console.log("this is my dictionary",insertdict);

			  async function main () {
				const insertResult = await collectioncustomer.insertMany([insertdict]);
			  }
			  main()
				 .then("",console.log)
				 .catch("",console.error)




			// const incustomer = collectioncustomer.insertOne({
			// 	ledgerID : 007,
			// 	customer_name : text['name'],
			// 	customer_address : text['add1'],
			// 	customer_city : text['add2'],
			// 	customer_state : text['stcode'],
			// 	pincode : text['pincode'],
			// 	area : text['area'],
			// 	mobile : text['phone'],
			// 	email : text['email'],
			// 	office_phone : text['offphone'],
			// 	pan : text['pan'],
			// 	adh : text['obal'],
			// 	drug_licence_no : text['regn'],
			// 	tin_no : text['gstn'],
			// 	comment : text['cmnt'],
			// 	mode : text['mode']
			// });
			// console.log(incustomer);


			//----------------------------- 09AXVPK5104D1ZE


			// var incustomer = await customer_model({
			// 	ledgerID : ledgerID,
			// 	customer_name : text['name'],
			// 	customer_address : text['add1'],
			// 	customer_city : text['add2'],
			// 	customer_state : text['stcode'],
			// 	pincode : text['pincode'],
			// 	area : text['area'],
			// 	mobile : text['phone'],
			// 	email : text['email'],
			// 	office_phone : text['offphone'],
			// 	pan : text['pan'],
			// 	adh : text['obal'],
			// 	drug_licence_no : text['regn'],
			// 	tin_no : text['gstn'],
			// 	comment : text['cmnt'],
			// 	mode : text['mode']
			// });
			//incustomer.save();



			// console.log(ledgerID,text['name'],text['add1'], text['stcode'],text['pincode'],text['area'],text['phone'],  text['email'],text['email'],
			// text['offphone'],text['pan'],text['obal'],text['regn'],text['gstn'],text['cmnt'],text['mode']);
			//
			//db.close();
			callback([" "+text['name']+" Data "+mode+" Successfully !"]); 
			return true;
			

			
			var supmode = 2; // 6 for company

		    // db.serialize(function (){
			// 	db.run(qrystr0, function(err){
			// 	  if (err) {console.log(true, 'ledger', err.message);} // will check further if error treu says;
			// 	  var lid = this.lastID;
			// 	  console.log(" line108 ger ledgerid ", lid);

			// 	  qrystr1 = "INSERT INTO customer(ledgerID, customer_name, customer_address, customer_city, customer_state, "+
			// 	    " pincode, `area`, mobile, email, office_phone, pan, adh, drug_licence_no, tin_no, comment, `mode`) "+ 
			// 	    " VALUES ("+lid+", '"+text['name']+"', '"+text['add1']+"', '"+text['add2']+"', '"+text['stcode']+"', "+
			// 	    " '"+text['pincode']+"',  '"+text['area']+"', '"+text['phone']+"', '"+text['email']+"', "+
			// 	    " '"+text['offphone']+"', '"+text['pan']+"', '"+text['obal']+"', '"+text['regn']+"', "+
			// 	    " '"+text['gstn']+"','"+text['cmnt']+"', '"+text['mode']+"' )";
		    //       db.run(qrystr1, function(err){
			// 	  	if (err) {console.log(true, 'suppliers', err.message);} // will check further if error treu says;
		         	
			// 		}, function(){
			// 			callback([" "+text['name']+" Data "+mode+" Successfully !"]); 
			// 		});

			// 	});
			// });
			//return true;
		}
		if (idf==="supplier"){
			sp_id = 1;   // 1 for suppliers and 2 for customers 
			actype = 4;  // profite-loss
			qrystr0 = "INSERT INTO ledger(ac_type, sale_pur_ID) VALUES ("+actype+", "+sp_id+") ";
			var supmode = 2; // 6 for company

		    db.serialize(function (){
				db.run(qrystr0, function(err){
				  if (err) {console.log(true, 'ledger', err.message);} // will check further if error treu says;
				  var lid = this.lastID;
				  console.log(" line137 ger ledgerid ", lid);
				  qrystr1 = "INSERT INTO suppliers(ledgerID, supplier_name, supplier_address, supplier_city, supplier_state, "+
				    " pincode, `area`, mobile, email, office_phone, pan, adh, drug_licence_no, tin_no, comment, `mode`) "+ 
				    " VALUES ("+lid+", '"+text['name']+"', '"+text['add1']+"', '"+text['add2']+"', '"+text['stcode']+"', "+
				    " '"+text['pincode']+"',  '"+text['area']+"', '"+text['phone']+"', '"+text['email']+"', "+
				    " '"+text['offphone']+"', '"+text['pan']+"', '"+text['obal']+"', '"+text['regn']+"', "+
				    " '"+text['gstn']+"','"+text['cmnt']+"', '"+supmode+"' )";
		          db.run(qrystr1, function(err){
				  	if (err) {console.log(true, 'suppliers', err.message);} // will check further if error treu says;
		         
					}, function(){
						callback([" "+text['name']+" Data "+mode+" Successfully !"]); 
					});

				});
			});


		}

		if (idf==="comp"){
			sp_id = 1;   // 1 for suppliers and 2 for customers 
			actype = 4;  // profite-loss
			qrystr0 = "INSERT INTO ledger(ac_type, sale_pur_ID) VALUES ("+actype+", "+sp_id+") ";
			var supmode = 6; // 6 for company
			
		    db.serialize(function (){
				db.run(qrystr0, function(err){
				  if (err) {console.log(true, 'ledger', err.message);} // will check further if error treu says;
				  var lid = this.lastID;
				  qrystr1 = "INSERT INTO suppliers(ledgerID, supplier_name, supplier_address, supplier_city, supplier_state, "+
				    " pincode, `area`, mobile, email, office_phone, pan, adh, drug_licence_no, tin_no, comment, `mode`) "+ 
				    " VALUES ("+lid+", '"+text['name']+"', '"+text['add1']+"', '"+text['add2']+"', '"+text['stcode']+"', "+
				    " '"+text['pincode']+"',  '"+text['area']+"', '"+text['phone']+"', '"+text['email']+"', "+
				    " '"+text['offphone']+"', '"+text['pan']+"', '"+text['obal']+"', '"+text['regn']+"', "+
				    " '"+text['gstn']+"','"+text['cmnt']+"', '"+supmode+"' ) ";
		          db.run(qrystr1, function(err){
				  	if (err) {console.log(true, 'suppliers', err.message);} // will check further if error treu says;
		         
					}, function(){
						callback([" "+idf+" Data "+mode+" Successfully !"]); 
					});

				});
			});


		}
			
		
	};
	if(mode==="update"){
		
	};
	if(mode==="delete"){
		
	};
	

};

async function csfind_by_name(db, idf, text, column, limit, callback){
	var data = []; 
	var cursor =[];
	var qrystr = "";
	
	if (idf==="items"){
		// bonus column in products store netrate 
		qrystr = "SELECT product_name as name, pack, unit, bonus as netrate, purchase_price as prate,"+
      " sale_price as srate,vat as tax1,sat as tax2,cst as tax, discount as dis, m_r_p as mrp, '0' as bonus, " +
      " hsn_code as hsn, product_group as pgroup, product_rack as prack, '' as batchno, '0' as batchstk,"+
      " prym_sellerID as compid, supplierID as supid, productID as proid FROM products WHERE product_name LIKE "+
      " '"+text+"%' LIMIT "+limit+" " ;
	};
   
   if (idf==="stock"){
   	qrystr = "SELECT stockID, productID as proid, batch_no as batchno, qty, exp_date as expdt "+
   	" FROM stock WHERE productID = '"+text+"' AND qty > 0 ORDER BY stockID DESC LIMIT "+limit+" ";
	};

	if (idf==="customer"){

		const collection = db.collection("customer");
		cursor = await collection.find({'customer_name': {'$regex': text}});



		qrystr = "SELECT customer_name as name, customer_address as add1, customer_city as add2, customer_state as add3, "+
	    " pincode,`area`,mobile,email,office_phone as ophone,pan,adh as bal, drug_licence_no as regn, tin_no as gstn, comment as cmnt,`mode`, "+
	    " ledgerID as ledgid,  customerID as supid "+
	    " FROM customer WHERE customer_name LIKE "+
	    " '"+text+"%' LIMIT "+limit+" " ;

		

		await cursor.forEach((doc) => {
			//console.log("**********************************************************************");
			//console.log(doc);
			if (column === 'all') {
			  data.push(doc);
			  //console.log(doc);
			} else {
			  data.push(doc[column]);
			  monrow = data;
			  //console.log("----",data);
			}
			//callback(["dfsdfsdf"]);
		  } //callback(data)
		  );
		  callback(data);
		  return data;

	};
	if (idf==="supplier"){
		 qrystr = "SELECT supplier_name as name, supplier_address as add1, supplier_city as add2, supplier_state as add3, "+
	    " pincode,`area`,mobile,email,office_phone as ophone,pan,adh as bal, drug_licence_no as regn, tin_no as gstn, comment as cmnt,`mode`, "+
	    " ledgerID as ledgid,  supplierID as supid "+
	    " FROM suppliers WHERE supplier_name LIKE "+
	    " '"+text+"%' LIMIT "+limit+" ";
	};
   
   if (idf==="sale"){
		var tablename = 'sales';
      var cstable = 'customer';
      var frm = limit["frm"];
   	var tod = limit["tod"];
   	var itype = limit["itype"];
   	var billas = limit["billas"];
		qrystr = " SELECT tbn.ledgerID as ledgid, tbn.trans_ID as transid, "+
			" strftime('%d/%m/%Y',tbn.bill_date) as dt, tbn.bill_no as billno, custb.customer_name as name, "+
			" tbn.cash_cr as cscr, tbn.sale_amount as amt, tbn.salesID as spid, tbn.fyear as fyear  FROM "+tablename+" as tbn "+
			" LEFT JOIN "+cstable+" as custb ON tbn.ledgerID = custb.ledgerID "+
			" WHERE tbn.bill_date BETWEEN '"+frm+"' AND '"+tod+"' AND tbn.i_type IN "+itype+" AND custb.customer_name LIKE "+
			" '"+text+"%' AND tbn.bill_as IN "+billas+" ";
	};

	if (idf==="purchase"){
		var tablename = 'purchase';
      var cstable = 'suppliers';
      var frm = limit["frm"];
   	var tod = limit["tod"];
   	var itype = limit["itype"];
   	var billas = limit["billas"];
		qrystr = " SELECT tbn.ledgerID as ledgid, tbn.trans_ID as transid, "+
			" strftime('%d/%m/%Y',tbn.bill_date) as dt, tbn.purchase_inv as billno, custb.supplier_name as name, "+
			" tbn.cash_cr as cscr, tbn.purchase_amount as amt, tbn.purchaseID as spid, tbn.fyear as fyear  FROM "+tablename+" as tbn "+
			" LEFT JOIN "+cstable+" as custb ON tbn.ledgerID = custb.ledgerID "+
			" WHERE tbn.bill_date BETWEEN '"+frm+"' AND '"+tod+"' AND tbn.i_type IN "+itype+" AND custb.supplier_name LIKE "+
			" '"+text+"%' AND tbn.bill_as IN "+billas+" ";
	};

   if (idf==="billnoset"){
   	var fy = limit["fyear"];
   	var bas = limit["billas"];
   	var bhd = limit["billhead"];

   	qrystr = "SELECT bill_no as billno FROM sales WHERE fyear = "+fy+" AND "+
   	" bill_as = '"+bas+"' AND bill_no LIKE '"+bhd+"%' ORDER BY trans_ID DESC LIMIT 1 ";

   };

	if(qrystr===""){
	 	callback([">>>*** Wrong Methods Check Again !"]);
	 	return true;
	 } 


 	// db.serialize(function() {
    //     db.each(qrystr, function(err, row) {
    //     	   //console.log(err, qrystr); 
    //     	if (column == 'all'){
    //         data.push(row); 
    //     	}else{
    //     		data.push(row[column]); 
    //     	}
    //     }, function(){ // calling function when all rows have been pulled
    //         //db.close(); // will not close db; query would continue so will remain open close after logout
    //         callback(data); 
    //     });
    // });
 	
 	}

function csfinalbill(db, idf, rd, mode, tbl, callback){
	var rp = rd["pan"];
	var cscr = rp["cscr"];
	var fyear = rp["fyear"];
	var lastID;
	var grid = rd["grid"];
	var rgrid = rd["grid"];
	var rac = rd["ac"];
	var main = false;
	var typ = 1 ; // FOR PURCHASE
	var transid;
	var cashid;
   var saleid;
   var purchaseid;
   var acinsertid;
   var purflag;
   var itemflag;
   var saleflag;
   var transflag;
   var prupdaterow;
   var spid;
   var prid = 0;
   var ins_upd_row;
   var crdrtype="crdeit";
   var cr = "credit";
   var dr = "debit"
	var row = {"transid":"N.A","pay_recipt":"N.A","saleid":"N.A","items":"N.A","cashid":"N.A",};
	if (idf==="supplier"){
		if (mode=="save"){
			console.log(" find124 entered in supplier save");
			db.serialize(function () {
			    var lastID;
			    if (rp["cscr"]=="CHALLAN"){
			    	main = false;
			    	var transid = "0";
			    	var saleid = '0';
			    	var itemflag = '00';
			    	var salequery = "INSERT INTO "+tbl['PURC_O']+" (ledgerID, trans_ID, i_type, bill_no, bill_date, cash_cr,"+
		            " customerID, sale_amount, bill_as, comment, fyear) "+
					   " VALUES ("+rp['ledgid']+", '"+transid+"', '"+rp['itype']+"', '"+rp['billno']+"', '"+rp['dbbilldate']+"', "+
					   " "+rp['dbcscr']+", '"+rp['csid']+"', '"+rp['gtot']+"', '"+rp['billas']+"', '"+rp['cmnt']+"', '"+fyear+"') ";
					db.run(salequery, function(err){
					  if (err) {
			        	 return [true, tbl['PURC_O'], err.message]; // will check further if error treu says;
			         }
			         var purchaseid = this.lastID; // get the last insert id
				      itemflag = PANEL_PURCHASE_PROD(fyear, tbl["PR_O_ITM"], tbl, rd, db, purchaseid, transid, main);
			         return [false, tbl['PURC_O'], itemflag];
					  });
					return [false, tbl['PURC_O'], "nothing"];
			    }

			    if (cscr=="CASH"){crdrtype = 'debit';};
			    if (cscr=="CREDIT"){crdrtype = 'credit';};

			    
			    var trnsquery = " INSERT INTO "+tbl['TRANS']+" (ledgerID, transaction_type, type, "+crdrtype+", fyear) "+
		        " VALUES ("+rp['ledgid']+", '"+rp['dbcscr']+"', '"+typ+"', '"+rp['gtot']+"', '"+fyear+"') ";

			    db.run(trnsquery, function (err) {
			      if (err) {
			        return [true, tbl['TRANS'], err.message]; // will check further if error treu says; 	
			      }
			        transid = this.lastID;
			    console.log(" find159 got transid, ", transid);     
			    var cashquery = "INSERT INTO "+tbl['CASH']+" (ledgerID, transactionID, `type`, voucher_no, "+crdrtype+", `date`, `comment`) "+
		   		 	" VALUES ("+rp['ledgid']+", '"+transid+"', '"+typ+"', '"+rp['billno']+"', '"+rp['gtot']+"', '"+rp['dbbilldate']+"', "+
		   		 	" '"+rp['cmnt']+"') ";
			      
			      if (cscr=="CREDIT"){
			      	// will never insert in CASH TABLE
			      	if (rp['mode'] == '2'){
			      		crdrtype = "debit";
			      		cashquery = "INSERT INTO "+tbl['P_R']+" (ledgerID, trans_ID, voucher_no, `type`, "+crdrtype+", fyear) " +
		    			   " VALUES ("+rp['ledgid']+", '"+transid+"', '"+rp['billno']+"', '"+typ+"', '"+rp['gtot']+"', '"+fyear+"') ";
		    			}
			      }

			      db.run(cashquery, function (err) {
			        if (err) {
			        return [true, tbl['CASH'], err.message];
			        } // will check further if error treu says;
			        cashid = this.lastID; // get the last insert id
			        var purquery = "INSERT INTO "+tbl['PURC']+" (ledgerID, trans_ID, i_type, purchase_inv, bill_date, inv_date, cash_cr, "+
		            " supplierID, purchase_amount, bill_as, comment, fyear) "+
		   			" VALUES ("+rp['ledgid']+", '"+transid+"', '"+rp['itype']+"', '"+rp['billno']+"', '"+rp['dbbilldate']+"', '"+rp['dbinvdate']+"', "+
		   			" "+rp['dbcscr']+", '"+rp['csid']+"', '"+rp['gtot']+"', '"+rp['billas']+"', '"+rp['cmnt']+"', '"+fyear+"') ";
			        
					  db.run(purquery, function(err){
					  	if (err) {return [true, tbl['PURC'], err.message];} // will check further if error treu says;
			         purchaseid = this.lastID; // get the last insert id

			         console.log(" find187 got purchaseid, ", purchaseid);  

			         itemflag = PANEL_PURCHASE_PROD(fyear, tbl["PR_ITM"], tbl, rd, db, purchaseid, transid, main);
			         
			         return [true, tbl["PR_ITM"], "Done"];
					  	});

			       });

			      //db.close();
			    });
		  })

	  } // supplier save mode close

	  if (mode=="update"){
	  	crdrtype = 'debit';
      dr = 'debit' ;
      cr = 'credit';
      if (rp["cscr"]=='CHALLAN'){
		  	itemflag = '00';
			transid = rp['transid'] ;
			spid = rpan['spid'];
			purflag = PURCHASE_UPDATE(fyear, tbl["PURC_O"], rd, db, transid, spid);
			itemflag = PANEL_PURCHASE_PROD(fyear, tbl["PR_O_ITM"], tbl, rd, db, spid, transid, main);
		   return [false, "Purchase CHALLAN Update", "Done"];
		  }
		
		  var chkquery = " SELECT transactionID, debit, credit, cashidID FROM "+tbl['CASH']+" "+
	         " WHERE ledgerID = "+rp['ledgid']+" AND transactionID = "+rp['transid']+" ";
		  db.serialize(function (){
          db.all(chkquery, function(err, rows){
          	if(rows.length>0){
          		cashid = rows["cashID"];
	       		CASH_UPDATE(fyear, tbl, rd, db, typ, crdrtype, cashid, transid);
          	}else{
          		cashid = CASH_INSERT(fyear, tbl, rd, db, typ, crdrtype, transid);
          	}
          	if (rp["cscr"]=='CASH'){
          		cr = 'debit';
		    		dr = 'credit' ;
		    		transflag = TRANS_UPDATE(fyear, tbl, rd, db, typ, cr, dr, transid) ;
		    		if (rp['mode'] == '2'){P_R_DELETE(fyear, tbl, rd, db, typ, cr, transid);}
		    		purflag = PURCHASE_UPDATE(fyear, tbl["PURC"], rd, db, transid, spid);
			      itemflag = PANEL_PURCHASE_PROD($fyear, tbl["PR_ITM"], tbl, rd, db, spid, transid, main);	
			      return [false, "Purchase CASH Update", "Done"];
          	}
          	if (rp["cscr"]=='CREDIT'){
          		cr = 'credit';
			    	dr = 'debit' ;
			    	transflag = TRANS_UPDATE(fyear, tbl, rd, db, typ, cr, dr, transid) ;
			    	if (rp['mode'] == '2'){
			    		crdrtype = "debit";
			         P_R_DELETE(fyear, tbl, rd, db, typ, cr, transid);
			         prupdaterow = P_R_UPDATE(fyear, tbl, rd, db, typ, crdrtype, transid);
			    	}else{
			    		crdrtype = "debit";
			         prupdaterow = P_R_UPDATE(fyear, tbl, rd, db, typ, crdrtype, transid);
			    	}
			    	itemflag = PANEL_PURCHASE_PROD(fyear, tbl["PR_ITM"], tbl, rd, db, spid, transid, main);
			    	return [false, "Purchase CREDIT Update", "Done"];
          	}

          });		  	
		  })	

		} // supplier update mode close
	} // supplier closed finally

	if (idf==="customer"){
		
		if (mode=="save"){
		  crdrtype = 'credit';	
		  db.serialize(function () {
		    if (cscr=="CHALLAN"){
		    	main = false;
		    	transid = "0";
		    	saleid = '0';
		    	itemflag = '00';
		    	salequery = "INSERT INTO "+tbl['SALE_O']+" (ledgerID, trans_ID, i_type, bill_no, bill_date, cash_cr,"+
	            " customerID, sale_amount, bill_as, comment, fyear) "+
				   " VALUES ("+rp['ledgid']+", '"+transid+"', '"+rp['itype']+"', '"+rp['billno']+"', '"+rp['dbbilldate']+"', "+
				   " "+rp['dbcscr']+", '"+rp['csid']+"', '"+rp['gtot']+"', '"+rp['billas']+"', '"+rp['cmnt']+"', '"+fyear+"') ";
				db.run(salequery, function(err){
				  if (err) {
		        	 return [true, tbl['SALE_O'], err.message]; // will check further if error treu says;
		         }
		         saleid = this.lastID; // get the last insert id
		         itemflag = PANEL_SALE_PROD(fyear, tbl['SL_O_ITM'], tbl, rd, db, saleid, transid, main);
		         return [false, tbl['SALE_O'], itemflag];
				  });
				return [false, tbl['SALE_O'], "nothing"];
		    } // customer save challan closed
		    
		    if (cscr=="CASH"){var crdrtype = 'credit';};
		    if (cscr=="CREDIT"){var crdrtype = 'debit';};

		    trnsquery = " INSERT INTO "+tbl['TRANS']+" (ledgerID, transaction_type, type, "+crdrtype+", fyear) "+
	        " VALUES ("+rp['ledgid']+", '"+rp['dbcscr']+"', '"+typ+"', '"+rp['gtot']+"', '"+fyear+"') ";
		    
		    db.run(trnsquery, function (err) {
		      if (err) {
		        console.log(" find289 got trnsquery error, ", trnsquery);  
		        return [true, tbl['TRANS'], err.message]; // will check further if error treu says; 	
		      }
		      transid = this.lastID;
		      crdrtype = 'credit';
		      if (cscr=="CASH"){crdrtype = 'credit';}else{crdrtype = 'debit';};

		      
		      cashquery = "INSERT INTO "+tbl['CASH']+" (ledgerID, transactionID, `type`, voucher_no, "+crdrtype+", `date`, `comment`) "+
	   		 	" VALUES ("+rp['ledgid']+", '"+transid+"', '"+typ+"', '"+rp['billno']+"', '"+rp['gtot']+"', '"+rp['dbbilldate']+"', "+
	   		 	" '"+rp['cmnt']+"') ";
		      
		      if (cscr=="CREDIT"){
		      	// will never insert in CASH TABLE
		      	if (rp['mode'] == '2'){
		      		var crdrtype = "credit";
		      		cashquery = "INSERT INTO "+tbl['P_R']+" (ledgerID, trans_ID, voucher_no, `type`, "+crdrtype+", fyear) " +
	    			   " VALUES ("+rp['ledgid']+", '"+transid+"', '"+rp['billno']+"', '"+typ+"', '"+rp['gtot']+"', '"+fyear+"') ";
	    			}
		      }

		      db.run(cashquery, function (err) {
		        if (err) {
		        	 console.log(" find312 got cashquery error, ", cashquery);  
		        	 return [true, tbl['CASH'], err.message]; // will check further if error treu says;
		        }
		        cashid = this.lastID; // get the last insert id

		        //another qry 
		        salequery = "INSERT INTO "+tbl['SALE']+" (ledgerID, trans_ID, i_type, bill_no, bill_date, cash_cr,"+
	                                             "   customerID, sale_amount, bill_as, comment, fyear) "+
				   " VALUES ("+rp['ledgid']+", '"+transid+"', '"+rp['itype']+"', '"+rp['billno']+"', '"+rp['dbbilldate']+"', "+
				   "   "+rp['dbcscr']+", '"+rp['csid']+"', '"+rp['gtot']+"', '"+rp['billas']+"', '"+rp['cmnt']+"', '"+fyear+"') ";
				 
				  db.run(salequery, function(err){
				  	if (err) {
				  	 console.log(" find325 got salequery error, ", salequery);	
		        	 return [true, tbl['SALE'], err.message]; // will check further if error treu says;
		         }
		         saleid = this.lastID; // get the last insert id
		         itemflag = PANEL_SALE_PROD(fyear, tbl['SL_ITM'], tbl, rd, db, saleid, transid, main);
		         return {"result":"saved"};

				});

		       });
		      return {"result":"saved last"};
		      //db.close();
		    });
 		 });

		} // customer save close final

		if (mode=="update"){
		  crdrtype = 'credit';
  		  cr = 'credit';
  		  dr = 'debit' ;

  		  transid = rp['transid'];
		  spid = rp['spid'];
		  if (rp["cscr"]=='CHALLAN'){
				itemflag = '00';
				transid = rp['transid'] ;
				saleid = rp['spid'] ;
				saleflag = SALE_UPDATE(fyear, tbl['SALE_O'], rd, db, transid, saleid);
				itemflag = PANEL_SALE_PROD(fyear, tbl['SL_O_ITM'], tbl, rd, db, saleid, transid, main);
				return [false, "Sales CHALLAN Update", "Done"];
		  	} // customer update challan closed

		  	var chkquery = " SELECT transactionID, debit, credit, cashidID FROM "+tbl['CASH']+" "+
		         " WHERE ledgerID = "+rp['ledgid']+" AND transactionID = "+rp['transid']+" ";
		  	db.serialize(function () {
		       db.all(chkquery, function(err, rows){
		       	if(rows.length>0){
		       		var cashid = rows["cashID"];
		       		CASH_UPDATE(fyear, tbl, rd, db, typ, cr, cashid, transid);
		       	}
		       	else{
		       		var cashid = CASH_INSERT(fyear, tbl, rd, db, typ, cr, transid);
		       	}
		         if (rp["cscr"]=='CASH'){
			       	var transflag = TRANS_UPDATE(fyear, tbl, rd, db, typ, cr, dr, transid) ;
				      if (rp['mode'] == '2'){P_R_DELETE(fyear, tbl, rd, db, typ, cr, transid);}
				      var saleflag = SALE_UPDATE(fyear, tbl['SALE'], rd, db, transid, spid);
				    	var itemflag = PANEL_SALE_PROD(fyear, tbl['SL_ITM'], tbl, rd, db, spid, transid, main);
				      return [false, "Sales CASH Update", "Done"];
			        };
			      if (rp["cscr"]=='CREDIT'){
			      	cr = 'debit';
				    	dr = 'credit' ;
			      	transflag = TRANS_UPDATE(fyear, tbl, rd, db, typ, cr, dr, transid) ;

				      if (rp['mode'] == '2'){
				          P_R_DELETE(fyear, tbl, rd, db, typ, cr, transid);
				        }
				      else{
				          crdrtype = "credit";
				          prupdaterow = P_R_UPDATE(fyear, tbl, rd, db, typ, crdrtype, transid);
				      }
				      saleflag = SALE_UPDATE(fyear, tbl['SALE'], rd, db, transid, spid);
				      itemflag = PANEL_SALE_PROD(fyear, tbl['SL_ITM'], tbl, rd, db, spid, transid, main);
			      	return [false, "Sales CREDIT Update", "Done"];
			      }

		       	});
		    });
		} // customer update close final

	} // customer closed
	
}; // csfinalbill finally closed

function CASH_UPDATE_CHECK(fyear, tbl, recdic, conn, typ){
   var rp = recdic['pan'] ;
   var query = " SELECT transactionID, debit, credit, cashID FROM "+tbl['CASH']+" "+
    " WHERE ledgerID = "+rp['ledgid']+" AND transactionID = "+rp['transid']+" ";
   db.all(query, function (err, rows){ ////
		if (err){return [];}
		return rows;
	});  
}

function P_R_UPDATE_CHECK(fyear, tbl, recdic, conn, typ, crdrtype, transid){
 var rp = recdic['pan'] ;
 var query = "SELECT ledgerID as id, pay_rcpt_id as prid FROM "+tbl['P_R']+ " "+ 
 " WHERE ledgerID = "+rp['ledgid']+" AND trans_ID = "+transid+" ";
 db.all(query, function (err, rows){ ////
		if (err){return [];}
		return rows;
	});
}
         
function P_R_INSERT(fyear, tbl, recdic, conn, transid, typ, crdrtype){
  var rp = recdic['pan'] ;
  var query = "INSERT INTO "+tbl['P_R']+" (ledgerID, trans_ID, voucher_no, `type`, "+crdrtype+", fyear) " +
    " VALUES ("+rp['ledgid']+", '"+transid+"', '"+rp['billno']+"', '"+typ+"', '"+rp['gtot']+"', '"+fyear+"') ";
  db.all(query, function (err, rows){ ////
		if (err){return [];}
		return rows;
	});
}

function P_R_UPDATE(fyear, tbl, recdic, conn, typ, crdrtype, transid){
    rp = recdic['pan'] ;
    row = P_R_UPDATE_CHECK(fyear, tbl, recdic, conn, typ, crdrtype, transid);
    if (!row){
      prid = row['prid'];
      query = " UPDATE "+tbl['P_R']+" SET ledgerID='"+rp['ledgid']+"', voucher_no='"+rp['billno']+"', "+
          " "+crdrtype+"='"+rp['gtot']+"', trans_date='"+rp['dbbilldate']+"' WHERE trans_ID = "+transid+" "+
          " AND pay_rcpt_id = '"+prid+"' AND fyear = '"+fyear+"' ";         
      db.all(query, function (err, rows){ ////
			if (err){return [];}
			return rows;
		});
      } 
    else{
      return P_R_INSERT(fyear, tbl, recdic, conn, transid, typ, crdrtype);
    }
    return $row ;
}

function P_R_DELETE(fyear, tbl, recdic, conn, typ, crdrtype, transid){
    var row = P_R_UPDATE_CHECK(fyear, tbl, recdic, conn, typ, crdrtype, transid);
    if (row.length>0){
      query = "DELETE FROM "+tbl['P_R']+" WHERE pay_rcpt_id = "+row['prid']+" ";
      db.all(query, function (err, rows){ ////
   		if (err){return [true, "P_R_DELETE", err.message];}
   		return [false, "P_R_DELETE", "Done"];
		});
    } 
}

function TRANS_INSERT(fyear, tbl, recdic, conn, typ, crdrtype){
  /////### transaction_type =  1 >> FOR "CASH" IMPORTANT DO NOT IGNORE database field name = transaction_type !!!
  /////### transaction_type =  2 >> FOR "CREDIT" IMPORTANT DO NOT IGNORE database field name = transaction_type !!!
  /////### transaction_type =  7 >> FOR "BANK TRANSACTION" IMPORTANT DO NOT IGNORE database field name = transaction_type !!!
  rp = recdic['pan'] ;
  query = " INSERT INTO "+tbl['TRANS']+" (ledgerID, transaction_type, type, "+crdrtype+", fyear) "+
    " VALUES ("+rp['ledgid']+", '"+rp['dbcscr']+"', '"+typ+"', '"+rp['gtot']+"', '"+fyear+"') ";

  db.run(query, function(err){
    	if(err){return 0;} 
    	return this.lastID;
    });
  };

function TRANS_UPDATE(fyear, tbl, recdic, conn, typ, crdrtype, resetcol, transid){
  var rp = recdic['pan'] ;
  var query = "UPDATE "+tbl['TRANS']+" SET ledgerID='"+rp['ledgid']+"', transaction_type='"+rp['dbcscr']+"', `type`='"+typ+"',"+
          " "+crdrtype+"='"+rp['gtot']+"', "+resetcol+"='0.00' WHERE transactionID = "+transid+"  ";
  db.all(query, function (err, rows){ ////
   	if (err){return [true, "TRANS_UPDATE", err.message];}
   	return [false, "TRANS_UPDATE", "Done"];
	});
}

function CASH_INSERT(fyear, tbl, recdic, db, typ, crdrtype, transid){
  var rp = recdic['pan'] ; 
  var query = "INSERT INTO "+tbl['CASH']+" (ledgerID, transactionID, `type`, voucher_no, "+crdrtype+", `date`, `comment`) "+
   " VALUES ("+rp['ledgid']+", '"+transid+"', '"+typ+"', '"+rp['billno']+"', '"+rp['gtot']+"', '"+rp['dbbilldate']+"', "+
   " '"+rp['cmnt']+"') ";
  db.all(query, function (err, rows){ ////
   	if (err){return [true, "CASH_INSERT", err.message];}
   	return [false, "CASH_INSERT", "Done"];
	});
  };

function CASH_UPDATE(fyear, tbl, recdic, db, typ, crdrtype, cashid, transid){
  var rp = recdic['pan'] ;
  var query = "UPDATE "+tbl['CASH']+" SET ledgerID='"+rp['ledgid']+"', `type`='"+typ+"', voucher_no='"+rp['billno']+"', "+
        "  "+crdrtype+"='"+rp['gtot']+"', `date`='"+rp['dbbilldate']+"', `comment`='"+rp['cmnt']+"' "+
        "  WHERE transactionID = "+transid+" AND cashID = "+cashid+" ";
  db.all(query, function (err, rows){ ////
   	if (err){return [true, "CASH_UPDATE", err.message];}
   	return [false, "CASH_UPDATE", "Done"];
	});
  };

function CASH_DELETE(fyear, tbl, recdic, db, cashid, transid){
   var query = "DELETE FROM "+tbl['CASH']+" WHERE transactionID = "+transid+" AND cashID = "+cashid+" ";
   db.all(query, function (err, rows){ ////
   	if (err){return [true, "CASH_DELETE", err.message];}
   	return [false, "CASH_DELETE", "Done"];
	});
}

function SALE_INSERT(fyear, saletbl, recdic, db, transid){
  /*  1 == SALE INVOICE (Without GSTN/NON-Register Party)
      2 == TAX INVOICE  (HAS GSTN/Register Party)
      *** i_type == 9 Common for both SALE and PURCHASE DB Table
      8 == PURCHASE RETURN (* in DB transaction Table 
        this info will always count in GST Transaction)
      9 == SALES RETURN (* in DB transaction Table
        this info will always count in GST Transaction)
  */
  rp = recdic['pan'] ;
  query = "INSERT INTO "+saletbl+" (ledgerID, trans_ID, i_type, bill_no, bill_date, cash_cr," +
   " customerID, sale_amount, bill_as, comment, fyear) " +
   " VALUES ("+rp['ledgid']+", '"+transid+"', '"+rp['itype']+"', '"+rp['billno']+"', '"+rp['dbbilldate']+"', "+
   " "+rp['dbcscr']+", '"+rp['csid']+"', '"+rp['gtot']+"', '"+rp['billas']+"', '"+rp['cmnt']+"', '"+fyear+"') ";
  db.all(query, function (err, rows){ ////
      if (err){return [true, "SALE_INSERT", err.message];}
      return [false, "SALE_INSERT", "Done"];
   });
  };

function SALE_UPDATE(fyear, saletbl, recdic, db, transid, saleid){
  var rp = recdic['pan'] ;
  
  var query = "UPDATE "+saletbl+" SET ledgerID='"+rp['ledgid']+"', i_type='"+rp['itype']+"', bill_no='"+rp['billno']+"', "+
   " bill_date='"+rp['dbbilldate']+"', cash_cr='"+rp['dbcscr']+"', customerID='"+rp['csid']+"', "+
   " sale_amount='"+rp['gtot']+"', bill_as='"+rp['billas']+"', `comment`='"+rp['cmnt']+"' "+
   " WHERE trans_ID = '"+transid+"' AND salesID = '"+saleid+"' ";
  db.all(query, function (err, rows){ ////
      if (err){return [true, "SALE_UPDATE", err.message];}
      return [false, "SALE_UPDATE", "Done"];
   });
  
  };

function PANEL_AC_INSERT(fyear, tbl, recdic, db, typ, transid){
  var rp = recdic['pan'] ;
  ////###  typ =  1 >> FOR "PURC" IMPORTANT DO NOT IGNORE database field name = type !!!
  ////###  typ =  2 >> FOR "SALE" IMPORTANT DO NOT IGNORE database field name = type !!! 
  ////###  typ =  3 >> FOR "PYMT" IMPORTANT DO NOT IGNORE database field name = type !!!
  ////###  typ =  4 >> FOR "RCPT" IMPORTANT DO NOT IGNORE database field name = type !!!
  var acledgerid = recdic['ac']['acid1'];
  var query = "INSERT INTO "+tbl['AC_TRN']+" (ledgerID, trans_ID, type,  voucher_no, credit, trans_date) "+
          " VALUES ("+acledgerid+", '"+transid+"', '"+typ+"', '"+rp['billno']+"', '"+rp['gtot']+"', "+
          " '"+rp['dbbilldate']+"') ";
  if (recdic['pan']['acentries']){
        db.all(query, function (err, rows){ ////
      		if (err){return [true, "PANEL_AC_INSERT", err.message];}
      		return [false, "PANEL_AC_INSERT", "Done"];
   		});
    }
  return [false, "PANEL_AC_INSERT", "Done"];;
  };
         

function PANEL_SALE_PROD(fyear, tblname, tbl, recdic, db, saleid, transid, main){
  var grid = recdic['grid'] ;
  var ins_data = [];
  var upd_data = [];
  var stk_ins_data = [];
  var stk_upd_sale_data = [];
  var stk_upd_batch_data = [];
  var item_del_update = [];
  var err_items = [];
  var stkinfo = {'info':'multibat'};
  var [iadd, iupdt, sno] = [0, 0, -1];

  inforow = [] ;

  console.log(" find583  PANEL_SALE_PROD");   
  for (const [k, v] of Object.entries(grid)){
    //console.log("580 ->> ", v);

    if (v['proid'] !="" && v['qty'] !=""){
    	
    	
      //if (v['spitemid'] !=""){
      if(typeof v['spitemid'] !== "undefined"){
        upd_data = {'spid':saleid, 'amt':v['amt'].toFixed(2),'tdisamt':v['tdisamt'].toFixed(2),'supid':v['supid'], 
            'proid':v['proid'],'bat':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'],
            'srate_a':v['srate_a'],'dis':v['dis'],'mrp':v['mrp'],'tax1amt':v['cgst'],'pnet':v['pnet'],
            'spid':saleid,'spitemid':v['spitemid']};
        stkinfo = {'info':'Edited'};

        updatedqty = parseInt(v['tqty'])+parseInt(v['statictotstk']);
        
        stk_upd_sale_data = {'qty':updatedqty,'stockid':v['stockid'],};
        // First Update Stock Details Then Sales_item
        if (main){stkinfo = StkUpdate_Sale(tbl, stk_upd_sale_data, db, v['name'], main, infomsg="Sales Stock Updated");};
        inforow.push(stkinfo);
        
        siteminfo = Sale_Item_Table_Update(fyear, v['name'], tblname, upd_data, db, saleid, transid);
        inforow.push(siteminfo);
        
      }
      else{
        
        
        ins_data = {'spid':saleid, 'amt':v['amt'],'tdisamt':v['tdisamt'],'supid':v['supid'], 
            'proid':v['proid'],'bat':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'], 
            'srate_a':v['srate_a'],'dis':v['dis'],'mrp':v['mrp'],'tax1amt':v['cgst'],'pnet':v['pnet'],};

        console.log(" find616 -->>> ");   
        if (v.hasOwnProperty("staticbatinfo")){sbtinfo = v['staticbatinfo'];}
        else {sbtinfo = [];}
        
        
        if (sbtinfo.length > 0 && Array.isArray(sbtinfo) ) {
          if (v['multibat']){

            for (const [kk, vvv] of Object.entries(sbtinfo)){
              vv = vvv['bat']; // simplify variable length
              
              if (vv['givenqty'] > 0){
                stk_upd_sale_data = {'qty':vv['givenqty'],'stockid':vv['stockid'],};
                if (main){stkinfo = StkUpdate_Sale(tbl, stk_upd_sale_data, db, v['name'], main, infomsg="batach by batch fill");}
                
                else{
                  // Main loop qty required; re-assign stk_upd_sale_data variable;
                  stk_upd_sale_data = {'qty':v['tqty'],'stockid':vv['stockid'],};
                  if (main){stkinfo = StkUpdate_Sale(tbl, stk_upd_sale_data, db, v['name'], main, infomsg="multibat true but single batch update");}
                    }
                inforow.push(stkinfo);
              }
             
            }
            
          }
          
        }

        console.log(" find645 entered in v['multibat'], ", v['multibat']);
        // "multibat" would be true when user give qty more than particular batch exists
        // "multibat" "true" will autometically minus qty from next availabel batch, batch by batch
        // "multibat" "true" condition not prepaired yet; *** prepair this is important    
        if (v['multibat']=="false"){
          stk_upd_sale_data = {'qty':v['tqty'],'stockid':v['stockid'],};
          stkinfo = StkUpdate_Sale(tbl, stk_upd_sale_data, db, v['name'], main, infomsg="single batch update");
          inforow.push(stkinfo);
        }
        
        if (v['stockid'] ==""){
            stkinfo = {'info':'Stock Insert in Sales'};
            stk_ins_data = {'id':v['proid'],'proid':v['proid'],'bat':v['bat'],
             'qty':v['tqty'],'expdbf':v['expdbf'],};
            if (main){stkinfo = StkInsert(tbl, stk_ins_data, db, v['name'], main);};
            
          }
        
        siteminfo =Sale_Item_Table_Insert(fyear, v['name'], tblname, ins_data, db, saleid, transid);
        inforow.push(siteminfo);
        console.log(" find665 entered in Sale_Item_Table_Insert ");
      }
    }
  }
  
  return inforow;
}


function Sale_Item_Table_Insert(fyear, itemname, tblname, d, db, saleid, transid){
  var query = "INSERT INTO "+tblname+" (salesID, bill_no, bill_date, supplierID, productID, batch_no, qty, "+
    " bonus, sale_price, sale_price_a, discount, m_r_p, exp_date, rate_tax ) "+
    " VALUES ("+saleid+", '"+d['amt']+"', '"+d['tdisamt']+"', '"+d['supid']+"', '"+d['proid']+"', "+
    " '"+d['bat']+"', '"+d['qty']+"', '"+d['bonus']+"', '"+d['rate']+"', '"+d['srate_a']+"', '"+d['dis']+"', "+
    " '"+d['mrp']+"', '"+d['tax1amt']+"','"+d['pnet']+"' ) ";
  db.all(query, function (err, rows){ ////
      if (err){
      	console.log("Sale_Item_Table_Insert ", err, query);
      	return [true, tblname, err.message];
      }
      return [false, itemname, "Done"];
   });

  };
 
function Sale_Item_Table_Update(fyear, itemname, tbl, d, db, saleid, transid){
 query = "UPDATE "+tbl["SL_ITM"]+" SET bill_no='"+d['amt']+"', bill_date='"+d['tdisamt']+"', supplierID='"+d['supid']+"', "+
    " productID='"+d['proid']+"', batch_no='"+d['bat']+"', qty='"+d['qty']+"', "+
    " bonus='"+d['bonus']+"', sale_price='"+d['rate']+"', sale_price_a='"+d['srate_a']+"', "+
    " discount='"+d['dis']+"', m_r_p='"+d['mrp']+"', exp_date='"+d['tax1amt']+"', "+
    " rate_tax='"+d['pnet']+"' WHERE sale_itemID = "+d['spitemid']+" AND salesID = "+saleid+" ";
    
 db.all(query, function (err, rows){ ////
      if (err){return [true, itemname, err.message];}
      return [false, itemname, "Done"];
   }); 
 };


function StkUpdate_Sale(tbl, d, db, itemname, main, infomsg="N A"){
  if(main === false){return {'name':itemname, 'flag':false, 'info':"CHALLAN_SAVED", 'msg':"---",};}
  else{
    query = "UPDATE "+tbl['STK']+" SET qty=qty-'"+d['qty']+"' WHERE stockID = "+d['stockid']+" ";
    db.all(query, function (err, rows){
      if (err){
      	console.log("StkUpdate_Sale 692, ", err);
      	return [true, tbl['STK'], err.message];
      };
      return [false, tbl["STK"], "Done"];
   }); 
    }
}

function StkInsert(tbl, d, db, itemname, main){
  var row = {'name':"itemname", 'flag':false, 'info':"stock insert",'msg':"---",};
  if(main === false){return {'name':itemname, 'flag':false, 'info':"CHALLAN_SAVED",'msg':"---",};}
  else{
	  query = "INSERT INTO "+tbl['STK']+" (productID, batch_no, qty, exp_date) "+
	    " VALUES ('"+d['proid']+"', '"+d['bat']+"', '"+d['qty']+"', '"+d['expdbf']+"' ) ";
	  db.all(query, function (err, rows){
        if (err){return [true, tbl['STK'], err.message];};
        return [false, tbl["STK"], "Done"];
       });  
   }
}

function StkUpdate_Pur(tbl, d, db, itemname, main, infomsg="N A"){
  query = "UPDATE "+tbl['STK']+" SET qty=qty+'"+d['qty']+"' WHERE stockID = "+d['stockid']+" ";
  db.all(query, function (err, rows){
      if (err){return [true, tbl['STK'], err.message];}
      return [false, tbl["STK"], "Done"];
   }); 
}
    

function PURCHASE_INSERT(fyear, purctbl, recdic, db, transid){
   /* 1 == SALE INVOICE (Without GSTN/NON-Register Party)
      2 == TAX INVOICE  (HAS GSTN/Register Party)
      *** i_type == 9 Common for both SALE and PURCHASE DB Table
      8 == PURCHASE RETURN (* in DB transaction Table 
        this info will always count in GST Transaction)
      9 == SALES RETURN (* in DB transaction Table
        this info will always count in GST Transaction)
   */

  rp = recdic['pan'] ;
  query = "INSERT INTO "+purctbl+" (ledgerID, trans_ID, i_type, purchase_inv, bill_date, inv_date, cash_cr, "+
                                              "  supplierID, purchase_amount, bill_as, comment, fyear) "+
   " VALUES ("+rp['ledgid']+", '"+transid+"', '"+rp['itype']+"', '"+rp['billno']+"', '"+rp['dbbilldate']+"', '"+rp['dbinvdate']+"', "+
   " "+rp['dbcscr']+", '"+rp['csid']+"', '"+rp['gtot']+"', '"+rp['billas']+"', '"+rp['cmnt']+"', '"+fyear+"') ";
  db.run(query, function(err){
    	if(err){return 0;}
    	return this.lastID;
    });
  };

function PURCHASE_UPDATE(fyear, purtbl, recdic, db, transid, purchaseid){
  rp = recdic['pan'] ;
  
  query = "UPDATE "+purtbl+" SET ledgerID='"+rp['ledgid']+"', i_type='"+rp['itype']+"', purchase_inv='"+rp['billno']+"', " +
   " bill_date='"+rp['dbbilldate']+"', inv_date='"+rp['dbinvdate']+"', cash_cr='"+rp['dbcscr']+"', supplierID='"+rp['csid']+"', "+
   " purchase_amount='"+rp['gtot']+"', bill_as='"+rp['billas']+"', `comment`='"+rp['cmnt']+"' "
   " WHERE trans_ID = '"+transid+"' AND purchaseID = '"+purchaseid+"' ";
  db.run(query, function(err){
    	if(err){return [true, purtbl, err.message];}
    	return [false, this.lastID, "Done"];
    });
 
  };

function PANEL_PURCHASE_PROD(fyear, tblname, tbl, recdic, db, purcid, transid, main){
  var grid = recdic['grid'] ;
  var ins_data = [];
  var upd_data = [];
  var stk_ins_data = [];
  var stk_upd_sale_data = [];
  var stk_upd_batch_data = [];
  var item_del_update = [];
  var err_items = [];
  var [iadd, iupdt, sno] = [0, 0, -1];

  inforow = [] ;
  
  console.log(" find788 entered in PANEL_PURCHASE_PROD");  
  for (const [k, v] of Object.entries(grid)){
  	 if (v['proid'] !="" && v['qty'] !=""){
  	 	//console.log(" find791 ", v); 
  	 	if(typeof v['spitemid'] !== "undefined"){  // if (v['spitemid'] !=""){
        upd_data = {'spid':purcid, 'amt':v['amt'],'tdisamt':v['tdisamt'],'supid':v['supid'], 
            'proid':v['proid'],'bat':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'],'srate':v['srate'],
            'srate_a':v['srate_a'],'dis':v['dis'],'mrp':v['mrp'],'tax1amt':v['cgst'],'pnet':v['pnet'],'netrate':v['netrate'],
            'spid':purcid,'spitemid':v['spitemid']};
        stkinfo = {'info':'Edited'};
      
        updatedqty = parseInt(v['tqty'])+parseInt(v['statictotstk']);
        stk_upd_pur_data = {'qty':updatedqty,'stockid':v['stockid'],};
        // First Update Stock Details Then Sales_item
        if (main){stkinfo = StkUpdate_Sale(tbl, stk_upd_pur_data, db, v['name'], main, infomsg="Purchase Stock Updated");};
        inforow.push(stkinfo);
        
        siteminfo = Purchase_Item_Table_Update(fyear, v['name'], tbl, upd_data, db, purcid, transid);
        //inforow.push(siteminfo);;
      }
      else{
        console.log(" find809 else"); 	
        ins_data = {'spid':purcid, 'amt':v['amt'],'tdisamt':v['tdisamt'],'supid':v['supid'], 
            'proid':v['proid'],'bat':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'], 'srate':v['srate'],
            'srate_a':v['srate_a'],'dis':v['dis'],'mrp':v['mrp'],'tax1amt':v['cgst'],'pnet':v['pnet'],'netrate':v['netrate'],};

        // if 'stockid' available then stock will update in qty using stockid otherwise insert new row in stock table;
        if (v['stockid'] ==""){
            if (main){
              stkinfo = {'info':'Stock Insert in Sales'};
              stk_ins_data = {'id':v['proid'],'proid':v['proid'],'bat':v['bat'],
             'qty':v['tqty'],'expdbf':v['expdbf'],};
              stkinfo = StkInsert(tbl, stk_ins_data, db, v['name'], main);
              inforow.push(stkinfo);
              console.log(" find821 entered in StkInsert Stock Inserted");  
              };
            
          }
        else{
          if (main){
                stk_upd_pur_data = {'qty':v['tqty'],'stockid':v['stockid'],};
                stkinfo = StkUpdate_Pur(tbl, stk_upd_pur_data, db, v['name'], main);
                inforow.push(stkinfo);
                console.log(" find830 entered in StkUpdate_Pur Stock Updated");
              };
        }
        siteminfo =Purchase_Item_Table_Insert(fyear, v['name'], tbl, ins_data, db, purcid, transid);
        inforow.push(siteminfo);;
        console.log(" find835 entered in Purchase_Item_Table_Insert ");
      }
    }
  }
  
  return inforow;
}


function Purchase_Item_Table_Insert(fyear, itemname, tbl, d, db, purcid, transid){
  // netrate will store in purchase_inv column
  // tdisamt will store in bill_date column
  // cgst amount will store in exp_date column
  // amount will store in sale_price_b column
  // sale_price_b === 'amt' ;
  query = "INSERT INTO "+tbl["PR_ITM"]+" (purchaseID, purchase_inv, bill_date, supplierID, productID, batch_no, qty, "+ 
    " bonus, purchase_price, sale_price, sale_price_a, sale_price_b, discount, m_r_p, exp_date ) "+
    " VALUES ("+purcid+", '"+d['netrate']+"', '"+d['tdisamt']+"', '"+d['supid']+"', '"+d['proid']+"', "+
    " '"+d["bat"]+"', '"+d['qty']+"', '"+d['bonus']+"', '"+d['rate']+"', '"+d['srate']+"', '"+d['srate_a']+"', '"+d['amt']+"', "+ 
    " '"+d['dis']+"', '"+d['mrp']+"', '"+d['tax1amt']+"' ) ";
    
  db.all(query, function(err, rows){
    	if(err){
    		return [true, tbl["PR_ITM"], err.message];
    		}
    		return [false, tbl["PR_ITM"], "Done !"]; 
    });
    
  }
 
 function Purchase_Item_Table_Update(fyear, itemname, tbl, d, db, purcid, transid){
  // netrate will store in purchase_inv column
  // tdisamt will store in bill_date column
  // cgst amount will store in exp_date column
  // amount will store in sale_price_b column
  
  query = "UPDATE "+tbl["PR_ITM"]+" SET purchase_inv='"+d['netrate']+"', bill_date='"+d['tdisamt']+"', supplierID='"+d['supid']+"', "+
    " productID='"+d['proid']+"', batch_no='"+d['bat']+"', qty='"+d['qty']+"', "+
    " bonus='"+d['bonus']+"', purchase_price='"+d['rate']+"', sale_price='"+d['srate']+"', sale_price_a='"+d['srate_a']+"', "+
    " sale_price_b='"+d['amt']+"', discount='"+d['dis']+"', m_r_p='"+d['mrp']+"', exp_date='"+d['tax1amt']+"' "+
    " WHERE purchase_itemID = "+d['spitemid']+" AND purchaseID = "+purcid+" ";
  db.all(query, function(err, rows){
    	if(err){
    		return [true, tbl["PR_ITM"], err.message];
    		}
    		return [false, tbl["PR_ITM"], "Done !"]; 
    });
 };


var SPINFO = function(db, ledgid, transid, fmd, tod, fyear, cb) {
	let tabpur = "purchase";
	let tabcs = "suppliers"	;
	let tabsale = "sales";
	let tabitem = "products";
	let tabpit = "purchase_item";
	let tabsit = "sales_item" ;
	let tabac = "account" ;
	let tabactr = "ac_trans" ;
	let dtformat = "%b/%y";
	let stk = "stock";
	
    db.all("SELECT purc.purchaseID as spid, purc.ledgerID as ledgid, purc.trans_ID as transid, "+
	" purc.purchase_inv as billno , strftime('%d/%m/%Y',purc.bill_date) as billdate, strftime('%d/%m/%Y',purc.inv_date) as invdate, "+
	" purc.cash_cr as dbcscr, purc.supplierID as csid, purc.bill_as as billas, purc.comment as cmnt, purc.fyear, " +
	" sup.supplier_name as name, sup.supplier_address as add1, sup.supplier_city as add2, " +
	" sup.supplier_state as stcode, sup.drug_licence_no as regn, " +
	" sup.tin_no as gstn, sup.mode as mode, sup.mobile as mobile, purc.in_auto_no as freightnet " +
	" FROM "+tabpur+" as purc LEFT JOIN "+tabcs+" as sup ON " +
	" purc.ledgerID = sup.ledgerID WHERE purc.ledgerID = "+ledgid+" AND " +
	" purc.trans_ID = "+transid+" AND purc.fyear = "+fyear+" ", 
    
	function (err, rows, ) {
		let itemqry = " SELECT pit.purchase_itemID as spiid, "+
        " prod.product_name as name, prod.unit, pit.batch_no as batchno, "+
        " pit.m_r_p as mrp, ROUND(pit.qty) as qty, pit.bonus, pit.purchase_price as rate, "+
        " pit.sale_price as srate, pit.sale_price_a as rate_a, prod.cst as tax, pit.discount as dis, "+
        " pit.purchase_inv as netamt, pit.bill_date as tdisamt,  pit.exp_date as cgst, pit.exp_date as sgst, pit.exp_date*2 as ttaxamt, "+
        " pit.productID as itemid, pit.sale_price_b as amt,  (pit.sale_price_b - pit.bill_date) as amttot, "+
        " COALESCE((SELECT (COALESCE(strftime('%b/%y',exp_date), '')|| '_' || qty || '_' || stockID) as stkdt FROM "+stk+" WHERE productID = pit.productID "+
        " AND batch_no = pit.batch_no LIMIT 1), '_0_0') as sstk, prod.pack, prod.vat as tax1, prod.sat as tax2, prod.hsn_code as hsn   "+
        " FROM "+tabpur+" as purc LEFT JOIN "+tabpit+" as pit ON purc.purchaseID = pit.purchaseID "+
        " LEFT JOIN "+tabitem+" as prod ON prod.productID = pit.productID "+
        " WHERE purc.ledgerID = "+ledgid+" AND "+
        " purc.trans_ID = "+transid+" ORDER BY pit.purchase_itemID ASC ";

		db.all(itemqry, 
     function(err, itemrows, ){
        db.all(" SELECT acnt.account_name as name, ac_trn.credit as cr, ac_trn.ledgerID as ledgid, 1, "+
        " ac_trn.ac_trans_id as actrid FROM "+tabac+" as acnt "+
        " LEFT JOIN "+tabactr+" as ac_trn ON acnt.ledgerID = ac_trn.ledgerID "+
        " WHERE ac_trn.ledgerID = "+ledgid+" AND ac_trn.trans_ID = "+transid+" ",
        	function (err, acrows, ) {
       			cb(err, rows, itemrows, acrows);
       			});
       		});
    	//db.end();
    	// done: call callback with results 
  		});
	};

var CPINFO = function(db, ledgid, transid, fmd, tod, fyear, cb) {
	let tabpur = "purchase";
	let tabcs = "customer"	;
	let tabsale = "sales";
	let tabitem = "products";
	let tabpit = "purchase_item";
	let tabsit = "sales_item" ;
	let tabac = "account" ;
	let tabactr = "ac_trans" ;
	let dtformat = "%b/%y";
	let stk = "stock";

    db.all("SELECT spt.salesID as spid, spt.ledgerID as ledgid, spt.trans_ID as transid, "+
	" spt.bill_no as billno, strftime('%d/%m/%Y',spt.bill_date) as billdate,  strftime('%d/%m/%Y',spt.bill_date) as invdate, "+
	" spt.cash_cr as dbcscr, spt.customerID as csid, spt.bill_as as billas, spt.comment as cmnt, spt.fyear, " +
	" tcs.customer_name as name, tcs.customer_address as add1, tcs.customer_city as add2, " +
	" tcs.customer_state as stcode, tcs.drug_licence_no as regn, " +
	" tcs.tin_no as gstn, tcs.mode, tcs.mobile " +
	" FROM "+tabsale+" as spt LEFT JOIN "+tabcs+" as tcs ON " +
	" spt.ledgerID = tcs.ledgerID WHERE spt.ledgerID = "+ledgid+" AND " +
	" spt.trans_ID = "+transid+" AND spt.fyear = "+fyear+" ", 
	function (err, rows, ) {
		let itemqry = " SELECT spit.sale_itemID as spiid, "+
        " prod.product_name as name, prod.unit, spit.batch_no as batchno, "+
        " ROUND(spit.qty) as qty, spit.bonus as bonus, spit.sale_price as rate, "+
        " spit.sale_price_a as rate_a, prod.cst as tax, spit.discount as dis, "+
        " spit.bill_no as amt, (spit.bill_no-spit.bill_date) as amttot, spit.m_r_p as mrp, "+
        " ROUND((spit.bill_no-spit.bill_date)+(2*spit.exp_date),2) as netamt, spit.bill_date as tdisamt, "+
        " spit.exp_date as cgst, spit.exp_date as sgst, spit.exp_date*2 as ttaxamt, spit.productID as itemid,  "+
        " prod.bonus as prate, spit.supplierID as csid, "+
        " COALESCE((SELECT (COALESCE(strftime('%b/%y',exp_date), '')|| '_' || qty || '_' || stockID) as stkdt FROM "+stk+" WHERE productID = spit.productID "+
        " AND batch_no = spit.batch_no LIMIT 1), '_0_0') as sstk, prod.pack, prod.vat as tax1, prod.sat as tax2, prod.hsn_code as hsn "+
        " FROM "+tabsale+" as spt LEFT JOIN "+tabsit+" as spit ON spt.salesID = spit.salesID "+
        " LEFT JOIN "+tabitem+" as prod ON prod.productID = spit.productID "+
        " WHERE spt.ledgerID = "+ledgid+" AND "+
        " spt.trans_ID = "+transid+" ORDER BY spit.sale_itemID ASC ";
      
		db.all(itemqry, 
     function(err, itemrows, ){
     	
        db.all("SELECT acnt.account_name as name, ac_trn.credit as cr, ac_trn.ledgerID as ledgid, 2, "+
        " ac_trn.ac_trans_id as actrid FROM "+tabac+" as acnt "+
        " LEFT JOIN "+tabactr+" as ac_trn ON acnt.ledgerID = ac_trn.ledgerID "+
        " WHERE ac_trn.ledgerID = "+ledgid+" AND ac_trn.trans_ID = "+transid+" ",
        	function (err, acrows, ) {
        		   
       			cb(err, rows, itemrows, acrows);
       			});

       		});
    	//db.end();
    	// done: call callback with results 
  		});
	};
module.exports.add_to_db = add_to_db;
module.exports.csfind_by_name = csfind_by_name; 
module.exports.csfinalbill = csfinalbill;
module.exports.SPINFO = SPINFO ;
module.exports.CPINFO = CPINFO ;

