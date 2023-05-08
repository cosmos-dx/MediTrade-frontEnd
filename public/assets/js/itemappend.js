


function tableColumnHeader(){
    
    document.getElementById("itembox").insertRow().innerHTML ='<thead><tr>'+
    '<th></th><th>S.No</th><th>Items Name</th><th>Pack</th><th>Qty</th><th>Batch</th><th>Bonus</th>'+
    '<th>Rate</th><th>Dis-%</th><th>Amount</th><th>Exp</th><th> GST-% </th><th>NetRate</th>'+
    '</tr></thead>';
}

function appendRow(){
    
    
    ++idcount ;
    
   
    document.getElementById("itembox").insertRow(-1).innerHTML = '<tr><td><button id='+idcount+'_incbtn'+' name="addbtn" '+
    'style="width:30px" onclick="appendRow()">+</button></td>'+
    '<td><label id='+idcount+'_sno'+' name="sno" class="rmslabelwidth0" >'+idcount+'</label></td>'+
    '<td><input id='+idcount+'_itemsearch'+' name="typeahead" class="typeahead" autocomplete="on" spellcheck="false" '+
    ' placeholder="Items Name" onkeyup="onItemChange(event)" onfocus="onItemSearchFocus(event)"></td >'+
    '<td><label id='+idcount+'_pack'+' name="pack" class="tdgridpacklabel0" ></label></td >'+
    '<td><input type="text" id='+idcount+'_qty'+' name="qty" class="rmsqtyvalidate" placeholder="Qty" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+

    '<input type="text" id='+idcount+'_batchno name="batchno" class="addinput batinputstyle" list='+idcount+'_batlist value=""  '+
    'placeholder="Batch" onfocus="getFocusedID(event)" onkeyup="onBatchUpdate(event)" /><div list='+idcount+"_batlist id="+idcount+'_batlist ></div>'+

    //'<td><input type="text" id='+idcount+'_batchno'+' name="batchno" class="addinput batinputstyle" placeholder="Batch" list='+idcount+'_batlist '+
    //' onfocus="getFocusedID(event)" style="width:80px" onfocus="getFocusedID(event)" onkeyup="onBatchUpdate(event)" ><div list="list-batch"></div></td >'+
    

    '<td><input type="text" id='+idcount+'_bonus'+' name="bonus" class="bonusvalidate" placeholder="Bonus" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_rate'+' name="rate" class="rmsgridfloatval" placeholder="Rate" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_dis'+' name="dis" class="rmsgriddiscount" maxlength="4" placeholder="Discount" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_amt'+' name="amt" class="gridamtlabel1" placeholder="0.00" '+
    ' onfocus="getFocusedID(event)" readonly ></td >'+

    '<td><input type="text" id='+idcount+'_expdate name="exp" class="expvalidate" placeholder="mm/yy" value="" onfocus="getFocusedID(event)" '+
    'onkeyup="onExp(event)" maxlength="5" /></td>'+

    '<td><label id='+idcount+'_tax'+' name="tax" class="tdgridlabel" >0.00</label></td >'+
    '<td><label id='+idcount+'_netrate'+' name="netrate" class="tdgridlabel" >0.00</label></td ></tr>';

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // if(!idcount==0){
    //     var btchno = document.getElementById(idcount-1+'_batchno').value.trim().toUpperCase();
    //     console.log(btchno);
    //    // recdic['grid'][idcount]["batchno"] = btchno;
    // }
    //-------------------------------------------------------------------------------------------------------------------------
    itemhost = document.URL.substring(0, document.URL.lastIndexOf("/")+1)+'itemsearchenter';
    $('.typeahead').on('typeahead:selected', function(evt, item) {
    // item has value ; item.value
        var searchtxt = this.value;  
        propostAjax('products', searchtxt, itemhost ,'POST', 'itemsearch||selection||all||items', 1, {'limit':itemdatalimit,});    
            });
    
    onBatchSelect(idcount,"#"+idcount+"_batchno","#"+idcount+"_batlist","#"+idcount+"_exp");

    searchTypeAhead('#'+idcount+'_itemsearch','products','POST', 
        itemhost+"?name=%QUERY"+"&idf=items&getcolumn=name&limit="+itemdatalimit,
        itemdatalimit)
   
    
    setInputFilter(document.getElementById(idcount+'_qty'), function(value) {
        return /^-?\d*$/.test(value); }); 
    setInputFilter(document.getElementById(idcount+'_bonus'), function(value) {
        return /^[0-9 +]*$/i.test(value); });
    setInputFilter(document.getElementById(idcount+'_rate'), function(value) {
        return /^-?\d*[.,]?\d*$/.test(value); });
    setInputFilter(document.getElementById(idcount+'_dis'), function(value) {
        return /^-?\d*[.,]?\d*$/.test(value); });

    
}

