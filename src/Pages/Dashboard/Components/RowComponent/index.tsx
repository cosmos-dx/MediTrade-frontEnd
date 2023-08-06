import React, { useContext,useState, useEffect, useRef } from 'react';
import './row-style.css';
import ItemInputHandler from '../../../Dashboard/Components/InputHandler';
import {UserDataContext} from "../../../../context/Context";


export default function Index({  deleteHandler, id,  cs, addNewRow}) {
  
  const userContext = useContext(UserDataContext);

function isMyNumber(value) {
  return /^-?\d*$/.test(value);
}
function isValidateBonus (value){
    return /^(?!.*\++.*\+)[0-9 +]*$/i.test(value); 
}
function isRateDisValidate(value){
  return /^-?\d*[.,]?\d*$/.test(value); 
}
function SetExp(value) {
  return /^[0-9 /]*$/i.test(value); }
function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the entirety of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
function getBonus(bonus){
  var bbool = false; // true when bonus in Integer value; false when bonus in netvalue format like 10+2;
  var b = ["0",""]
  if(!isNumeric(bonus)){
    b = bonus.split("+").map(Number);
  }
  
  var intbonus = 0
  var b1 = b[0]
  var b2 = b[1]
  
  if (Number.isNaN(b1)){
      b1 = 0;
      intbonus = b[0]; 
      bbool = false; }
  if (b1 === 0) {b1 = 0;
      intbonus = 0;
      bbool = true; }
  if (b2 === undefined) {b2 = 0;
      intbonus = parseInt(b[0]);
      bbool = true; }
  if (isNumeric(b[0])){
      bbool = true;
      intbonus=parseInt(b[0]);
      b1 = parseInt(bonus);
      b2 = 0;}    
  
  return [bbool, intbonus, b1, b2]; 
}
function gridCalculation (rawqty, bonus , rawrate, rawdis,  updatedRowData , id) {

  if(isNaN(rawqty)){
    console.log("ismei aya qty NaN mei");
    
  }
  var rawtax = RenderGridValue('gst');
  if(typeof(rawqty) === undefined || NaN) return [0 , 0, 0,  0, 0, 0, 0]
  
  var qty = parseInt(rawqty);
  var tqty = 0;
  var rate = parseFloat(rawrate);
  var dis = parseFloat(rawdis);
  var tax = parseFloat(rawtax);
  if(isNaN(qty)) qty = 0;
  if(isNaN(rate)) rate = 0.0;
  if(isNaN(dis)) dis = 0.0;
  if(isNaN(tax)) tax = 0.0;

  // console.log(">>>>>> rate >>> ",rate);

  var [bbool, intbonus, bonus1 , bonus2] = getBonus(bonus); 
  // bbool ===>>> example bonus given on 10 qty(2 two is bonus and 10+2 is net)
  // difference ===>>> (1) when given free coustomer has to buy 10 qty
  // (2) when given net(10+2) customer can buy any qty * rate will reduce accordingly
  // So, We have to verify which form/type of bonus given by billing operator/user

  var netBonus = false;
  var amtv,disamt,taxableamt,taxamt,netrate,totalamt,sgstamt,cgstamt;

  if(bbool){ //bbool true when bonus is int else string(10+2)
    amtv = rate*qty;
    tqty =  qty + parseInt(bonus1);
  }
  else{
    tqty = qty
    amtv = parseFloat((rate*bonus1)/(bonus1+bonus2)*qty);
  }
  var balstk =0
  if(cs === "supplier"){
    balstk = RenderGridValue("totstk")+tqty;
  }
  else{
    console.log(RenderGridValue("totstk"), tqty);
    console.log(typeof(RenderGridValue("totstk")), typeof(tqty));
    
    balstk = RenderGridValue("totstk")-tqty;
  }
  document.getElementById('statusinfo').innerHTML = `BALANCE STOCK : ${balstk}`; 

  if(isNaN(qty)) dis = 0;
  disamt = amtv * (dis/100)
  taxableamt = amtv-disamt;

  taxamt = taxableamt*(tax/100);
  
  
  totalamt = taxableamt+taxamt;
  netrate = totalamt/qty;
  if(isNaN(netrate)){
    netrate = 0;
  }
  sgstamt = cgstamt = taxamt/2;

  UpdateGridValue('tdisamt', parseFloat((disamt).toFixed(2)));
  UpdateGridValue('amt', parseFloat((taxableamt).toFixed(2)));
  UpdateGridValue('amttot', parseFloat((totalamt).toFixed(2)));
  UpdateGridValue('ttaxamt', parseFloat((taxamt).toFixed(2)));
  UpdateGridValue('netamt', parseFloat((netrate*qty).toFixed(2)));
  UpdateGridValue('sgst', parseFloat((sgstamt).toFixed(2)));
  UpdateGridValue('cgst', parseFloat((cgstamt).toFixed(2)));
  UpdateGridValue('netrate', parseFloat((netrate).toFixed(2)));
  UpdateGridValue('tqty', tqty);

      updatedRowData[id]['qty'] = qty;
      updatedRowData[id]['tqty'] = tqty;
      updatedRowData[id]['prate'] = rate;
      updatedRowData[id]['dis'] = dis;
      updatedRowData[id]['tdisamt'] = (disamt).toFixed(2);
      updatedRowData[id]['amt'] = (taxableamt).toFixed(2);
      updatedRowData[id]['amttot'] = (totalamt).toFixed(2);
      updatedRowData[id]['rate'] = rate;
      updatedRowData[id]['gst'] = tax;
      updatedRowData[id]['ttaxamt'] = (taxamt).toFixed(2);
      updatedRowData[id]['netamt'] = (netrate*qty).toFixed(2);
      updatedRowData[id]['netrate'] = (netrate).toFixed(2);
      updatedRowData[id]['sgst'] = (sgstamt).toFixed(2);
      updatedRowData[id]['cgst'] = (cgstamt).toFixed(2);
      updatedRowData[id]['bonus'] = bonus;
  
  let total = 0;
  let ccgst = 0;
  let ssgst = 0;
  let ggst = 0;
  let amt = 0;
  let tdis = 0;
  let netamt = 0;
  let roundoff = 0;
  let roundnetamt = 0;
  for (const obj of Object.values(updatedRowData)) {
    netamt += parseFloat(obj.netamt)
    total += parseFloat(obj.amttot || 0);
    ccgst += parseFloat(obj.cgst || 0);
    ssgst += parseFloat(obj.sgst || 0);
    ggst += parseFloat(obj.ttaxamt || 0);
    amt += parseFloat(obj.amt || 0);
    tdis += parseFloat(obj.tdisamt || 0);
  }
  
  roundnetamt = netamt.toFixed(0);
  roundoff  = parseFloat(roundnetamt) - netamt;
  
  
  for (const[k, v] of Object.entries({"gtot": netamt, "cgst" : ccgst, "sgst": ssgst, "ttaxamt" : ggst, 
  "tsubtot": amt, "tamt":total, "tdisamt":tdis, "roundoff" : roundoff }))
  {
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan , [k] : v},},}))

  }
  return [totalamt , netrate, disamt,  taxamt, taxableamt, sgstamt, cgstamt];
  
}

