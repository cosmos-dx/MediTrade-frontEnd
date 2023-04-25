const { ObjectId } = require("mongodb");

const ObjectID = require('mongodb').ObjectId; 

function getUniqueId(){
    var dtt = new Date();
    var myyy = (dtt.getYear()-100).toString()
    var mymm = (dtt.getMonth()+1).toString();
    var mydd = (dtt.getDate()).toString();
    var myhh = dtt.getHours().toString();
    var mymi = dtt.getMinutes().toString();
    var myse = dtt.getSeconds().toString();

    if (mydd < 10){mydd = '0' + mydd};
    if (mymm < 10){mymm = '0' + mymm};
    if (mymi < 10){mymi = '0' + mymi};
    if (myse < 10){myse = '0' + myse};
    if (myhh < 10){myhh = '0' + myhh};
    return [mydd,mymm,myyy,myhh,mymi,myse].join('');  
  }
  function ObjectIdCheck(inputid){ 
	try{
	  var noid = new ObjectId(inputid.toString()); // sample of string _id //'64379b11678cb10c923e890f';
	  return noid;
	}catch(err){
	  return false;
	}
  };

  function DistinctQryResults(ydb, text, field, limit, sort){
	//var setmatch = {"$match": { "igroup" : new RegExp("^" +textlike)} }; 
	  var match = {"$match":{}}; 
	  match["$match"][field]=new RegExp("^" +text); // fill on key field
	  match["$match"][" "+field+" "]={$ne:""};	    // fill on key field with extra space otherwise this will overrite previous;
	  var dstf = "$"+field; // dstf = Distinct Field;
	  var xx = `${field}`;
	  var group = JSON.parse(`{"$group":{"_id":null, "${field}":{"$addToSet":"$${field}"}}}`);
	  var agr = [group,{$unwind:dstf},match,{$limit:limit},{$sort:{"_id":sort}},]; 
	  var data = [];
	  return ydb.aggregate(agr).toArray();
	  }
	
	function CisDataReturn(db, table, colname, method, text, limit,){
		data = []
		const findResult = db["cust"].find({"name":new RegExp("^" +text, "i")}).limit(limit).toArray();
		findResult.then(function(result){
			if(method==="GET"){ 
				for(var i=0; i<result.length; i++){data.push(result[i].name);}
				  callback(data);
			}else{
				callback(result);
			}  
		});
	};



 
	function add_to_db(db, idf, text, column, mode, limit, callback){
		var data = []; 
		
		var qrystr = "";
		var actype = 4; // profite-loss ; 3=Expense; 2:Liability; 1:Assests Account Types 
		var sp_id = 1; // 1 for suppliers and 2 for customers
	
		if(mode==="search"){
			if(idf==="compsupsearch"){
				console.log("text ------------------>> ",text);
				const findResult1 = db["sup"].find({"ledgid": text[0]}).limit(1).toArray();
				if(text[1].length > 5){
				  var oid = new ObjectId(text[1]);
				  var findResult2 = db["sup"].find({"_id":oid}).limit(1).toArray();
				}else{ 
				  var findResult2 = db["sup"].find({"supid": text[1]}).limit(1).toArray();
				}
	
				findResult2.then(function(result){
				  data.push({"name":result[0]["name"]})
				  findResult1.then(function(result){
					console.log("this",result);
					if(typeof(result) !== "undefined"){
						data.push({"name":result[0]["name"]})
					}
					callback(data); 
				  });
				});
				return true;
				}
	
			if(idf==="hsn"){
			  DistinctQryResults(db["itm"], text.toUpperCase(), "hsn", 5, -1).then(function(result){
				for(var i=0; i<result.length; i++){data.push({"name":result[i]["hsn"]})}
				callback(data); 	
			  });
			  return true;
				
			}
			if(idf==="comp"){
			  const findResult = db["sup"].find({"name":new RegExp("^" +text.toUpperCase(), "i"), "mode":{$eq:6}, }).sort({"_id":-1}).limit(5).toArray();
			  findResult.then(function(result){
				  callback(result) 
				});
			  return true;	
			}
			if(idf==="sup"){
			  const findResult = db["sup"].find({"name":new RegExp("^" +text.toUpperCase(), "i"), "mode":{$ne:6}, }).sort({"_id":-1}).limit(5).toArray();
			  findResult.then(function(result){
				  callback(result) 
				});
			  return true;
			}
			if(idf==="supplier_area"){
			  DistinctQryResults(db["sup"], text.toUpperCase(), "area", 5, -1).then(function(result){
				for(var i=0; i<result.length; i++){data.push({"name":result[i]["area"]})}
				callback(data); 	
			  });
			  return true;
			}
			if(idf==="customer_area"){
			  DistinctQryResults(db["cust"], text.toUpperCase(), "area", 5, -1).then(function(result){
				for(var i=0; i<result.length; i++){data.push({"name":result[i]["area"]})}
				callback(data); 	
			  });
			  return true;
				
			}
	
			if(idf==="items_igroup"){
			  DistinctQryResults(db["itm"], text.toUpperCase(), "igroup", 5, -1).then(function(result){
				for(var i=0; i<result.length; i++){data.push({"name":result[i]["igroup"]})}
				callback(data); 	
			  });
			  return true;
			}
			
			if(idf==="items_irack"){
				DistinctQryResults(db["itm"], text.toUpperCase(), "irack", 5, -1).then(function(result){
				for(var i=0; i<result.length; i++){data.push({"name":result[i]["irack"]})}
				callback(data); 	
			  });
			  return true;
			}
			
			if(idf==="ITEMDBSEARCH"){}	
			if (idf==="items"){
				var textlike = text.toUpperCase() ;
				const findResult = db["itm"].find({"name":new RegExp("^" +textlike, "i")}).limit(5).toArray();
				findResult.then(function(result){
					callback(result); 
				  });
				return true;
				};
	   
			if (idf==="customer"){
				var textlike = text.toUpperCase() ;
				const findResult = db["cust"].find({"name":new RegExp("^" +textlike, "i")}).limit(5).toArray();
				findResult.then(function(result){
					callback(result); 
				  });
				return true;
				
				};
			if (idf==="supplier"){
				 var textlike = text.toUpperCase() ;
				 const findResult = db["sup"].find({"name":new RegExp("^" +textlike, "i")}).limit(5).toArray();
				 findResult.then(function(result){
					callback(result); 
				  });
				return true;
				};
			if(qrystr===""){
				 callback([">>>*** Wrong Methods Check Again !"]);
				 return true;
				 }
		}; 
	
		if(mode==="save"){
			if (idf==="items"){
				itemid = new ObjectID().toString();
				var pnet = parseFloat(parseFloat(text['prate'])*((100+(12))/100)).toFixed(2);
				var insertdict = {"itemid":itemid, "name": text['name'],"pack": text['pack'],"unit": text['unit'],"netrate": pnet,
					"prate": text['prate'],"srate": text['srate'],"cgst": text['cgst'],"sgst": text['sgst'],"gst": text['igst'],
					"dis": "0.00","mrp": text['mrp'],"hsn": text['hsn'],"igroup": text['igroup'],
					"irack": text['irack'],"compid": text['compid'],"supid": text['supid'],};
				
				//var pnet = 0; // purchase netrate  
				if(text['addcomp']){
					var compmode = 6;
					sp_id = "6";   // 1 for suppliers and 2 for customers and 6 is reserved for companies
					actype = "4";  // profite-loss
					var insertledgD = {"ac_type":actype, "sale_pur_ID":sp_id};
	
					db["ledg"].insertOne(insertledgD).then(function(getledger){
						//var lastidval = parseInt(getledger.insertedId.toString().valueOf(), 13);
						var compledgid = getledger.insertedId.toString();
						// supid of customer/supplier/account is no longer required _id ==>> will act as supid  
						var compdict = {"supid": 1,"ledgid": compledgid,"name": text['compname'],"add1":"",
						"add2":"","add3":"","pincode":"","area":"","mobile":"","email":"","ophone":"","pan":"",
						"bal":"","regn":"","gstn":"","cmnt":"","mode":compmode};
						insertdict["compid"]=compledgid;
						db["sup"].insertOne(compdict).then(function(result){
							console.log(">>>> NEW COMAPNY ADDED WHILE CREATING NEW ITEM (qrystore 150)<<<< ")
	
							db["itm"].insertOne(insertdict).then(function(result){
								callback([insertdict["name"]]);
							});
						});
					  });
					}else{
						db["itm"].insertOne(insertdict).then(function(result){
							callback([insertdict["name"]]);
						});
					} 
				return true;
				
			}
			if (idf==="customer"){
				sp_id = "2";   // 1 for suppliers and 2 for customers 
				actype = "4";  // profite-loss
				var supmode = "2"; // 6 for company
				var insertledgD = {"ac_type":actype, "sale_pur_ID":sp_id};
				
				db["ledg"].insertOne(insertledgD).then(function(getledger){
					//var lastidval = parseInt(getledger.insertedId.toString().valueOf(), 13);
					var lastidval = getledger.insertedId.toString();
	
					// supid of customer/supplier/account is no longer required _id ==>> will act as supid  
					var insertdict = {"supid": 1,"ledgid": lastidval,"name": text['name'],"add1": text['add1'],
					"add2": text['add2'],"add3": text['stcode'],"pincode": text['pincode'],"area": text['area'],
					"mobile": text['phone'],"email": text['email'],"ophone": text['offphone'],"pan": text['pan'],
					"bal": text['obal'],"regn": text['regn'],"gstn": text['gstn'],"cmnt": text['cmnt'],"mode": text['mode']};
	
					db["cust"].insertOne(insertdict).then(function(result){
						callback([insertdict["name"]]);
					});
				  });
				return true;
			}
			if (idf==="supplier"){
				sp_id = "1";   // 1 for suppliers and 2 for customers 
				actype = "4";  // profite-loss
				qrystr0 = "INSERT INTO ledger(ac_type, sale_pur_ID) VALUES ("+actype+", "+sp_id+") ";
				var supmode = "2"; // 6 for company
				var insertledgD = {"ac_type":actype, "sale_pur_ID":sp_id};
	
				db["ledg"].insertOne(insertledgD).then(function(getledger){
					//var lastidval = parseInt(getledger.insertedId.toString().valueOf(), 13);
					var lastidval = getledger.insertedId.toString();
	
					// supid of customer/supplier/account is no longer required _id ==>> will act as supid  
					var insertdict = {"supid": 1,"ledgid": lastidval,"name": text['name'],"add1": text['add1'],
					"add2": text['add2'],"add3": text['stcode'],"pincode": text['pincode'],"area": text['area'],
					"mobile": text['phone'],"email": text['email'],"ophone": text['offphone'],"pan": text['pan'],
					"bal": text['obal'],"regn": text['regn'],"gstn": text['gstn'],"cmnt": text['cmnt'],"mode": text['mode']};
	
					db["sup"].insertOne(insertdict).then(function(result){
						callback([insertdict["name"]]);
					});
	 
				  });
				return true;
	
			}
		};
	
		if(mode==="update"){
			if (idf==="items"){
				var oid = new ObjectId(text["_id"]);
				var myquery = {"_id": oid };
				delete text["_id"];  // CANNOT Update Unique ID _id, so deleting from text object;
				var pnet = parseFloat(parseFloat(text['prate'])*((100+(12))/100)).toFixed(2);
				text['netrate'] = pnet;
				var updateval = { $set: text};
				  db["itm"].updateOne(myquery, updateval).then(function(result){
					  callback({"name":text["name"]});
				  })
				return true;
			}
	
			if (idf==="customer"){
				var oid = new ObjectId(text["_id"]);
				var myquery = {"_id": oid };
				delete text["_id"];  // CANNOT Update Unique ID _id, so deleting from text object;
				var updateval = { $set: text};
				  db["cust"].updateOne(myquery, updateval).then(function(result){
					  callback({"name":text["name"]});
				  })
				return true;
			}
			if (idf==="supplier"){
				var oid = new ObjectId(text["_id"]);
				var myquery = {"_id": oid };
				delete text["_id"];  // CANNOT Update Unique ID _id, so deleting from text object;
				var updateval = { $set: text};
				  db["sup"].updateOne(myquery, updateval).then(function(result){
					  callback({"name":text["name"]});
				  })
				return true;
			}
			
		};
		if(mode==="delete"){
			
		};
	};