function SPEDIT_appendRow(rawprows, rawitemrows){
    let prows = JSON.parse(jsonformater(rawprows));
    let itemrows = JSON.parse(jsonformater(rawitemrows));
    let idcount = 0;
    // let prows = JSON.parse(rawprows); // party rows;
    // let itemrows = JSON.parse(rawitemrows);
    var amt = 0
    var cgst = 0
    var tdisamt = 0
    var netamt = 0
    for(let idc=0; idc<itemrows.length; idc++) {
        
        var astr = '<tr><td><button id='+idc+'_incbtn'+' name="addbtn" style="width:30px" onclick="appendRow()">+</button></td>'+
        '<td><label id='+idc+'_sno'+' name="sno" class="rmslabelwidth0" >'+idc+'</label></td>'+
        '<td><input id='+idc+'_itemsearch'+' name="typeahead" class="typeahead" autocomplete="on" spellcheck="false" '+
        ' placeholder="Items Name" onkeyup="onItemChange(event)" onfocus="onItemSearchFocus(event)" value="'+itemrows[idc].name+'"></td >'+
        '<td><label id='+idc+'_pack'+' name="pack" class="tdgridpacklabel0" >'+itemrows[idc].pack+'</label></td >'+
        '<td><input type="text" id='+idc+'_qty'+' name="qty" class="rmsqtyvalidate" placeholder="Qty" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idc].qty+'" ></td >'+

        '<input type="text" id='+idc+'_batchno name="batchno" class="addinput batinputstyle" list='+idc+'_batlist value="'+itemrows[idc].batchno+'"  '+
        'placeholder="Batch" onfocus="getFocusedID(event)" onkeyup="onBatchUpdate(event)" /><div list='+idc+"_batlist id="+idc+'_batlist ></div>'+
        //'<td><input type="text" id='+idc+'_batchno'+' name="batchno" class="typeahead" placeholder="Batch" value="AA" '+
        //' onfocus="getFocusedID(event)" style="width:80px" ></td >'+

        '<td><input type="text" id='+idc+'_bonus'+' name="bonus" class="bonusvalidate" placeholder="Bonus" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idc].bonus+'" ></td >'+
        '<td><input type="text" id='+idc+'_rate'+' name="rate" class="rmsgridfloatval" placeholder="Rate" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idc].rate+'" ></td >'+
        '<td><input type="text" id='+idc+'_dis'+' name="dis" class="rmsgriddiscount" maxlength="4" placeholder="Discount" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idc].dis+'" ></td >'+
        '<td><input type="text" id='+idc+'_amt'+' name="amt" class="gridamtlabel1" placeholder="0.00" '+
        ' onfocus="getFocusedID(event)" value="'+itemrows[idc].amt+'" readonly ></td >'+

        '<td><input type="text" id='+idc+'_expdate name="exp" class="expvalidate" placeholder="mm/yy" value="'+itemrows[idc]["stockarray"][0]["expdate"]+'" onfocus="getFocusedID(event)" '+
        'onkeyup="onExp(event)" maxlength="5" /></td>'+

        '<td><label id='+idc+'_tax'+' name="tax" class="tdgridlabel" >'+itemrows[idc].tax+'</label></td >'+
        '<td><label id='+idc+'_netrate'+' name="netrate" class="tdgridlabel" >'+itemrows[idc].netamt+'</label></td ></tr>';
        
        var dbstk = GetDBStk_stkarray(itemrows[idc]["stockarray"], itemrows[idc].batchno);

        itemrows[idc]['stockid']=dbstk["stockid"];
        itemrows[idc]['dbstock']=dbstk["dbstock"];
        itemrows[idc]['dbbatchstock']=dbstk["dbbatchstock"];
        itemrows[idc]['expdate']=dbstk["expdate"];
        itemrows[idc]['dbbatchno']=dbstk["dbbatchno"];
        var bonus_numeric = 0 ;
        if(isNumeric(itemrows[idc].bonus)){
            bonus_numeric = parseInt(itemrows[idc].bonus) ;
        }
        var tqty = parseInt(itemrows[idc].qty)+bonus_numeric;
        itemrows[idc]['tqty']=tqty ;
        amt +=parseFloat(itemrows[idc]["amt"])  
        cgst +=parseFloat(itemrows[idc]["cgst"])
        tdisamt +=parseFloat(itemrows[idc]["tdisamt"])
        netamt +=parseFloat(itemrows[idc]["netamt"])
        document.getElementById("itembox").insertRow(-1).innerHTML += astr;
        onBatchSelect(idc,"#"+idc+"_batchno","#"+idc+"_batlist","#"+idc+"_exp");

        }
    
    prows["amt"] = amt;
    prows["cgst"] = cgst;
    prows["sgst"] = cgst;
    prows["ttaxamt"] = cgst*2;
    prows["tdisamt"] = tdisamt;
    prows["tamt"] = amt-tdisamt;
    prows["netamt"] = netamt.toFixed(2);
    // document.getElementById("ttaxamt").innerHTML=prows["ttaxamt"];
    // document.getElementById("tdisamt").innerHTML=prows["tdisamt"];
     //document.getElementById("cgst").innerHTML=cgst;
    // document.getElementById("sgst").innerHTML=prows["sgst"];
    return {"prows":prows, "itemrows":itemrows};
}