const RenderGridValue = (k) => {  
  return userContext.store.recdic.grid[id][k];
}

const UpdateGridValue = (key, value) => {
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid: {...ps.recdic.grid ,
                                   [id] : {...ps.recdic.grid[id],[key]:value}},},}))
}


const rowdatahandler = (myHandlerObj, val, data, eventType) => {
  if(data){
    for(const[ k, v] of Object.entries(data)){
      UpdateGridValue(k,v);
      if(cs === "customer"){
        if(k === "srate") UpdateGridValue("rate", parseFloat(v));
      }
      else if(k === "prate") UpdateGridValue("rate", parseFloat(v));

      if(data["stockarray"].length > 0){
        let totalstk = 0;
        for(let i =0; i< data["stockarray"].length; i++){
          if(data["stockarray"][i]["qty"]){
            totalstk +=  parseInt(data["stockarray"][i]["qty"]);
          }
        }
       
        
        UpdateGridValue("totstk", totalstk);
        UpdateGridValue("stockid", data["stockarray"][0]["stockid"]);
        UpdateGridValue("expdate", data["stockarray"][0]["expdate"]);
        UpdateGridValue("batchno", data["stockarray"][0]["batchno"]);

      }
      else{
        UpdateGridValue("stockid", null);
        UpdateGridValue("totstk", 0);
      }
    }
    if(eventType === "select") {
      document.getElementById(id+ '_qty')?.focus();
    }
    
  }
   
};


