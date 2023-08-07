// import "./purchase.css";
import "../../../../assets/css/medi-styles.css";
import RowComponent from "../../Components/RowComponent";
import { useState, useContext, useRef, useEffect, ReactNode } from "react";
import rupeeSymbol from "./Indian-Rupee-symbol.svg";
import InputHandler from "../../Components/InputHandler";
import { Link, useNavigate } from "react-router-dom";
import {UserDataContext} from "../../../../context/Context";

const index = ({whichPage, idf}) => {
  console.log("check -- ",idf);
  
  const rowId = useRef(0);
  const navigateTo = useNavigate();
  const [inputHandlerKey, setInputHandlerKey] = useState(0);
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const userContext = useContext(UserDataContext);

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);
 

function resetStore(){
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: userContext.store.recdic.pantemplate,},}))
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["cscr"]: "CASH"},},}))
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["regn"]: ""},},}))
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["gstn"]: ""},},}))
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["add1"]: ""},},}))
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["add2"]: ""},},}))
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["mobile"]: ""},},}))
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["stcode"]: ""},},}))
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["email"]: ""},},}))
  let ac={"acname1":"" ,"acname2":"" ,"acname3":"" ,"acid1":0,"acid2":0,"acid3":0,"acval1":0,"acval2":0,"acval3":0,}
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, ac: userContext.store.recdic.ac,},}))
  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid: {[0] : userContext.store.recdic.itemtemplate},},}));

}

 const handleRowDeletion = (id) => {
    const  newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
    userContext.updateStore((ps) => {const newData = {...ps}; delete newData[id]; return newData;});
  };
  useEffect(() => {
    resetStore();   
    
  }, []);
  
  const [rows, setRows] = useState([{ id: 0 }]);
  const today = new Date().toISOString().split('T')[0];
  const incrementStringNumber = (str) => {
    const match = str.match(/([A-Za-z]+)(\d+)/);
    if (!match) {
      return str;
    }
    const prefix = match[1];
    let number = parseInt(match[2], 10);
    number++;
    const paddedNumber = String(number).padStart(match[2].length, '0');
    return prefix + paddedNumber;
  };
  const rowdatahandler = (myHandlerObj, val, data, eventType) => {
    if(data){
      for (const [key, value] of Object.entries(data)) {
        userContext.store.recdic.pan[key] = data[key];
      }
      if(eventType === "select"){
        if(whichPage === "purchase"){
          document.getElementById("billno")?.focus();
        }
        else {
          document.getElementById("cscr")?.focus();
          const billurl = `${userContext.api}/partysearchenter?name=customer&getcolumn=billno&limit%5Bbillhead%5D=S&limit%5Bfyear%5D=0&limit%5Bbillas%5D=M&idf=billnoset`;
          const fetchDataFromAPI = async () => {
            try {
              const response = await fetch(billurl);
              if (!response.ok) {
                throw new Error('API request failed');
              }
              return await response.json();
            } catch (error) {
              return null;
            }
          };
          const pendingBillno = fetchDataFromAPI();
          if(pendingBillno){
            pendingBillno.then((data) => {
              if(data){
                updateuserstorePandata('billno', incrementStringNumber(data[0]['billno']));
              }
              else {
                updateuserstorePandata('billno', "")
              }
            })
          }
        }
      }
    }
     
  };
  const FocusForAll = (e) => {

    const relayFocus = {
      "billno" : "cscr",
      "cscr" : "dis",
      "dis" : "billdate",
      "billdate" : "invdate",
      "invdate" : "0item-grid",
    }

    const myFocuskey = e.keyCode || e.which;
    let value = e.target.value;
    if(myFocuskey === 13||myFocuskey === 35||myFocuskey === 9){    //on Enter
        if(value){
          document.getElementById(relayFocus[e.target.id])?.focus();
        }
    }

  }

  const userContextPanstoreRender = (k) => {    
    return userContext.store.recdic.pan[k];
  }
  
  const updateuserstorePandata = (key, value) => {
    if(key === "billdate"){
      userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan , ["dbbilldate"] : value},},}))
    }
    if(key === "cscr"){
      if(value === "CREDIT"){
        userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan , ["dbcscr"] : 2},},}))
      }
      if(value === "CHALLAN"){
        userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan , ["dbcscr"] : 3},},}))
      }
      if(value === "CHALLAN"){
        userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan , ["dbcscr"] : 1},},}))
      }
    }

    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan , [key] : value},},}))
  }

  function onacdischange (e){
    if(e.target.id==="acname1"){
      userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, ac: {...ps.recdic.ac , [e.target.id] : e.target.value},},}))
      return;
    }
    if(/^-?\d*[.,]?\d*$/.test(e.target.value)){
        if(e.target.id === "dis") updateuserstorePandata('dis', e.target.value);
        else  userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, ac: {...ps.recdic.ac , [e.target.id] : e.target.value},},}))
      }
  }
  const addNewRow = () => {
    const newId = Math.max(...rows.map((row) => row.id)) + 1;
    setRows((prevRows) => [...prevRows, { id: newId }]);
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid:{...ps.recdic.grid, [newId]:userContext.store.recdic.itemtemplate,},},}));
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid:{...ps.recdic.grid, [newId]:{...ps.recdic.grid[newId], ["sno"]: newId},},},}));
    console.log(userContext.store.recdic);
    
  };
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
  
    return `${formattedDay}/${formattedMonth}/${year}`;
  }
  const onSaveButton = () => {
    let pan = userContext.store.recdic.pan;
  
    if (pan['_id'] === "" || pan['name'] === "" || pan['ledgid'] === 0 || pan['csid'] === 0) {
      alert("Enter Supplier Details");
      return;
    }
    if (pan['amount'] === 0 || pan['amt'] === "" || pan['tamt'] === "" || pan['gtot'] === "") {
      alert("Enter Items First");
      return;
    }
    if ((pan['amount'] === 0 || pan['amt'] === "" || pan['tamt'] === 0 || pan['gtot'] === "") ) {
      alert("Internal Error Reload Page");
      return;
    }
    if (userContextPanstoreRender('billno') === "") {
      alert("Enter Invoice Number");
      return;
    }
    
    const requestBody = {
      idf : idf,
      mode : "save",
      getdata: userContext.store.recdic,
    };
  
    fetch(`${userContext.api}/sendbilltodb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }).finally(resetStore())
      .catch(error => {
        console.log(error);
      });
  };

  const onCloseButton = () => {
    resetStore();
    navigateTo("/dashboard")
  }
  function headermrpgenerate(){
    if(idf=== "supplier"){
      return (
        <span>MRP</span>
      )
    }
  }
  return (
    <div className="purchase-section">
      <div className="purchase-header">
        <div className="purchase-input">
        <InputHandler
        key ={`inputHandler_${idf}`}
          myobj={{
            id: "spinput",
            page: "spbill",
            info: idf,
            idf: idf,
            colname: "name",
            limit: "10",
            action: "search",
            cs: idf,
            links: `${userContext.api}/partysearchenter?`,
            provided_data: "name",
            widthstyle: "1",
            itemname : userContext.store.recdic.pan['name'] || "",
          }}
          rowdatahandler={rowdatahandler}
        />
        </div>
        <div className="purchase-input">
          <input id="billno" placeholder="abcd" value={userContextPanstoreRender('billno')} 
            onKeyDown={FocusForAll}
           onChange={(event) => updateuserstorePandata("billno", event.target.value.toUpperCase())} type="text" />
          <label htmlFor="">Invoice</label>
        </div>
        <div className="purchase-input">
        <select id="cscr" name="transType" value={userContextPanstoreRender('cscr')} 
        onKeyDown={FocusForAll} 
        onChange={(event) => updateuserstorePandata("cscr", event.target.value)} >
          <option value="CASH">Cash</option>
          <option value="CREDIT">Credit</option>
          <option value="CHALLAN">Challan</option>
        </select>

          <label htmlFor="">Transaction</label>
        </div>
        <div className="purchase-input">
          <input id="dis" placeholder="" type="text" onKeyDown={FocusForAll} maxLength= "5"
           value={userContextPanstoreRender('dis')}
           onChange={(event) => updateuserstorePandata("dis", event.target.value)}/>
          <label htmlFor="">D. Discount</label>
        </div>
        <div className="purchase-input">
          <input id="billdate" placeholder="" value={userContextPanstoreRender('billdate')} onKeyDown={FocusForAll}
          type="date"   onChange={(event) => updateuserstorePandata("billdate", event.target.value)}/>
          <label htmlFor="">Bill Date</label>
        </div>
        <div className="purchase-input">
          <input id="invdate" placeholder="" value={userContextPanstoreRender('invdate')} onKeyDown={FocusForAll}
          type="date"  onChange={(event) => updateuserstorePandata("invdate", event.target.value)} />
          <label htmlFor="">Invoice Date</label>
        </div>
      </div>

      <div  className="info-data">

          <p>{`${userContextPanstoreRender('add1')} - ${userContextPanstoreRender('add2')} - 
          ${userContextPanstoreRender('stcode')}`}</p>   
          <p>{`${userContextPanstoreRender('gstn')} - ${userContextPanstoreRender('regn')} `} 
          {`${userContextPanstoreRender('mobile')} - ${userContextPanstoreRender('email')}`}</p>
      </div>
      <div className="info-data">
          <p id="statusinfo"></p>
      </div>
      
      <div className="purchase-table">
        <div className="table-header">
          <span></span>
          <span>item name</span>
          <span>pack</span>
          <span>qty</span>
          <span>batch</span>
          <span>bonus</span>
          <span>rate</span>
          {headermrpgenerate()}
          <span>discount</span>
          <span>amount</span>
          <span>exp</span>
          <span>gst %</span>
          <span>net rate</span>
        </div>

        <div className="table-body">
          {rows.map((row) => (
            <RowComponent
            addNewRow={addNewRow}
            key={row.id}
            id={row.id}
            cs = {idf}
            deleteHandler={() => handleRowDeletion(row.id)}
      
            
          />
          ))}
           <button className="add-row" onClick={addNewRow}>
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="purchase-summary">
        <div className="col-1">
          <div className="summary-comment">
            <textarea name="" value={userContextPanstoreRender('cmnt')} 
            onChange={(event) => updateuserstorePandata("cmnt", event.target.value.toUpperCase())} >{userContextPanstoreRender('cmnt')}</textarea>
            <label htmlFor="">Bill Comment</label>
          </div>
          <div className="account">
            <div className="summary-account">
              <input id="acname1" type="text" value={userContext.store.recdic.ac['acname1']}  
              onChange={onacdischange}/>
              <label htmlFor="">Account Name</label>
            </div>
            <div className="account-value">
              <input id="acval1" type="text" 
              value={userContext.store.recdic.ac['acval1']} 
               onChange={onacdischange}/>
              <label htmlFor="">Value</label>
            </div>
          </div>
          <div className="btns">
            <button className="save" onClick={onSaveButton}>Save</button>
            <button className="close" onClick={onCloseButton}>Close</button>
            <button className="reset">Reset</button>
          </div>
        </div>
        <div className="col-2">
          <div className="gst-col">
            <div>
              <span className="label">GST</span>
              <span id="ttaxamt" className="value">{userContextPanstoreRender('ttaxamt').toFixed(2)}</span>
            </div>
            <div>
              <span className="label">CGST</span>
              <span id="cgst" className="value">{userContextPanstoreRender('cgst').toFixed(2)}</span>
            </div>
            <div>
              <span className="label">SGST</span>
              <span id="sgst" className="value">{userContextPanstoreRender('sgst').toFixed(2)}</span>
            </div>
          </div>
          <div className="total-col">
            <div className="bill-total">
              <span className="label">Bill Total</span>
              <span id="gtot" className="value">
                <img src={rupeeSymbol} alt="" />
                {userContextPanstoreRender('gtot').toFixed(0)}
              </span>
            </div>
            <div className="sub-total">
              <span  className="label">Sub Total</span>
              <span id="tsubtot" className="value">{userContextPanstoreRender('tsubtot').toFixed(2)}</span>
            </div>
            <div className="roundoff">
              <span className="label">Round Off</span>
              <span id="roundoff" className="value">{userContextPanstoreRender('roundoff').toFixed(2)}</span>
            </div>
            <div className="discount">
              <span className="label">Discount</span>
              <span id="tdisamt" className="value">{userContextPanstoreRender('tdisamt').toFixed(2)}</span>
            </div>
            <div className="amt-total">
              <span className="label">Amount Total</span>
              <span id="tamt" className="value">{userContextPanstoreRender('tamt').toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default index;