function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}

function searchTypeAhead(s, n, m, r, l){
    $(s).typeahead({name:n, method:m, remote:r, limit:l });
} ;

function suppostAjax(searchtxt, seturl, gptype, idf, keyc,){
    var dbrows = [];  
    var csname = document.getElementById("cssearch").innerHTML;
    
    $.ajax({
        url: seturl,
        type: gptype,
        data: {name:csname,searchtxt:searchtxt, idf:idf, limit:keyc},
        dataType: 'json',
        success: function(result) {
            recdic['pan'] = result[0]; 
            recdic['pan']["billas"]='M'; // Default to Main Bill
            recdic['pan']["itype"]='1'; // 1==> for unregisted party; 2==> for registerd party
            $('.tt-dropdown-menu').css('display', 'none');
            $('#phone').html(result[0].phone);
            $('#add1').html(result[0].add1);
            $('#add2').html(result[0].add2);
            $('#add3').html(result[0].add3);
            if (posdict[result[0].add3] != null){
                 $('#add3').html(posdict[result[0].add3].toUpperCase());
            }
            $('#gstn').html(result[0].gstn);
            $('#regn').html(result[0].regn);
            //$('#supsearch').val(result[0].name );
            document.getElementById('0_itemsearch').focus();
            // document.getElementById('0_itemsearch').focus();
            // document.getElementById('supsearch').value = result.dbrows[0].name;    
                }
            });
        }


