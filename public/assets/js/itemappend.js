

function tableColumnHeader(){
    
    document.getElementById("itembox").insertRow().innerHTML ='<thead><tr>'+
    '<th></th><th>S.No</th><th>Items Name</th><th>Pack</th><th>Qty</th><th>Batch</th><th>Bonus</th>'+
    '<th>Rate</th><th>Dis-%</th><th>Amount</th><th> GST-% </th><th>NetRate</th>'+
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

    '<td><input type="text" id='+idcount+'_batchno'+' name="batchno" class="typeahead" placeholder="Batch" '+
    ' onfocus="getFocusedID(event)" style="width:80px" ></td >'+

    '<td><input type="text" id='+idcount+'_bonus'+' name="bonus" class="bonusvalidate" placeholder="Bonus" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_rate'+' name="rate" class="rmsgridfloatval" placeholder="Rate" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_dis'+' name="dis" class="rmsgriddiscount" maxlength="4" placeholder="Discount" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_amt'+' name="amt" class="gridamtlabel1" placeholder="0.00" '+
    ' onfocus="getFocusedID(event)" readonly ></td >'+
    '<td><label id='+idcount+'_tax'+' name="tax" class="tdgridlabel" >0.00</label></td >'+
    '<td><label id='+idcount+'_netrate'+' name="netrate" class="tdgridlabel" >0.00</label></td ></tr>';

    itemhost = document.URL.substring(0, document.URL.lastIndexOf("/")+1)+'itemsearchenter';
    $('.typeahead').on('typeahead:selected', function(evt, item) {
    // item has value ; item.value
        var searchtxt = this.value;  
        propostAjax('products', searchtxt, itemhost ,'POST', 'itemsearch||selection||all||items', 1, {'limit':itemdatalimit,});    
            });
    
    
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
    
    // let prows = JSON.parse(rawprows); // party rows;
    // let itemrows = JSON.parse(rawitemrows);
    var amt = 0
    var cgst = 0
    var tdisamt = 0
    var netamt = 0
    for(let idcount=0; idcount<itemrows.length; idcount++) {
        var astr = '<tr><td><button id='+idcount+'_incbtn'+' name="addbtn" style="width:30px" onclick="appendRow()">+</button></td>'+
        '<td><label id='+idcount+'_sno'+' name="sno" class="rmslabelwidth0" >'+idcount+'</label></td>'+
        '<td><input id='+idcount+'_itemsearch'+' name="typeahead" class="typeahead" autocomplete="on" spellcheck="false" '+
        ' placeholder="Items Name" onkeyup="onItemChange(event)" onfocus="onItemSearchFocus(event)" value="'+itemrows[idcount].name+'"></td >'+
        '<td><label id='+idcount+'_pack'+' name="pack" class="tdgridpacklabel0" >'+itemrows[idcount].pack+'</label></td >'+
        '<td><input type="text" id='+idcount+'_qty'+' name="qty" class="rmsqtyvalidate" placeholder="Qty" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idcount].qty+'" ></td >'+

        '<td><input type="text" id='+idcount+'_batchno'+' name="batchno" class="typeahead" placeholder="Batch" value="'+itemrows[idcount].batchno+'" '+
        ' onfocus="getFocusedID(event)" style="width:80px" ></td >'+

        '<td><input type="text" id='+idcount+'_bonus'+' name="bonus" class="bonusvalidate" placeholder="Bonus" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idcount].bonus+'" ></td >'+
        '<td><input type="text" id='+idcount+'_rate'+' name="rate" class="rmsgridfloatval" placeholder="Rate" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idcount].rate+'" ></td >'+
        '<td><input type="text" id='+idcount+'_dis'+' name="dis" class="rmsgriddiscount" maxlength="4" placeholder="Discount" '+
        ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" value="'+itemrows[idcount].dis+'" ></td >'+
        '<td><input type="text" id='+idcount+'_amt'+' name="amt" class="gridamtlabel1" placeholder="0.00" '+
        ' onfocus="getFocusedID(event)" value="'+itemrows[idcount].amt+'" readonly ></td >'+
        '<td><label id='+idcount+'_tax'+' name="tax" class="tdgridlabel" >'+itemrows[idcount].tax+'</label></td >'+
        '<td><label id='+idcount+'_netrate'+' name="netrate" class="tdgridlabel" >'+itemrows[idcount].netamt+'</label></td ></tr>';

        amt +=parseFloat(itemrows[idcount]["amt"])  
        cgst +=parseFloat(itemrows[idcount]["cgst"])
        tdisamt +=parseFloat(itemrows[idcount]["tdisamt"])
        netamt +=parseFloat(itemrows[idcount]["netamt"])
        document.getElementById("itembox").insertRow(-1).innerHTML += astr;
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
    var batchno = "";
    var batchstk = "0";
    
    $.ajax({
        url: seturl,
        type: gptype,
        data: {name:name,searchtxt:searchtxt, idf:idf, limit:keyc, info:info},
        dataType: 'json',
        success: function(result) {
            if(result.length > 0){
                totstk = 0;
                dbstkarray = result[0]['stockarray'];
                if(dbstkarray.length > 0){
                    for(var i=0; i<dbstkarray.length; i++) {
                        totstk += dbstkarray[i]["qty"];
                    }

                    batchno = dbstkarray[0]["batchno"]; //geting recent/latest batch so, force to zero index 
                    batchstk = dbstkarray[0]["qty"]; //geting recent/latest batch so, force to zero index 
                }else{
                    document.getElementById("statusinfo").innerHTML = " NO Previous Stock Found ! "
                    document.getElementById("statusinfo2").innerHTML = " This will Add Stock ! "
                }
                
                recdic['grid'][idcount] = result[0]; 
                recdic['grid'][idcount]["totstk"]=totstk;
                recdic['grid'][idcount]["batchno"]=batchno;
                recdic['grid'][idcount]["batchstk"]=batchstk;
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

                StatusInfoDp(result[0], totstk, "0.00", "0.00");
                
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
        var dbbillno = result[0]["billno"];
        if (dbbillno){
            var bn = parseInt(dbbillno.split(bstartstring)[1])+1;  
            var bnstr = ('00000'+bn).slice(-5);
            billno = bstartstring+bnstr;
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
    
    if(typeof recdic['grid'][idcount] == 'undefined'){
        document.getElementById("statusinfo").innerHTML = "";
        document.getElementById("statusinfo2").innerHTML = "";
    }else{
        var stkarray;
        var rgi = recdic['grid'][idcount];
        var gstamt = rgi["ttaxamt"];
        var disamt = rgi["tdisamt"];
        var stkvar = rgi["stkvar"];
        if(typeof gstamt == 'undefined'){
            gstamt = 0.0;
            disamt = 0.0;
            stkvar = 0;
        }
        if (typeof recdic['grid'] === "string"){
            var grid = JSON.parse(recdic['grid']) ;
            recdic['grid'] = grid;
            rgi = grid[idcount];
            //console.log(rgi);
            //0->Index = ExpDate; 1->Index = stockQty(batch wise); 2->Index = stockID; 
            stkarray = rgi["sstk"].split("_"); 
            recdic['grid'][idcount]["stockid"]=stkarray[2];
            recdic['grid'][idcount]["totstk"]=stkarray[1];
            recdic['grid'][idcount]["batchstk"]=stkarray[1];
            recdic['grid'][idcount]["stkvar"]=stkarray[1]; 
            gstamt = rgi["ttaxamt"];
            disamt = rgi["tdisamt"];
            stkvar = stkarray[1];
            
        }
        if(typeof stkvar == 'undefined'){
            stkarray = rgi["sstk"].split("_"); 
            recdic['grid'][idcount]["stockid"]=stkarray[2];
            recdic['grid'][idcount]["totstk"]=stkarray[1];
            recdic['grid'][idcount]["batchstk"]=stkarray[1];
            recdic['grid'][idcount]["stkvar"]=stkarray[1]; 
            stkvar = stkarray[1];
        }
        StatusInfoDp(rgi, stkvar, gstamt, disamt);
        
     }
 }

function StatusInfoDp(rgi, stkvar, gstamt, disamt){
    //if (isNaN(disamt)){disamt = 0;}
    
    gstamt = parseFloat(gstamt).toFixed(2);
    disamt = parseFloat(disamt).toFixed(2);
    document.getElementById("statusinfo").innerHTML = "Bat: "+rgi["batchno"]+" Bat-Qty:"+rgi["batchstk"]+" Total Stock: "+stkvar;
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