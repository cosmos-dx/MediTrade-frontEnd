
function datedbtoExp(strtxt){ var [yy, mm, dd] = strtxt.split('-'); return mm+'/'+yy.slice(2,4); }
   
function datetodbExp(strtxt){ var [mm, yy] = strtxt.split('/'); return '01-'+mm+'-20'+yy; }

function datemytodbDate(strtxt){ var [dd, mm, yyyy] = strtxt.split('/'); return dd+'-'+mm+'-'+yyyy; }

function datedbtomyDate(strtxt){ var [yyyy, mm, dd] = strtxt.split('-'); return dd+'/'+mm+'/'+yyyy; }

function findDevice(dvid){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {dvid=2}
    else {dvid=1}
    return dvid ;
    }

function jsonformater(value) {
  return value.replace(/&#34;/g, '"');
}

function POSDICT(){
    const posdict = {'01':'Jammu And Kashmir','02':'Himachal Pradesh','03':'Punjab','04':'Chandigarh','05':'Uttarakhand','06':'Haryana',
    '07':'Delhi','08':'Rajasthan','09':'Uttar Pradesh','10':'Bihar','11':'Sikkim','12':'Arunachal Pradesh',
    '13':'Nagaland','14':'Manipur','15':'Mizoram','16':'Tripura','17':'Meghalaya','18':'Assam','19':'West Bengal','20':'Jharkhand',
    '21':'Odisa','22':'Chattisgarh','23':'Madhya Pradesh','24':'Gujarat','25':'Daman and Diu','26':'Dadar and Nagar Haveli',
    '27':'Maharashtra','28':'Andra Pradesh','29':'Karanataka','30':'Goa','31':'Lakshwadeep','32':'Kerala','33':'Tamil Nadu',
    '34':'Punducherry','35':'Andaman and Nicobar Island','36':'Telangana','37':'Andra Pradesh(New)', 15:true,
    'C':'COMPANY', 'P':'PERSON', 'H':'HUF', 'F':'FIRM', 'A':'(AOP)', 'T':'AOP(TRUST)','B':'(BOI)','L':'LOCAL AUTHORITY',
    'J': 'JURIDICAL PERSON', 'G':'GOVERNMENT', 'true':('Writing..','blue'), 'false':('Wrong Input','red'), }
    return posdict;}

function checkgstn(g){
    let regTest = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(g)
     if(regTest){
        let a=65,b=55,c=36;
        return Array['from'](g).reduce((i,j,k,g)=>{ 
           p=(p=(j.charCodeAt(0)<a?parseInt(j):j.charCodeAt(0)-b)*(k%2+1))>c?1+(p-c):p;
           return k<14?i+p:j==((c=(c-(i%c)))<10?c:String.fromCharCode(c+b));
        },0); 
    }
    return regTest
}

function GstinChker(gnumber){
    let gstVal = gnumber.toUpperCase();
    let firstmess = "";
    let secondmess = "";
    let eMMessage = "No Errors";
    let statecode = gstVal.substring(0, 2);
    let cpfind = gstVal.substring(5, 6);   // company person firm finder
    let patternstatecode=/^[0-9]{2}$/
    let threetoseven = gstVal.substring(2, 7);
    let patternthreetoseven=/^[A-Z]{5}$/
    let seventoten = gstVal.substring(7, 11);
    let patternseventoten=/^[0-9]{4}$/
    let Twelveth = gstVal.substring(11, 12);
    let patternTwelveth=/^[A-Z]{1}$/
    let Thirteen = gstVal.substring(12, 13);
    let patternThirteen=/^[1-9A-Z]{1}$/
    let fourteen = gstVal.substring(13, 14);
    let patternfourteen=/^Z$/
    let fifteen = gstVal.substring(14, 15);
    let patternfifteen=/^[0-9A-Z]{1}$/


    if (isNaN(statecode)){
          firstmess='[WRONG - First Two Characters Must be a numbers 01 t0 37]';
          eMMessage = "[ Wrong ]"
        }
    else {
          firstmess=posdict[statecode];
          
          if (firstmess===undefined){firstmess='N.A'}
        }
    if (cpfind !== ''){
        secondmess=posdict[cpfind];
        if (secondmess===undefined){secondmess='[ Wrong ]'}
        }
    
    if (gstVal.length != 15) {
        eMMessage = '...';
            
    }else if (!patternstatecode.test(statecode)) {
        eMMessage = '[ WRONG ]';
        
    }else if (!patternthreetoseven.test(threetoseven)) {
        eMMessage = '[ Third to seventh characters of GSTIN should be alphabets ]';
        
    }else if (!patternseventoten.test(seventoten)) {
        if (isNaN(seventoten)){eMMessage='[ 8 to 11 characters Must be Numbers Only ] ';}
        else{eMMessage=''}
        
    }else if (!patternTwelveth.test(Twelveth)) {
        if (isNaN(Twelveth)){eMMessage=' [ 12th characters should be alphabet ] '}
        else{eMMessage=''}
        
    }else if (!patternThirteen.test(Thirteen)) {
        eMMessage = '[ Wrong ]';
        
    }else if (!patternfourteen.test(fourteen)) {
        eMMessage = '[ Wrong ]';
        
    }else if (!patternfifteen.test(fifteen)) {
        eMMessage = 'fifteen characters of GSTIN can be either alphabet or numeric';   
    }
    
    if (seventoten !== ''){
        if (isNaN(seventoten)){eMMessage='[ 8 to 11 characters Must be Numbers Only ]';}
        else{eMMessage=''}
        }

    if (Twelveth !== '')
       if (isNaN(Twelveth)){eMMessage=''}
        else{eMMessage='[ Wrong ]'}

    return firstmess+' - '+secondmess+' - '+eMMessage;
}

function GST_Intra_Inter_State(ownergst, partygst){
    let o = ownergst.slice(0,2);
    let p = partygst.slice(0,2);
    let interstate = false;
    let itype = '1' ; // default for party NOT has gst; if party has GST = 2; 8 = purchase return; 9= sales return; 7=Credit Note 
    if (partygst.length==0){itype = '1';}
    else{itype ='2';} // has GST Number
    // for goods return ans credit note this must be override later;
    document.getElementById("esti").value='M';
    if (o==p){interstate = false;}
    else{interstate = true;
        document.getElementById("esti").value='I';
        }
    return {'interstate':interstate, 'itype':itype};
    
};

function statusInfo (info, clr, weight, wdgid='#statusinfo'){
  $(wdgid).html(info)
  $(wdgid).css('color', clr);
  //$(wdgid).css('font-weight', weight);
  //$(wdgid).css('margin-left', '-100px');
  }
  
function getAmount(qty, rate, bbv=true, b1=1, b2=0){
    var amt = 0;

    if (bbv){amt = qty*rate}
    else{amt = ((rate*b1)/(b1+b2))*qty}    // net given like 10+2
    return amt    
    }
function getDiscAmt(amt, dis){
    if (Number.isNaN(dis)){dis = 0;}
   
    var discountamount = ((amt*(100-dis))/100.0);
    return [amt-discountamount, discountamount];}

// [1, 2, 3, 4].reduce((a, b) => a + b, 0) 
// default 0 required for first number of array; otherwise raise TypeError

function getTaxAmt(amt, tax, discamt){
    var amt_discamt = amt-discamt;
    var amtaftertax = (amt_discamt*(100+tax)/100.0);
    var taxamt = amtaftertax-amt_discamt
    return [taxamt, amtaftertax] ; }
 //return ((amt-discamt)*(100+tax)/100.0)-(amt-discamt) ; }
//function amtAfterTax(amt, tax){return (amt*(100+tax)/100.0) ; } // OR NetAmt

function getBonus(bonus){
    var bbool = false; // true when bonus in Integer value; false when bonus in netvalue format like 10+2;
    var b = bonus.split("+").map(Number);
    var intbonus = 0
    var b1 = b[0]
    var b2 = b[1]
    
    if (Number.isNaN(b1)){
        b1 = 1;
        intbonus = b[0]; 
        bbool = false; }
    if (b1 === 0) {b1 = 1;
        intbonus = 0;
        bbool = true; }
    if (b2 === undefined) {b2 = 0;
        intbonus = parseInt(b[0]);
        bbool = true; }
    if (isNumeric(b[0])){
        bbool = true;
        intbonus=parseInt(b[0]);
        b1 = 1;
        b2 = 0;}    
    
    return [bbool, intbonus, b1, b2]; }

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
function getQty(qty, bonus){
    var b = getBonus(bonus);
    var b1 = b[0];
    var tqty = qty+b1;
    return tqty; 
}

function onExp(evt){
    var expdate = evt.target.value;
    console.log("validate expiry herre in properformat rmsheader line 205 ");
    recdic['grid'][idcount]['expdate']=expdate;
}


function onBatchUpdate(evt){
    var batchno = evt.target.value.toUpperCase();
    if (typeof(recdic['grid'][idcount])=="undefined"){return}
    if (batchno.trim()==""){$("div[list]").hide();return;}
    recdic['grid'][idcount]['batchno']=batchno;
    var stockarray = recdic["grid"][idcount]["stockarray"];
    $("#"+idcount+"_batlist").empty();
    var showflag = true;
    var val=evt.target.value;
    var n=idcount+"_batlist"
    var a=$("div[list="+n+"]");
    for (i = 0; i < stockarray.length; i++){
        var batno = stockarray[i]["batchno"];
        var expdt = stockarray[i]["expdate"];
        var qtyn = stockarray[i]["qty"];
        var valdata = batno+","+expdt+","+qtyn
        var dpdata = "Bat: "+batno+" Exp: "+expdt+" Qty: "+qtyn;
        if(batchno.length < 2){
            $(a[0]).append("<span id='"+i+"' id='"+i+"' data-reference="+valdata+" >"+dpdata+"</span>")
        }
        else{
            if(batno.startsWith(batchno)){
                $(a[0]).append("<span data-id='"+i+"' id='"+i+"' data-reference"+valdata+" >"+dpdata+"</span>")
            }
        }
     }
     $("div[list="+n+"]").show(100);    
}

function onBatchSelect(idc, batid, batlist, expid){
    var batcharray = ["ABCD","EFGHHH"];
    var batid=idcount+"_batlist";
    var batlist=$("div[list="+batid+"]");
    var ebat="#"+idcount+"_bat";
    var nbatlist="#"+idcount+"_batlist";
    
    $(nbatlist).on("click","span",function(nbatlist){
        nbatlist.preventDefault();
        //var s=this.id;
        var getid =this.id;
        var batarray=$(this).html().split(':');
        var selectedarray =document.getElementById(getid).getAttribute('data-reference').split(',');
        var selectedqty = selectedarray[2];
        var selectedexp = selectedarray[1];
        var selectedbatch = selectedarray[0];

        $("#"+idcount+"_batchno").val(selectedbatch);
        $(expid).val(selectedexp);
        recdic['grid'][idcount]['batchno']=selectedbatch;
        recdic['grid'][idcount]['expdate']=selectedexp;
        $("div[list]").hide();
    })
}
function onQtyCalculation(evt){
    if (typeof(recdic['grid'][idcount]) == "undefined"){
        CreateAlertDiv("Item Name Not Selected OR Page Re-Loaded !! Select Item First !! ");
        document.getElementById(idcount+'_itemsearch').value = '';
        document.getElementById(idcount+'_itemsearch').focus();
        return;
    }
   
    var rate =  parseFloat($('#'+idcount+'_rate').val());
    var qty = parseInt($('#'+idcount+'_qty').val()); //$('#'+idcount+'_qty').val(); 
    var tax = parseFloat($('#'+idcount+'_tax').html());
    var dis = parseFloat($('#'+idcount+'_dis').val());
    var rawbonus = $('#'+idcount+'_bonus').val();
    var bonuscheck = getBonus(rawbonus) 
    
    // bbool ===>>> example bonus given on 10 qty(2 two is bonus and 10+2 is net)
    // difference ===>>> (1) when given free coustomer has to buy 10 qty
    // (2) when given net(10+2) customer can buy any qty *** rate will reduce accordingly
    // So, We have to verify which form/type of bonus given by billing operator/user
    var bbool = bonuscheck[0]; 
    var bonus= bonuscheck[1];
    var b1 = bonuscheck[2];
    var b2 = bonuscheck[3];
    var tqty = qty+bonus;
     
    var amt = getAmount(qty, rate, bbool, b1, b2) //never add total or qty+bonus in getAmount;

    if (Number.isNaN(amt)){amt = 0}
    else{amt = amt}

    var disc_ = getDiscAmt(amt, dis); //disc_[0] << is discaount value; disc_[1] << is amount after discount
    
    var tax_ = getTaxAmt(amt, tax, disc_[0]);
    var netamt = tax_[1];
    var netrate = netamt/qty;
    var disamt = disc_[0];
    var amttot = disc_[1];
    var csgst = tax_[0]/2 ;
    var sgst = csgst.toFixed(2);
    

    $('#'+idcount+'_amt').val(amttot.toFixed(2));
    $('#'+idcount+'_netrate').html(netrate.toFixed(2));   
    
    if (isNaN(dis)){dis = 0;}
    var batchno = $('#'+idcount+'_batchno').val().toUpperCase();
    recdic['grid'][idcount]['qty']=qty;
    recdic['grid'][idcount]['batchno']=batchno
    recdic['grid'][idcount]['bbool']=bbool;
    recdic['grid'][idcount]['bonus']=bonus;
    recdic['grid'][idcount]['tqty']=tqty;
    recdic['grid'][idcount]['rate']=rate;
    recdic['grid'][idcount]['dis']=dis;
    recdic['grid'][idcount]['tax']=tax;
    recdic['grid'][idcount]['amt']=amt.toFixed(2);  
    recdic['grid'][idcount]['tdisamt']=disamt.toFixed(2);  
    recdic['grid'][idcount]['ttaxamt']=tax_[0].toFixed(2); // GST Amount on Particular Item
    recdic['grid'][idcount]['cgst']=sgst;  // cgst and sgst always same half-half of GST amount
    recdic['grid'][idcount]['sgst']=sgst; 
    recdic['grid'][idcount]['amttot']=amttot.toFixed(2);
    recdic['grid'][idcount]['netrate']=netrate.toFixed(2);
    recdic['grid'][idcount]['netamt']=netamt.toFixed(2);
    // pnet >>> not prepaired yet 
    recdic['grid'][idcount]['pnet']=netrate; // << This is Purchase Net Should give only purchase item net on both sale and purchase
    recdic['grid'][idcount]['srate_a']="0.0" // << Store Secondery Rate if Required;
    let stkvar = 0;
    if (cs=="customer"){   

        stkvar = parseInt(recdic['grid'][idcount]['totstk'])-tqty
    }else{
        stkvar = parseInt(recdic['grid'][idcount]['totstk'])+tqty
    }
    recdic['grid'][idcount]['stkvar']=stkvar;
    let totnetamt = 0;
    let totamttot = 0;
    let totamt = 0;
    let tottaxamt = 0;
    let totdisamt = 0;
    let totcgst = 0;
    let totsgst = 0;
    
    for (const [key, value] of Object.entries(recdic['grid'])) {
        totnetamt += parseFloat(value.netamt);
        totamttot += parseFloat(value.amttot);
        totamt += parseFloat(value.amt);
        tottaxamt += parseFloat(value.ttaxamt);
        totdisamt += parseFloat(value.tdisamt);
        totcgst += parseFloat(value.cgst);
        totsgst += parseFloat(value.sgst);
        }
    
    let roundoff = 0.00;
    
    if(typeof totnetamt)
    if (typeof(totnetamt) == "number"){
        totnetamt = totnetamt
        roundoff = 0.00;
    }else{
        totnetamt = totnetamt.toFixed(2);
        roundoff = totnetamt - totnetamt.toFixed(0); 
        roundoff = roundoff.toFixed(2);
    }

    recdic['pan']['gtot']=totnetamt.toFixed(2);
    recdic['pan']['tsubtot']=totamttot.toFixed(2);
    recdic['pan']['tamt']=totamt.toFixed(2);
    recdic['pan']['ttaxamt']=tottaxamt.toFixed(2);
    recdic['pan']['tdisamt']=totdisamt.toFixed(2);
    recdic['pan']['cgst']=totcgst.toFixed(2);
    recdic['pan']['sgst']=totsgst.toFixed(2);
    recdic['pan']['roundoff']=roundoff;

    document.getElementById("gtot").innerHTML=totnetamt.toFixed(2);
    document.getElementById("tsubtot").innerHTML= totamttot.toFixed(2);
    document.getElementById("tamt").innerHTML=totamt.toFixed(2);
    document.getElementById("ttaxamt").innerHTML= tottaxamt.toFixed(2);
    document.getElementById("tdisamt").innerHTML= totdisamt.toFixed(2);
    document.getElementById("cgst").innerHTML=totcgst.toFixed(2);
    document.getElementById("sgst").innerHTML=totsgst.toFixed(2);
    document.getElementById("roundoff").innerHTML=roundoff;

    if (isNaN(stkvar)) {
     stkvar = parseInt(recdic['grid'][idcount]['totstk']);
    }
   
    StatusInfoDp(recdic['grid'][idcount], stkvar, tax_[0], disc_[0]);

        

    }

function RecdicPanFill(){
    let billdate = document.getElementById("billdate").value;
    let invdate = document.getElementById("invoicedate").value;
    let cscr = document.getElementById("cscr").value;
    let esti = document.getElementById("esti").value;
    let ddisc = document.getElementById("ddisc").value;
    let billno = document.getElementById("billno").value.toUpperCase();
    
    recdic['pan']['dbbilldate']=billdate;     
    recdic['pan']['dbinvdate']=invdate;
    recdic['pan']['billdate']=xdateFormat(billdate);     
    recdic['pan']['invdate']=xdateFormat(invdate);
    recdic['pan']['esti']=estidict[esti];
    recdic['pan']['ddisc']=ddisc;
    recdic['pan']['cscr']=cscr;
    recdic['pan']['dbcscr']=dbcscr[cscr];
    recdic['pan']['billno']=billno;
    
    };

function rmstoday(){return new Date().toISOString().substring(0, 10);}

function CreateAlertDiv(message){
    $('#alerts').append(
        '<div class="alert id="alertclosebtn" " >' +
            '<span class="alertclosebtn" onclick="alertMessDP()">' +           
            '&times;</span>' + message + '</div>');}

function alertMessDP(){

  var close = document.getElementsByClassName("alertclosebtn");
  
  close[0].parentElement.style.display = "none";

  var i;
  for (i = 0; i < close.length; i++) {

      close[i].onclick = function(){
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function(){ div.style.display = "none"; }, 600);
            }
        }
    }

function NumToWords(num) {
  var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ',
          'Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
}