function propostAjax(name, searchtxt, seturl, gptype, idf, keyc, info){
    cs = document.getElementById("sp").innerHTML.toLowerCase().trim();
    var totstk = 0 // will add to main result key-value pair
    var dbstkarray = [];
    var dbstock = 0;
    var batchno = "";
    var dbbatchstock = 0;
    var dbbatchno = "";
    var stockid = null;
    var expdate = "";
   
    $.ajax({
        url: seturl,
        type: gptype,
        data: {name:name,searchtxt:searchtxt, idf:idf, limit:keyc, info:info},
        dataType: 'json',
        success: function(result) {
           
            if(result.length > 0){
                totstk = 0;
                dbstkarray = result[0]['stockarray'];
                if(dbstkarray.length>0){
                
                    var dbstk = GetDBStk_stkarray(dbstkarray, ""); // No BATCH Will Available Here, remain EMPTY
                
                    batchno = dbstkarray[0]["batchno"];
                    if (batchno==null){batchno="";}
                    
                    stockid = dbstk["stockid"];
                    dbstock = dbstk["dbstock"];
                    dbbatchstock = dbstk["dbbatchstock"];
                    expdate = dbstk["expdate"];
                    dbbatchno = dbstk["dbbatchno"];
                   
                }
                recdic['grid'][idcount] = result[0]; 
                recdic['grid'][idcount]['stockid']=stockid;
                recdic['grid'][idcount]['dbstock']=dbstock;
                recdic['grid'][idcount]['dbbatchstock']=dbbatchstock;
                recdic['grid'][idcount]['expdate']=expdate;
                recdic['grid'][idcount]['dbbatchno']=dbbatchno;
                recdic['grid'][idcount]["totstk"]=dbstock;
                recdic['grid'][idcount]["batchno"]=batchno;
                recdic['grid'][idcount]["rate_a"]=0.00; // Not in use write now but would be useful further
                // "multibat" default is false; if user give/enter qty more than the relative batch exists
                // "multibat" true condition automatically match batch wise qty and minus from stock table using stockid ;
                recdic['grid'][idcount]["multibat"]=false;  
                $('.tt-dropdown-menu').css('display', 'none');
                $('#'+idcount+'_pack').html(result[0].pack);
                if (cs=="customer"){
                    
                    $('#'+idcount+'_rate').val(result[0].srate);
                }else{

                    $('#'+idcount+'_rate').val(result[0].prate);
                }
                
                $('#'+idcount+'_tax').html(result[0].gst);
                document.getElementById(idcount+'_qty').focus();
                $('#'+idcount+'_itemsearch').val(result[0].name);
                $('#'+idcount+'_batchno').val(batchno);
                $('#'+idcount+'_expdate').val(expdate);
                StatusInfoDp(result[0], dbstock, "0.00", "0.00");
                
           }
        }

        });
     }


function billnoSET(dpidtag, bstartstring, fyear, billas='M'){
  $.ajax({
     url: cshost,
     type: "GET",
     data: {
        name:cs.trim(),
        getcolumn:"billno",
        limit:{"billhead":bstartstring,
        "fyear":fyear, "billas":billas}, 
        idf:"billnoset", 
        },
     dataType: 'json',
     success: function(result) {
        var billno = bstartstring+"00001";
        if(result.length > 0){
            var dbbillno = result[0]["billno"];
            if (dbbillno){
                var bn = parseInt(dbbillno.split(bstartstring)[1])+1;  
                var bnstr = ('00000'+bn).slice(-5);
                billno = bstartstring+bnstr;
            }
        }
        $(dpidtag).val(billno);
     
     }
  });
}
  
$('.typeahead').on('typeahead:selected', function(evt, item, name) {
    var searchtxt = this.value; 
    if (name.trim()=='supplier'){
        // Selected on click
        var m_cshost = cshost+"?name=%QUERY&idf="+cs+"&getcolumn=all&limit=1" // required for GET method only
        suppostAjax(searchtxt, m_cshost, 'POST', 'supsearch||selection||all||'+cs.trim(), 1,);
        
        //suppostAjax(searchtxt, cshost, 'POST', 'typeahead, selected', 0, );
        }
    if (name.trim()=='customer'){
        // Selected on click
        var m_cshost = cshost+"?name=%QUERY&idf="+cs+"&getcolumn=all&limit=1" // required for GET method only
        suppostAjax(searchtxt, m_cshost, 'POST', 'supsearch||selection||all||'+cs.trim(), 1,);

        //suppostAjax(searchtxt, cshost, 'POST', 'typeahead, selected', 0, );
        }
    if (name.trim()=='products'){
        var m_itemhost = itemhost+"?name=%QUERY&idf=items&getcolumn=all&limit=1" // required for GET method only
        propostAjax(name, searchtxt, m_itemhost, 'POST', 'itemsearch||selection||all||items', 1, {'limit':itemdatalimit,});
        }
    });

$('#0_itemsearch').on('keydown', function(e) {
    var keyc = e.keyCode || e.which;
    var searchtxt = this.value; 
    if (keyc == 13){
        var m_itemhost = itemhost+"?name=%QUERY&idf=items&getcolumn=all&limit=1" // required for GET method only
        propostAjax("items", searchtxt, m_itemhost, 'POST', 'itemsearch||selection||all||items', 1, {'limit':itemdatalimit,});
        } ;
    });