function OnFocusInput(e){
  const id_num = parseInt(e.target.id.split('_')[0]);
  document.getElementById("statusinfo").innerHTML = `S.No: ${userContext.store.recdic.grid[id_num]["sno"]}; 
  HSN: ${userContext.store.recdic.grid[id_num]["hsn"]}; Item-Name: ${userContext.store.recdic.grid[id_num]["name"]};
  MRP: ${userContext.store.recdic.grid[id_num]["mrp"]}; UNIT: ${userContext.store.recdic.grid[id_num]["unit"]}; 
  GROUP: ${userContext.store.recdic.grid[id_num]["igroup"]};`
}
  const FocusForAllRowComponent = (e) => {
    // console.log(e ," " ,id);
  
    //////////////////////////////////////// change approach 
    
    const relayFocus = {
      "_qty" : "_batchno",
      "_batchno" : "_bonus",
      "_bonus" : "_rate",
      "_rate" : "_dis",
      "_dis" : "_exp",
    }

    const myFocuskey = e.keyCode || e.which;
    let value = e.target.value;
    
    if(myFocuskey === 13||myFocuskey === 35||myFocuskey === 9){    //on Enter
        if(value){
          let newId = relayFocus["_"+e.target.id.split('_')[1]];     // getting id with half id ex "_batchno"
          newId = id + newId;          
          document.getElementById(newId)?.focus();
        }
        if (e.target.id === id+"_exp") {
          UpdateGridValue("expdate",expDateValidation(value));
          id = id+1;
          document.getElementById(id +"item-grid")?.focus();
          addNewRow(); 
        }

    }
  }
  function expDateValidation(val){
    
    
    let newval = "01/01";
    let [mm,yy]=val.split("/");
    if(yy.trim().length == 0){
      newval = defaultExpDate();
      return newval;
    }    
    if(parseInt(mm)>12){
        newval = defaultExpDate();
    }else{newval = val}
    if(parseInt(yy)<10){
        newval = mm+"/"+yy+"0";
    }
    console.log("expvald --- ",newval);
    return newval;
  }  
  function defaultExpDate() {
    let dtt = new Date();
    var mymm = (dtt.getMonth()+1).toString();
    if (mymm < 10){mymm = '0' + mymm};
    return mymm+"/"+(dtt.getYear()-100).toString();
    }

  
function onExpDateChnage (e){
  let val = e.target.value;
  console.log(val);
  
    if(SetExp(val)){
        let monthFs = val.slice(0,1);
        let monthSs = val.slice(0,2);
        let dtS = val.slice(2,3);
        if(parseInt(monthFs)>1){val = "0"+monthFs+"/";}
        if(parseInt(monthSs)>12){val = monthFs+"2/";}
        if (val.length===1){
            if(monthFs===" "){val = defaultExpDate();}
        }
        if (val.length===2){val=val+"/"}
         if (val.length===3){
             if(val.slice(2,3)!=="/"){
                if(!isNaN(dtS)){val = monthSs+"/";}
                }
         }
        if (val.length===4){
            if(val.slice(3,4)===" "){val = monthSs+"/30";}
            if(val.slice(3,4)==="/"){val = monthSs+"/30";}
        }
        if (val.length===5){
            if(val.slice(4,5)===" "){val = monthSs+"/"+val.slice(3,4)+"0";}
        }
        const seperatorLength = (val.match(new RegExp("/", "g")) || []).length ;
        if(seperatorLength>1){val = defaultExpDate();}
        // ** set expdate to grid store "updateGridValue"  ** //
        UpdateGridValue("expdate", val)
    }
}
function handleFieldChange(field, value) {

    
  if (field === 'qty') {
      if(isMyNumber(value)) {
        if(value.trim() === "")value = "0";       
      
      const updatedRowData = {...userContext.store.recdic.grid, [id]: {...userContext.store.recdic.grid[id], [field]: parseInt(value), },};
      UpdateGridValue(field, parseInt(value));
      gridCalculation(value, RenderGridValue('bonus'), RenderGridValue('rate'), 
      RenderGridValue('dis'),  updatedRowData, id );
  
  }
}
else if (field === 'bonus') {
  if (isValidateBonus(value)) {

    const updatedRowData = {...userContext.store.recdic.grid, [id]: {...userContext.store.recdic.grid[id], [field]: value, },};
    UpdateGridValue(field, value);
    gridCalculation(RenderGridValue('qty'), value, RenderGridValue('rate'),
     RenderGridValue('dis'), updatedRowData, id );
  }
}
else if (field === 'batchno') {
  const updatedRowData = {...userContext.store.recdic.grid, [id]: {...userContext.store.recdic.grid[id], [field]: value, },};
    UpdateGridValue(field, value);
    gridCalculation(RenderGridValue('qty'), value, RenderGridValue('rate'),
     RenderGridValue('dis'),updatedRowData, id );
}
else if (field === 'rate') {
  if (isRateDisValidate(value)) {
    if(value.trim() === "")value = "0";       
    const updatedRowData = {...userContext.store.recdic.grid, [id]: {...userContext.store.recdic.grid[id], [field]: parseFloat(value), },};
    UpdateGridValue(field, parseFloat(value));
    gridCalculation(RenderGridValue('qty'), RenderGridValue('bonus'), value, 
    RenderGridValue('dis'),  updatedRowData, id );
  }
}
else if (field === 'dis') {
    
    if (isRateDisValidate(value)) {
      if(value.trim() === "")value = "0";     
      const updatedRowData = {...userContext.store.recdic.grid, [id]: {...userContext.store.recdic.grid[id], [field]: parseFloat(value), },};
      UpdateGridValue(field, parseFloat(value));
      gridCalculation(RenderGridValue('qty'), RenderGridValue('bonus'), 
      RenderGridValue('rate'), value, updatedRowData, id );
  }
}
else {
  UpdateGridValue(field, value);
}
}