function spsearch_With_Ledgid(db, cs, sp, text, frm, tod, itype, billas, callback){
	var newitype = itype.replace(/["'\(|\)]/g,'').split(",");
	var newbillas = billas.replace(/["'\(|\)]/g,'').split(",");

	var itypeary = [];
	for(var i=0; i<newitype.length; i++){itypeary.push(newitype[i])};

	var billasary = [];
	for(var i=0; i<newbillas.length; i++){billasary.push(newbillas[i])};
	console.log("entered", text);
	db[cs].find({"name":text.toUpperCase().trim()}).limit(1).toArray().then(function(partydetails){
	  var ledgid = partydetails[0]["ledgid"];
	  console.log("foinding",ledgid, frm, tod, itypeary, billasary);
	  const findResultSale = db[sp].find({
	  "ledgid":ledgid,
	  "billdate":{"$gt":frm, "$lt":tod,},
	  "itype":{"$in":itypeary}, "billas":{"$in":billasary} }).toArray();
		findResultSale.then(function(result){
		  result["partyinfo"]=partydetails[0];
		
		  for(var i=0; i<result.length; i++){
		      result[i]["name"]=partydetails[0]["name"];
		      result[i]["invdate"]=result[i]["billdate"];
		  	} 
		  callback(result);
		})
	});

}

function spsearch_WithOut_Ledgid(db, sp, cs, frm, tod, callback){
  db[sp].find({"billdate":{"$gt":frm, "$lt":tod,},}).toArray().then(function(salerow){
    let maxlen = salerow.length
    for(let i=0; i<salerow.length; i++){
      
      db[cs].find({"ledgid":salerow[i]["ledgid"],}).toArray().then(function(partyrow){
        var setdict = {"billno":salerow[i]["billno"], "billdate":salerow[i]["billdate"],
          "billas":salerow[i]["billas"], 
          "cscr":salerow[i]["cscr"], "amount":salerow[i]["amount"], 
          "spid":salerow[i]["spid"], "transid":salerow[i]["transid"], 
          "csid":salerow[i]["csid"], "ledgid":salerow[i]["ledgid"], "itype":salerow[i]["itype"],
          "fyear":salerow[i]["fyear"],"cmnt":salerow[i]["cmnt"], 
          "name":partyrow[0]["name"], "add1":partyrow[0]["add1"],
          "sprow":salerow[i], "partyrow":partyrow[0],
          "maxlen":maxlen, "cidx":i, 
        }
        callback(setdict, i)
      })
      
    }
    
  })
}

function csfind_by_name(db, method, idf, text, column, limit, callback){
	var data = []; 
	var qrystr = "";
	
	if (idf==="items"){
		
		
		const findResult = db["itm"].find({"name":new RegExp("^" +text, "i")}).limit(5).toArray();  
		findResult.then(function(result){
			if(method==="GET"){ 
				for(var i=0; i<result.length; i++){data.push(result[i].name);}
			  	callback(data);
			}else{
				if (result.length > 0){
					var checkitemid = ObjectIdCheck(result[0].itemid);
					if(checkitemid){
					  var itemid = checkitemid;
					}else{
					  var itemid = result[0].itemid;  
					}
					
					// Force on Item Selection [POST Method, will fetch stock too]
					
					// converted item id to string
					itemid = itemid.toString();

					const findResult = db["stk"].find({"itemid":itemid}).sort({'itemid' : -1}).limit(1).toArray(); // remove limit for multiple batch
					findResult.then(function(stkresult){
						result[0]["stockarray"] = stkresult;
						
						callback(result); 
						});
				}
			}

		});
		return true;
		
	};
   
   if (idf==="stock"){
	   const findResult = db["stk"].find({"itemid":text}).sort({'itemid' : -1}).limit(limit).toArray();
	   findResult.then(function(result){
		   callback(result); 
		 });
	   return true;

	};

	if (idf==="customer"){
	
		const findResult = db["cust"].find({"name":new RegExp("^" +text)}).limit(5).toArray();
		findResult.then(function(result){
			if(method==="GET"){ 
				for(var i=0; i<result.length; i++){data.push(result[i].name);}
			  	callback(data);
			}else{
				callback(result);
			}  
		});
		return true;
	};
	if (idf==="supplier"){
		const findResult = db["sup"].find({"name":new RegExp("^" +text, "i"), "mode":{"$ne":6}}).limit(5).toArray();
		findResult.then(function(result){
			if(method==="GET"){ 
				for(var i=0; i<result.length; i++){data.push(result[i].name);}
			  	callback(data);
			}else{
				callback(result);
			}  
		});
		return true;
	};
   
	if (idf==="sale"){
		var frm = limit["frm"];
		var tod = limit["tod"];
		var itype = limit["itype"];
		var billas = limit["billas"];
		if (text.trim()){	
			spsearch_With_Ledgid(db, "cust", "sale", text, frm, tod, itype, billas, callback);
		}else{
			spsearch_WithOut_Ledgid(db, "sale", "cust", frm, tod, function(spsearchdata, idx){
				data.push(spsearchdata)
			    if (data.length === spsearchdata.maxlen){callback(data);}
			})
		}
		return true;
	};

	if (idf==="purchase"){
		var frm = limit["frm"];
		var tod = limit["tod"];
		var itype = limit["itype"];
		var billas = limit["billas"];
		if (text.trim()){	
			spsearch_With_Ledgid(db, "sup", "pur", text, frm, tod, itype, billas, callback);
		}else{
			spsearch_WithOut_Ledgid(db, "pur", "sup", frm, tod, function(spsearchdata, idx){
				data.push(spsearchdata)
			    if (data.length === spsearchdata.maxlen){callback(data);}
			})
		}
		return true;
		
	};

   if (idf==="billnoset"){
   	var fy = parseInt(limit["fyear"]);
   	var bas = limit["billas"].toUpperCase();
   	var bhd = limit["billhead"].toUpperCase();
    // project attribute return field by name of field and 0 = off; 1= on 1==> will return given field only with _id;
    // project attribute second argumentt "name":"$billno" act as alias ==> ( SELECT billno as name FROM SALES .... ) in SQL;

	const findResult = db["sale"].find({"fyear":fy, "billas":bas, "billno":new RegExp("^"+bhd),
		}).project({"billno":1, "name":"$billno"}).sort({"_id":-1}).limit(1).toArray();
	findResult.then(function(result){
		callback(result);
	});
	return true;
   };

	if(qrystr===""){
	 	callback([">>>*** Wrong Methods Check Again !"]);
	 	return true;
	 } 
 	
 	}

function csfinalbill(db, idf, rd, mode, main, callback){
	var rp = rd["pan"];
	var cscr = rp["cscr"];
	var fyear = parseInt(rp["fyear"]);
	var lastID;
	var grid = rd["grid"];
	var rgrid = rd["grid"];
	var rac = rd["ac"];
	//var main = false;
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
			    var lastID;
			    if (rp["cscr"]==" m ")
				{
					
			    	main = false;
			    	var transid = "0";
			    	var saleid = '0';
			    	var itemflag = '00';

					var insert_purchase = {
						"ledgid" : rp['ledgid'], 
						"transid": transid, 
						"itype": rp['itype'], 
						"billno" : rp['billno'],
						"billdate": rp['dbbilldate'], 
						"cscr": rp['dbcscr'], 
						"csid" : rp['csid'], 
						"amount": rp['gtot'], 
						"billas": rp['billas'],
		     			"comment": rp['cmnt'], 
						"fyear": fyear, 
					}
					


			    }

				crdrtype = ""
				crdrtypealt = ""
			    if (cscr=="CASH"){
					crdrtype = "debit";
					crdrtypealt = "credit";
				};
			    if (cscr=="CREDIT"){
					crdrtype = "credit";
					crdrtypealt = "debit";
				};

			    //console.log("raam raam", crdrtype, crdrtypealt);
				transid = new ObjectId().toString();
				//console.log(transid);
				var insert_mytrans = {
					"transid" : transid,
					"ledgid" : rp['ledgid'], 
					"trtype": rp['dbcscr'], 
					"type": typ, 
					[crdrtype] : rp['gtot'],
					[crdrtypealt]: "0",
					"fyear": fyear, 
					
				}
			

				db["trns"].insertOne(insert_mytrans).then(function(result){
					//var lastidval = result.insertedId.toString();
					//transid = lastidval
					cashid = new ObjectId().toString();
					db_choosed = db["cash"]
					var cashquery = {
						"cashid" : cashid,
						"ledgid" :  rp['ledgid'],
						"transid" : transid,
						"type" : typ,
						"billno": rp['billno'],
						[crdrtype] : rp['gtot'],
						[crdrtypealt]: 0,
						'date' : rp['dbbilldate'],
						'comment' : rp['cmnt']
					}
					if(cscr == 'CREDIT'){
						if (rp['mode'] == 2)
						{
							prid = new ObjectId().toString();
							crdrtype = "debit";
							db_choosed = db["pr"]
							cashquery = {
								"prid" : prid,
								"ledgid" :  rp['ledgid'],
								"transid" : transid,
								"vautono" : "dont know",
								"type" : typ,
								"cash" :  rp['gtot'],
								"billno": rp['billno'],
								crdrtype : "0",
								'date' : rp['dbbilldate'],
								"credit" : 0, 
								"fyear" : fyear
							}

						}
					}
					db_choosed.insertOne(cashquery).then(function(cscrinsert){
						//var cscrinsertid = cscrinsert.insertedId.toString();
						spid = new ObjectId().toString();
						var insert_purchase = {
							"spid" : spid,
							"ledgid" :  rp['ledgid'],
							"transid" : transid,
							"billautono": "don't know",
							"itype" : rp['itype'],
							"billno": rp['billno'],
							"billdate": rp['dbbilldate'],
							"invdate" : rp['dbinvdate'],
							"cscr" : rp['dbcscr'],
							"csid" : rp['csid'],
							"amount" : rp['gtot'],
							"billas" : rp['billas'],
							"cmnt" : rp['cmnt'],
							"fyear" : fyear,
							"testid":0


						}
						db["pur"].insertOne(insert_purchase).then(function(purchaseid){
							
							
							itemflag = PANEL_PURCHASE_PROD(fyear, "", "", rd, db, spid, transid, main);
							//return [true, tbl["PR_ITM"], "Done"];
						});					


					})
					 	//callback([" "+text['name']+" Data "+mode+" Successfully !"]); 
				});

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
		    		if (rp['mode'] == 2){P_R_DELETE(fyear, tbl, rd, db, typ, cr, transid);}
		    		purflag = PURCHASE_UPDATE(fyear, tbl["PURC"], rd, db, transid, spid);
				
			      itemflag = PANEL_PURCHASE_PROD($fyear, tbl["PR_ITM"], tbl, rd, db, spid, transid, main);	
			      return [false, "Purchase CASH Update", "Done"];
          	}
          	if (rp["cscr"]=='CREDIT'){
          		cr = 'credit';
			    	dr = 'debit' ;
			    	transflag = TRANS_UPDATE(fyear, tbl, rd, db, typ, cr, dr, transid) ;
			    	if (rp['mode'] == 2){
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
			if (cscr=="CHALLAN"){main = false;}// must insert into sale_order_table
  
			if (cscr=="CASH"){
			  crdrtype = "credit";
			  crdrtypealt = "debit";
			};
			if (cscr=="CREDIT"){
			  crdrtype = "debit";
			  crdrtypealt = "credit";
			};
  
			transid = new ObjectId().toString();
			cashid = new ObjectId().toString();
			spid = new ObjectId().toString();
			var insert_mytrans = {"transid":transid,"ledgid":rp['ledgid'],"trtype":rp['dbcscr'], 
				  "type":typ,[crdrtype]:rp['gtot'],[crdrtypealt]:"0","fyear":fyear, }	;
			var insert_sale = {
				"spid" : spid,
				"ledgid":rp['ledgid'], 
				"transid": transid, 
				"itype": rp['itype'], 
				"billautono": "Don't know",
			    "billno":rp['billno'],
				"billdate":rp['dbbilldate'],
				"cscr":rp['dbcscr'], 
			    "csid":rp['csid'],
				"amount":rp['gtot'],
				"billas":rp['billas'],
				"comment":rp['cmnt'],
				"fyear": fyear,
				"testid": 0,
			}
			var cashquery = {"cashid":cashid,"ledgid" :  rp['ledgid'],"transid" : transid,"type" : typ,
			  "billno": rp['billno'],crdrtype : rp['gtot'],crdrtypealt:0,'date' : rp['dbbilldate'],'comment' : rp['cmnt']}
  
			db["trns"].insertOne(insert_mytrans).then(function(result){
				console.log("transid",transid);
				if(cscr == 'CASH'){db["cash"].insertOne(cashquery).then(function(result){console.log("cashid",cashid)});}
				if(cscr == 'CREDIT'){
				  if(rp['mode'] == 2){
					  prid = new ObjectId().toString();
					  var pr_insert = {"prid":prid,"ledgid":rp['ledgid'],"transid":transid,"vautono":"","type":typ,"cash":rp['gtot'],
					  "billno":rp['billno'],crdrtype:"0","date":rp['dbbilldate'],"credit":0,"fyear":fyear}
					  db["pr"].insertOne(pr_insert).then(function(result){});
				  }	
				}
				db["sale"].insertOne(insert_sale).then(function(purchaseid){
					console.log("spid", spid);
				  PANEL_SALE_PROD(fyear, callback, "", rd, db, spid, transid, main);
				  
			  });			
			})
		  } // customer save close final
		if (mode=="update"){
		  crdrtype = 'credit';
  		  cr = 'credit';
  		  dr = 'debit' ;

  		  transid = rp['transid'];
		  spid = rp['spid'];
		  const filter = {"spid":rp['spid'],"transid":rp['transid'],};
		  const sale_update = { "$set": {"ledgid":rp['ledgid'], "itype":rp['itype'], "billno":rp["billno"], "billdate":rp["dbbilldate"],
				      "cscr":rp["dbcscr"], "csid":rp['csid'], "amount":rp['gtot'], "billas":rp['billas'],"cmnt":rp['cmnt'],}};
		  if (rp["cscr"]=='CHALLAN'){
				itemflag = '00';
				db["saleo"].updateOne(filter, sale_update).then(function(saleoupdate){
					PANEL_SALE_PROD(fyear, callback, "", rd, db, rp['spid'], rp['transid'], main);
				})
			  	return true; //
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
				      if (rp['mode'] == 2){P_R_DELETE(fyear, tbl, rd, db, typ, cr, transid);}
				      var saleflag = SALE_UPDATE(fyear, tbl['SALE'], rd, db, transid, spid);
				    	var itemflag = PANEL_SALE_PROD(fyear, tbl['SL_ITM'], tbl, rd, db, spid, transid, main);
				      return [false, "Sales CASH Update", "Done"];
			        };
			      if (rp["cscr"]=='CREDIT'){
			      	cr = 'debit';
				    	dr = 'credit' ;
			      	transflag = TRANS_UPDATE(fyear, tbl, rd, db, typ, cr, dr, transid) ;

				      if (rp['mode'] == 2){
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


  function PANEL_SALE_PROD(fyear, callback, tbl, recdic, db, saleid, transid, main){
	var grid = recdic['grid'] ;
	var ins_data = [];
	var upd_data = [];
	var stk_ins_data = [];
	var stk_upd_sale_data = {};
	var stk_upd_batch_data = [];
	var item_del_update = [];
	var err_items = [];
	var stkinfo = {'info':'multibat'};
	var [iadd, iupdt, sno] = [0, 0, -1];
  
	inforow = [] ;
	
	for (const [k, v] of Object.entries(grid)){
	  
	  if (v['itemid'] !="" && v['qty'] !=""){
		  
		  
		//if (v['spitemid'] !=""){
		if(typeof v['spitemid'] !== "undefined"){
		  upd_data = {'spid':saleid, 'amt':v['amt'].toFixed(2),'tdisamt':v['tdisamt'].toFixed(2),'supid':v['supid'], 
			  'proid':v['itemid'],'bat':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'],
			  'srate_a':v['srate_a'],'dis':v['dis'],'mrp':v['mrp'],'tax1amt':v['cgst'],'pnet':v['pnet'],
			  'spid':saleid,'spitemid':v['spitemid']};
		  stkinfo = {'info':'Edited'};
  
		  updatedqty = parseInt(v['tqty'])+parseInt(v['statictotstk']);
		  
		  stk_upd_sale_data = {'qty':updatedqty,'stockid':v['stockid'],};
		  // First Update Stock Details Then Sales_item
		  if (main){stkinfo = StkUpdate_Sale("", stk_upd_sale_data, db, v['name'], main, infomsg="Sales Stock Updated");};
		  
		  Sale_Item_Table_Update(fyear, callback, "", upd_data, db, saleid, transid);
		
		}
		else{
		  ins_data = {'spid':saleid, 'amt':v['amt'],'tdisamt':v['tdisamt'],'supid':v['supid'], 
			  'proid':v['proid'],'bat':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'], 
			  'srate_a':v['srate_a'],'dis':v['dis'],'mrp':v['mrp'],'tax1amt':v['cgst'],'pnet':v['pnet'],};
  
		  if (v['stockid'] ==""){
			  if (main){
				stkinfo = {'info':'Stock Insert in Sales'};
				stk_ins_data = {'id':v['proid'],'proid':v['proid'],'bat':v['bat'],
			   'qty':v['tqty'],'expdbf':v['expdbf'],};
				stkinfo = StkInsert("", stk_ins_data, db, v['name'], main);
				console.log(" find1008 StockId Not Found in StkInsert PANEL_SALE_PROD Stock Inserted");  
				};
		  }
		  else{
			  if (main){
				  var stockid = "0";
				  var stockdbqty = '0';
				  var stk_update_flag = true;
				  var usergivenqty = parseInt(v['tqty']);
				  var dbstockqty_calculation = 0;
				  // "multibat" would be true when user give qty more than particular batch exists
				  // "multibat" "true" will autometically minus qty from next availabel batch, batch by batch
				  // "multibat" "true" condition not prepaired yet; *** prepair this is important    
				  for(var i = 0; i < v['stockarray'].length; i++){
					  var db_batch_wise_stk = parseInt(v['stockarray'][i]['qty']);
					  dbstockqty_calculation += db_batch_wise_stk
					  if (dbstockqty_calculation >= usergivenqty){
						  // dbstockqty_calculation may exceed than given qty 
						  stockid = v['stockarray'][i]['stockid'];
						  stockdbqty = parseInt(v['stockarray'][i]['qty']);
						  stk_upd_sale_data = {'qty':v['tqty'],'stockid':stockid, 'stockdbqty': stockdbqty};
						  // Should use better calculation method to find accurate qty selection available if db stock
						  // if user give more qty than available in total stock; than balance stock qty should be negative for first batch available
						  console.log("yaha aya kya ?");
						  StkUpdate_Sale(db, stk_upd_sale_data, db, v['name'], main, infomsg="Sales Stock Updated")
						  break
					  }
				  }
			  }
		  }
		  
		  Sale_Item_Table_Insert(fyear, callback, "", ins_data, db, saleid, transid);
		  console.log(" find1038 Sale_Item_Table_Insert Finally Saved ");
		}
	  }
	}
   
  }

  function Sale_Item_Table_Insert(fyear, callback, tblname, d, db, saleid, transid){
	var query = "INSERT INTO "+tblname+" (salesID, bill_no, bill_date, supplierID, productID, batch_no, qty, "+
	  " bonus, sale_price, sale_price_a, discount, m_r_p, exp_date, rate_tax ) "+
	  " VALUES ("+saleid+", '"+d['amt']+"', '"+d['tdisamt']+"', '"+d['supid']+"', '"+d['proid']+"', "+
	  " '"+d['bat']+"', '"+d['qty']+"', '"+d['bonus']+"', '"+d['rate']+"', '"+d['srate_a']+"', '"+d['dis']+"', "+
	  " '"+d['mrp']+"', '"+d['tax1amt']+"','"+d['pnet']+"' ) ";
	spiid = new ObjectId().toString();
	var insert_sale_itm = {
	  "spiid" : spiid,
	  "spid" : saleid,
	  "netamt" : d['netrate'],
	  "tdisamt": d['tdisamt'],
	  "csid" : d['supid'],
	  "itemid" : d['proid'],
	  "batchno" : d["bat"],
	  "qty" : d['qty'],
	  "bonus" : d['bonus'],
	  "rate" : d['rate'],
	  "srate" : d['srate'],
	  "rate_a" : d['srate_a'],
	  "amt" : d['amt'],
	  "dis" : d['dis'],
	  "mrp" : d['mrp'],
	  "cgst" : d['tax1amt'] ,//Jhol ho sakta hai 
	  }
	  db["sitm"].insertOne(insert_sale_itm).then(function(sale_items){
		  console.log(" ================= ***** ========== spiid", spiid)
		  callback(["SALE DATA INSERTED SUCCESSFULLY !"]);
  
	  });
	  
	};
 
  function Sale_Item_Table_Update(fyear, callback, tbl, d, db, saleid, transid){
    const str = res.qty;
    const qty_num = parseInt(str);
    const filter = { spiid: d['spitemid'], spid : saleid  };
    const update = { $set: {
	  "netamt" : d['netrate'],
	  "tdisamt" : d['tdisamt'],
	  "spid" : d['supid'],
	  "itemid" : d['proid'],
	  "batchno" : d['bat'],
      "qty": d['qty'],
	  "bonus" : d['bonus'],
	  "rate" : d['rate'],
	  "srate" : d['srate'],
	  "rate_a" : d['srate_a'],
	  "amt" : d['amt'],
	  "dis" : d['dis'],
	  "mrp" : d['mrp'],
	  "cgst" : d['tax1amt'],
    }};
    db["sitm"].updateOne(filter, update).then(function(res) {
        console.log("Line 1114 update successful, Sale_Item_Table_Update");
        callback(["SALE DATA UPDATED SUCCESSFULLY !"]);
      })
      .catch(function(err) {
        console.log("Error On Sale_Item_Table_Update Line 1118 >>> ", err);
      });
 };


 function StkUpdate_Sale(tbl, d, db, itemname, main, infomsg="N A"){
	if(main === false){return {'name':itemname, 'flag':false, 'info':"CHALLAN_SAVED", 'msg':"---",};}
	else{
  
		  db["stk"].findOne({"stockid": d['stockid']})
	  .then(function(res) {
		  const str = res.qty;
		  const qty_num = parseInt(str);
		  const filter = { stockid: d['stockid'] };
		  const update = { $set: {
		  qty: (qty_num - d['qty']).toString(),
		  }};
		  db["stk"].updateOne(filter, update)
		  .then(function(res) {
			  
		  })
		  .catch(function(err) {
			  console.log("Error on StkUpdate_Sale line 1108 >>> ", err);
		  });
	  })
	  .catch(function(err) {
		  console.log("Error on StkUpdate_Sale line 1112 >>> ", err);
	  });	
   }
  };
function StkInsert(tbl, d, db, itemname, main){
  var row = {'name':"itemname", 'flag':false, 'info':"stock insert",'msg':"---",};
  if(main === false){return {'name':itemname, 'flag':false, 'info':"CHALLAN_SAVED",'msg':"---",};}
  else{

	stockid = getUniqueId();
	var insert_Stk = {
		"stockid":stockid,
		"itemid" :d['itemid'],
		"batchno" : d['batchno'],
		"qty" : d['qty'],
		"expdate": "" ,    //d['expdbf']
	};
	db['stk'].insertOne(insert_Stk).then(function(stk_ins_details){
		console.log("inserted new stock");
	})

   }
}

function strtoInt (inputstr, addstring){return (parseInt(inputstr) + parseInt(addstring)).toString();}

function StkUpdate_Pur(tbl, d, db, itemname, main, infomsg="N A"){

    const filter = { stockid: d['stockid'] };
    const update = { $set: {
      qty: strtoInt(d['stockdbqty'], d['qty']),
    }};
	
   // console.log(qty_num);
    db["stk"].updateOne(filter, update)
      .then(function(res) {
		//??//
      })
      .catch(function(err) {
        console.log(err);
      });


}
    

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
  

  for (const [k, v] of Object.entries(grid)){
	

  	 if (v['itemid'] !="" && v['qty'] !="")
	 {
  	 	
  	 	if(typeof v['spitemid'] !== "undefined"){ 
			
        upd_data = {'spid':purcid, 'amt':v['amt'],'tdisamt':v['tdisamt'],'supid':v['supid'], 
            'proid':v['itemid'],'bat':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'],'srate':v['srate'],
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
     
        ins_data = {'spid':purcid, 'amt':v['amt'],'tdisamt':v['tdisamt'],'supid':v['supid'], 
            'proid':v['itemid'],'bat':v['batchno'],'qty':v['qty'],'bonus':v['bonus'],'rate':v['rate'], 'srate':v['srate'],
            'srate_a':v['srate_a'],'dis':v['dis'],'mrp':v['mrp'],'tax1amt':v['cgst'],'pnet':v['pnet'],'netrate':v['netrate'],};

        // if 'stockid' available then stock will update in qty using stockid otherwise insert new row in stock table;
        
		if (v['stockarray'] == undefined ){
			
            if (main){
				
              stkinfo = {'info':'Stock Insert in Sales'};
              stk_ins_data = {'itemid':v['itemid'],'id':v['proid'],'proid':v['proid'],'batchno':v['batchno'],
             'qty':v['tqty'],'expdbf':v['expdbf'],};
			
              stkinfo = StkInsert(tbl, stk_ins_data, db, v['name'], main);
              inforow.push(stkinfo);
              console.log(" find821 entered in StkInsert Stock Inserted");  
              };
            
          }
        else{
			
          if (main){
				var stockid = "0";
				var stockdbqty = '0';
				var stk_ins_flag = true;
				for(var i = 0; i < v['stockarray'].length; i++){
					if( v['stockarray'][i]['batchno'].trim() === v['batchno'].trim()){
						// console.log("matched", v['batchno'], "stockid", v['stockarray'][i]['stockid'])
						stockid = v['stockarray'][i]['stockid'];
						stockdbqty = v['stockarray'][i]['qty'];
						stk_ins_flag = false;
						break;
					}
				}
				
                stk_upd_pur_data = {'qty':v['tqty'],'stockid':stockid, 'stockdbqty': stockdbqty};
				if(stk_ins_flag){
					StkInsert(tbl, v, db, v['name'], main)
				}
				else{StkUpdate_Pur(tbl, stk_upd_pur_data, db, v['name'], main);}
              
              };
        }
		
        siteminfo =Purchase_Item_Table_Insert(fyear, v['name'], tbl, ins_data, db, purcid, transid);
        inforow.push(siteminfo);;
    
      }
    }
  }
  
  return inforow;
}


function Purchase_Item_Table_Insert(fyear, itemname, tbl, d, db, purcid, transid){
	
  query = "INSERT INTO "+tbl["PR_ITM"]+" (purchaseID, purchase_inv, bill_date, supplierID, productID, batch_no, qty, "+ 
    " bonus, purchase_price, sale_price, sale_price_a, sale_price_b, discount, m_r_p, exp_date ) "+
    " VALUES ("+purcid+", '"+d['netrate']+"', '"+d['tdisamt']+"', '"+d['supid']+"', '"+d['proid']+"', "+
    " '"+d["bat"]+"', '"+d['qty']+"', '"+d['bonus']+"', '"+d['rate']+"', '"+d['srate']+"', '"+d['srate_a']+"', '"+d['amt']+"', "+ 
    " '"+d['dis']+"', '"+d['mrp']+"', '"+d['tax1amt']+"' ) ";
/////////////////////////////////////////////////////////////////////////////----------------------------------------------------------
	spiid = new ObjectId().toString();
	var insert_purchase_itm = {
		"spiid" : spiid,
		"spid" : purcid,
		"netamt" : d['netrate'],
		"tdisamt": d['tdisamt'],
		"csid" : d['supid'],
		"itemid" : d['proid'],
		"batchno" : d["bat"],
		"qty" : d['qty'],
		"bonus" : d['bonus'],
		"rate" : d['rate'],
		"srate" : d['srate'],
		"rate_a" : d['srate_a'],
		"amt" : d['amt'],
		"dis" : d['dis'],
		"mrp" : d['mrp'],
		"cgst" : d['tax1amt'] ,//Jhol ho sakta hai 

	}
	db["pitm"].insertOne(insert_purchase_itm).then(function(purchase_item_id){
		//========= this
		
	})
    
  }
 
 function Purchase_Item_Table_Update(fyear, itemname, tbl, d, db, purcid, transid){
  // netrate will store in purchase_inv column
  // tdisamt will store in bill_date column
  // cgst amount will store in exp_date column
  // amount will store in sale_price_b column

    const str = res.qty;
    const qty_num = parseInt(str);
    const filter = { spiid: d['spitemid'], spid : purcid  };
    const update = { $set: {
	  "netamt" : d['netrate'],
	  "tdisamt" : d['tdisamt'],
	  "spid" : d['supid'],
	  "itemid" : d['proid'],
	  "batchno" : d['bat'],
      "qty": d['qty'],
	  "bonus" : d['bonus'],
	  "rate" : d['rate'],
	  "srate" : d['srate'],
	  "rate_a" : d['srate_a'],
	  "amt" : d['amt'],
	  "dis" : d['dis'],
	  "mrp" : d['mrp'],
	  "cgst" : d['tax1amt'],

    }};
    console.log(qty_num);
    tclc["stk"].updateOne(filter, update)
      .then(function(res) {
        console.log("update successful, Purchase_Item_Table_Update");
		return [false, tbl["PR_ITM"], "Done !"];
      })
      .catch(function(err) {
        console.log(err);
      });
  
 };


 var SPINFO = function(db, ledgid, transid, cs, sp, spitm, fyear, cb) {
	db[cs].find({"ledgid":ledgid}).limit(1).toArray().then(function(partydetails){
      db[sp].find({"transid":transid,"ledgid":ledgid,}).toArray().then(function(sprows){
        var getSPID = sprows[0]["spid"];
        for(var i=0; i<sprows.length; i++){
        sprows[i]["name"]=partydetails[0]["name"];
        sprows[i]["add1"]=partydetails[0]["add1"];
        sprows[i]["add2"]=partydetails[0]["add2"];
        sprows[i]["stcode"]=partydetails[0]["add3"];
        sprows[i]["regn"]=partydetails[0]["regn"];
        sprows[i]["gstn"]=partydetails[0]["gstn"];
        sprows[i]["mode"]=partydetails[0]["mode"];
        sprows[i]["mobile"]=partydetails[0]["mobile"];
        sprows[i]["invdate"]=sprows[i]["billdate"];
      } 
      
      db[spitm].find({"spid":getSPID,}).toArray().then(function(spitems){
          let index = 0;
        
          for(let j=0; j<spitems.length; j++){
            let itemid = spitems[j]["itemid"]; // first collect itemid present in sales_item then search into products collection
            let batchno = spitems[j]["batchno"]; // first collect batchno present in sales_item then search into stock collection
            
            // must run and search inside for loop;
            db["itm"].find({"itemid":itemid,}).toArray().then(function(itemrows){
              // update spitems with item details;
              let itemid = spitems[j]["itemid"]; // retriving right order;
              let batchno = spitems[j]["batchno"]; // retriving right order;
              //console.log("indj", index, j, itemid, batchno)
              spitems[j]["name"]=itemrows[0]["name"]
              spitems[j]["pack"]=itemrows[0]["pack"]
              spitems[j]["unit"]=itemrows[0]["unit"]
              spitems[j]["tax1"]=itemrows[0]["cgst"]
              spitems[j]["tax2"]=itemrows[0]["sgst"]
              spitems[j]["tax"]=itemrows[0]["gst"]
              spitems[j]["hsn"]=itemrows[0]["hsn"]
              spitems[j]["sgst"]=spitems[j]["cgst"]
              spitems[j]["prate"]=itemrows[0]["netrate"]
              var amttot = spitems[j]["amt"]-spitems[j]["tdisamt"]
              var cgstamt = spitems[j]["cgst"]
              var ttaxamt = cgstamt*2
              var netamt = amttot+ttaxamt
              spitems[j]["amttot"]=amttot.toFixed(2);
              spitems[j]["ttaxamt"]=ttaxamt.toFixed(2);
              spitems[j]["netamt"]=netamt.toFixed(2);
              spitems[j]["sstk"]="_0_0"; // Default Given IF STOCK NOT AVAILABLE
              db["stk"].find({"itemid":itemid,"batchno":batchno,}).toArray().then(function(stkrows){
              // Exact Copying from previous SQL method; can improve to better than this, after understaing this proccess
              // IF Stock Available ==>> split method is implemented in javascript, so, copying the same  
				if(stkrows.length > 0){
                	spitems[j]["sstk"]=stkrows[0]["expdate"]+"_"+stkrows[0]["qty"]+"_"+stkrows[0]["stockid"];
				}
				else {
					spitems[j]["sstk"] = " _0_0" ;
				}
            }) // Fifth Promise Closed here (Stock Details)
              //console.log("==> push data", index)
            index+= 1;
          }) // Fourth Promise Inside For Loop Closed here (Items Details)
          }
        setTimeout(() => {cb(["Store Error if Any"], sprows, spitems, []);}, 1000)

      })// Third Promisse Closed here (spitems Details)
      
      }) // Second Promisse Closed here (Sales Details)
    }) // First Promisse Closed here (Customer Details)
	};

module.exports.add_to_db = add_to_db;
module.exports.csfind_by_name = csfind_by_name; 
module.exports.csfinalbill = csfinalbill;
module.exports.SPINFO = SPINFO ;