$('#supsearch').on('keydown', function(e) {
    var keyc = e.keyCode || e.which;
    var searchtxt = this.value; 
    $("#add1").html('');
    $("#add2").html('');
    $("#add3").html('');
    if (keyc === 13){ 
        // Selected from KeyBord on Press Enter
        var m_cshost = cshost+"?name=%QUERY&idf="+cs+"&getcolumn=all&limit=1" // required for GET method only
        suppostAjax(searchtxt, m_cshost, 'POST', 'supsearch||selection||all||'+cs.trim(), keyc,); };
        });

function onItemSearchFocus(evt){
    idcount = document.activeElement.id.split('_')[0];
    document.getElementById("0_itemsearch").scrollIntoView();};

function getFocusedID(evt){
    idcount = document.activeElement.id.split('_')[0];
    document.getElementById("statusinfo").innerHTML = "";
    if(typeof(recdic['grid'][idcount]) == 'undefined'){
        document.getElementById("statusinfo").innerHTML = "DATA NOT AVALIABLE ! ErrorCode[348;itemappend]";
        document.getElementById("statusinfo2").innerHTML = "";
    }else{
        if (typeof(recdic['grid'])=== "string"){
            var grid = JSON.parse(recdic['grid']) ;
            recdic['grid']=grid;
            var rgi = recdic['grid'][idcount];
            var gstamt = rgi["ttaxamt"];
            var disamt = rgi["tdisamt"];
            recdic['grid'] = grid;
            var dbstk = GetDBStk_stkarray(recdic['grid'][idcount]["stockarray"], recdic['grid'][idcount]["batchno"]);
            recdic['grid'][idcount]['stockid']=dbstk["stockid"];
            recdic['grid'][idcount]['dbstock']=dbstk["dbstock"];
            recdic['grid'][idcount]['dbbatchstock']=dbstk["dbbatchstock"];
            recdic['grid'][idcount]['expdate']=dbstk["expdate"];
            recdic['grid'][idcount]['dbbatchno']=dbstk["dbbatchno"];
            
            gstamt = rgi["ttaxamt"];
            disamt = rgi["tdisamt"];
            StatusInfoDp(rgi, dbstk["dbstock"], gstamt, disamt);
        }else{
            var rgi = recdic['grid'][idcount];
            var dbstk = GetDBStk_stkarray(rgi["stockarray"], rgi["batchno"]);
            rgi['stockid']=dbstk["stockid"];
            rgi['dbstock']=dbstk["dbstock"];
            rgi['dbbatchstock']=dbstk["dbbatchstock"];
            rgi['expdate']=dbstk["expdate"];
            rgi['dbbatchno']=dbstk["dbbatchno"];
            
            gstamt = rgi["ttaxamt"];
            disamt = rgi["tdisamt"];
            StatusInfoDp(rgi, dbstk["dbstock"], gstamt, disamt);
        }
        
     }
 }

function StatusInfoDp(rgi, dbstock, gstamt, disamt){
    //if (isNaN(disamt)){disamt = 0;}
    
    gstamt = parseFloat(gstamt).toFixed(2);
    disamt = parseFloat(disamt).toFixed(2);
    document.getElementById("statusinfo").innerHTML = "Bat: "+rgi["batchno"]+" Bat-Qty:"+rgi["dbbatchstock"]+" Total Stock: "+dbstock;
    var mrp_hsn = "MRP: Rs."+rgi["mrp"]+" /- HSNCode: "+rgi["hsn"]+" GST: "+gstamt+" Discount: "+disamt;
    document.getElementById("statusinfo2").innerHTML = mrp_hsn;
}

function onItemChange(e){
    
    var keyc = e.keyCode || e.which;
   
    var activeid = document.activeElement.id;

    var hasid = '#'+activeid;
    
    var searchtxt = document.getElementById(activeid).value ;
    
    document.getElementById('statusinfo').innerHTML = hasid+keyc + searchtxt;
    
    $(idcount+'_pack').html('');
    
    searchTypeAhead(hasid,'products','POST', 
        itemhost+"?name=%QUERY"+"&idf=items&getcolumn=name&limit="+itemdatalimit, itemdatalimit);
        
    
    if (keyc == 13){
        var m_itemhost = itemhost+"?name=%QUERY&idf=items&getcolumn=all&limit=1" // required for GET method only
        propostAjax('items',searchtxt, m_itemhost, 'POST','itemsearch||selection||all||items',
        1, {'limit':itemdatalimit,});
    }
    document.getElementById(activeid).focus();
}