function mrpgenerate() {
  if (cs === "supplier" ) {
    return (
      <input
      type="text"
      id= {id+ '_mrp'}
      value={RenderGridValue('mrp')}
      placeholder="mrp"
      onFocus={OnFocusInput}
      onKeyDown={FocusForAllRowComponent}
      onChange={(event) => handleFieldChange('mrp', event.target.value)}
    />
    );
  } 
}


  return (
    <div className="table-row">
      <button className="delete-row" onClick={deleteHandler}>
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>

      <ItemInputHandler
      key ={`inputHandler_${cs}`}
      id= {id+"item-grid"}
        myobj={{
          id: id,
          page: "spbill",
          info: 'Item Name',
          idf: 'items',
          colname: 'name',
          limit: '5',
          action: 'search',
          cs: cs,
          links: `${userContext.api}/itemsearchenter?`,
          provided_data: 'name',
          widthstyle: '1',
          itemname: userContext.store.recdic.grid[id]['name'] || "",
        }}
        rowdatahandler={rowdatahandler}
      />

     
        <span className="pack-field">{RenderGridValue('pack')}</span>
        <input
          type="text"
          id= {id+ '_qty'}
          value={RenderGridValue('qty')}
          placeholder="qty"
          onFocus={OnFocusInput}
          onKeyDown={FocusForAllRowComponent}
          onChange={(event) => handleFieldChange('qty', event.target.value)}
        />
        {/* <input
          type="text"
          value={(rowData[id]['stockarray'] && rowData[id]['stockarray'][0]?.batchno) || ''}
          onChange={(event) => handleFieldChange('batch', event.target.value)}
        /> */}

        <input
          type="text"
          id= {id+ '_batchno'}
          onFocus={OnFocusInput}
          value={RenderGridValue('batchno')}
          onKeyDown={FocusForAllRowComponent}
          onChange={(event) =>  handleFieldChange('batchno', event.target.value)}
        />
        <input
          type="text"
          placeholder="bonus"
          id= {id+ '_bonus'}
          value={RenderGridValue('bonus')}
          onFocus={OnFocusInput}
          maxLength= "5"
          onKeyDown={FocusForAllRowComponent}
          onChange={(event) => handleFieldChange('bonus', event.target.value)}
        />
        <input
          type="text"
          id= {id+ '_rate'}
          placeholder="rate"
          value={RenderGridValue("rate")}
          onFocus={OnFocusInput}
          onKeyDown={FocusForAllRowComponent}
          onChange={(event) => handleFieldChange('rate', event.target.value)}
        />
        {mrpgenerate()}
        <input
          type="text"
          maxLength= "5"
          placeholder="discount"
          value={RenderGridValue('dis')}
          id= {id+ '_dis'}
          onFocus={OnFocusInput}
          onKeyDown={FocusForAllRowComponent}
          onChange={(event) => handleFieldChange('dis', event.target.value)}
        />
        
        {/* <span>
        {rowData[id]['amt']}
        </span> */}
        <input
          type="text"
          placeholder="0.00"
          id= {id+ '_amt'}
          onFocus={OnFocusInput}
          value={RenderGridValue('amt')}
          readOnly
          // onChange={(event) => handleFieldChange('amt', event.target.value)}
        />
        <input
          type="text"
          placeholder="mm/yy"
          value={RenderGridValue('expdate')}
          id= {id+ '_exp'}
          onFocus={OnFocusInput}
          onKeyDown={FocusForAllRowComponent}
          onChange={onExpDateChnage}
          // onChange={(event) => handleFieldChange('expdate', event.target.value)}
        />
        <span className="gst-field" id= {id+ '_gst'} >{RenderGridValue('gst')}</span>
        <input
          type="text"
          placeholder="0.00"
          id= {id+ '_netrate'}
          onFocus={OnFocusInput}
          value={RenderGridValue('netrate')}
          readOnly
        />

        
  
    </div>
  );
}
