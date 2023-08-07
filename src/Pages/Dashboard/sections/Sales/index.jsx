// import "./sales.css";
import "../../../../assets/css/medi-styles.css";
import RowComponent from "../../Components/RowComponent";
import { useState, useContext, useRef, useEffect, ReactNode } from "react";
import rupeeSymbol from "./Indian-Rupee-symbol.svg";
import InputHandler from "../../Components/InputHandler";
import { Link, useNavigate } from "react-router-dom";
import {UserDataContext} from "../../../../context/Context";

const index = () => {
  // const [billNo, setbillNo] = useState("");
  const rowId = useRef(0);
  const navigateTo = useNavigate();
  const [inputHandlerKey, setInputHandlerKey] = useState(0);
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const userContext = useContext(UserDataContext);

 const handleRowDeletion = (id) => {
    const  newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
    setRowData((prevData) => {
      const newData = { ...prevData };
      delete newData[id];
      return newData;
    });
  };

  const fetchDataFromAPI = async () => {
    try {
      const response = await fetch(
        'http://localhost/partysearchenter?name=customer&getcolumn=billno&limit%5Bbillhead%5D=S&limit%5Bfyear%5D=0&limit%5Bbillas%5D=M&idf=billnoset'
      );
      if (!response.ok) {
        throw new Error('API request failed');
      }
      const data = await response.json();
      
      setInvValue(incrementStringNumber(data[0]['billno']));
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };
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
  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  
  const initialRowData = {
    _id: "",
    itemid: "",
    name: "",
    pack: "",
    unit: "",
    netrate: "",
    prate: "",
    srate: "",
    cgst: "",
    sgst: "",
    gst: "",
    dis: "",
    mrp: "",
    hsn: "",
    igroup: "",
    irack: "",
    compid: "",
    csid: "",
    stockarray: [],
    stockid: "",
    dbstock: "",
    dbbatchstock: "",
    expdate: "",
    dbbatchno: "",
    totstk: "",
    batchno: "",
    rate_a: "",
    multibat: "",
    qty: "",
    bbool: "",
    bonus: "",
    tqty: "",
    rate: "",
    tax: "",
    amt: "",
    tdisamt: "",
    ttaxamt: "",
    amttot: "",
    netamt: "",
    pnet: "",
    srate_a: "",
  };
  const [rows, setRows] = useState([{ id: 0 }]);
  const [rowData, setRowData] = useState({ 0: {...initialRowData, id: 0 } });
  const [billtotal, setbilltotal] = useState(0);
  const [cgst , setcgst] = useState(0);
  const [sgst , setsgst] = useState(0);
  const [gst , setgst] = useState(0);
  const [subtotal , setsubtotal] = useState(0);
  const [disamt, setdisamt] = useState(0);
  const [InvValue, setInvValue] = useState("");
  const [transType, settransType] = useState("CASH");
  const [billDate, setBillDate] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [ddis,setddis] = useState('');
  const [bilcmnt, setbilcmnt] = useState('');
  const [bilnme, setbilnme] = useState('');
  const [val,setval] = useState('');
  const [panData, setpanData] = useState(userContext.store.recdic.pan);

  const today = new Date().toISOString().split('T')[0];
  useState(() => {
    setBillDate(today);
    setInvoiceDate(today);
  }, []);

  useEffect(() => {
    let total = 0;
    let ccgst = 0;
    let ssgst = 0;
    let ggst = 0;
    let amt = 0;
    let tdis = 0;
    for (const obj of Object.values(rowData)) {
      total += parseFloat(obj.amttot || 0);
      ccgst += parseFloat(obj.cgst || 0);
      ssgst += parseFloat(obj.sgst || 0);
      ggst += parseFloat(obj.ttaxamt || 0);
      amt += parseFloat(obj.amt || 0);
      tdis += parseFloat(obj.tdisamt || 0);
    }
  
    setbilltotal(total);
    setcgst(ccgst);
    setsgst(ssgst);
    setgst(ggst);
    setsubtotal(amt);
    setdisamt(tdis);
    let dbcscr ="";
    if(transType == 'CASH') dbcscr = 1;
    if(transType == 'CREDIT') dbcscr =2;
    if(transType == 'CHALLAN') dbcscr = 3; 

    let itype;
    if(transType == "CASH") itype = '2';
    else if(transType == "CREDIT") itype = '1';
    else itype = '3'
  
    if (userContext.store && userContext.store.recdic && userContext.store.recdic.pan) {
      userContext.updateStore((prevStore) => ({
        ...prevStore,
        recdic: {
          ...prevStore.recdic,
          pan: {
            ...prevStore.recdic.pan,
            gtot: total,
            gamt: total,
            billas: 'M',
            tsubtot: amt,
            tamt: amt,
            ttaxamt: ggst,
            tdisamt: tdis,
            cgst: ccgst,
            sgst: ssgst,
            dbbilldate: billDate,
            dbinvdate: invoiceDate,
            billdate: formatDate(billDate),
            invdate: formatDate(invoiceDate),
            cscr: transType,
            billno: InvValue,
            amount: amt,
            amt: amt,
            itype : itype,
            fyear: "0",
            cmnt: bilcmnt,
            dbcscr :dbcscr,
          },
        },
      }));
    }
  }, [rowData]);

  const rowdatahandler = (myHandlerObj, val, data, eventType) => {
  
    if(data){
      for (const [key, value] of Object.entries(data)) {
        userContext.store.recdic.pan[key] = data[key];
        setpanData((prevState) => ({ ...prevState, [key]: data[key]}));
      }
      console.log("sale component",  userContext.store.recdic.pan);
      console.log(myHandlerObj['idf'], val, data, eventType);
    }
     
  };
  

  const addNewRow = () => {
    const newId = Math.max(...rows.map((row) => row.id)) + 1;
    setRows((prevRows) => [...prevRows, { id: newId }]);
    setRowData((prevData) => ({
      ...prevData,
      [newId]: { ...initialRowData, id: newId },
    }));
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
    if ((pan['amount'] === 0 || pan['amt'] === "" || pan['tamt'] === 0 || pan['gtot'] === "") && (Object.keys(rowData).length > 1 || rowData['0']['itemid'] !== "")) {
      alert("Internal Error Reload Page");
      return;
    }
    if (InvValue === "") {
      alert("Enter Invoice Number");
      return;
    }
  
    const rowDataArr = Object.entries(rowData).map(([key, value]) => {
      return { id: key, ...value };
    });
  

  
    userContext.store.recdic.grid = rowDataArr;

  
    const requestBody = {
      idf : "customer",
      mode : "save",
      getdata: userContext.store.recdic,
    };
  
    fetch(`${userContext.api}/sendbilltodb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }).finally(navigateTo("/dashboard"))
      .catch(error => {
        console.log(error);
      });
      userContext.updateStore(prevStore => ({
        ...prevStore,
        recdic: {
          ...prevStore.recdic,
          pan: {
            ...prevStore.recdic.pan,
            acentries: false,
            add1: "",
            add2: "",
            add3: "",
            area: "",
            bal: 0,
            billas: "M",
            billdate: 0,
            billno: 0,
            cgst: 0,
            cmnt: "",
            cscr: 0,
            csid: 0,
            dbbilldate: 0,
            dbcscr: 0,
            dbinvdate: 0,
            ddisc: 0,
            dis: 0,
            email: 0,
            esti: 0,
            fyear: 0,
            gstn: "",
            gtot: 0,
            gtotwords: 0,
            invdate: 0,
            invoicedate: 0,
            itype: 1,
            ledgid: 0,
            mode: 0,
            name: "",
            ophone: 0,
            pan: 0,
            partyname: "",
            pexpense: 0,
            phone: 0,
            pincode: 0,
            prolo: 0,
            regn: 0,
            rgtot: 0,
            roundoff: 0,
            sgst: 0,
            spid: 0,
            stcode: "0",
            tamt: 0,
            taxamt1: 0,
            taxamt2: 0,
            tdisamt: 0,
            transid: 0,
            tsubtot: 0,
            ttaxable: 0,
            ttaxamt: 0,
            updtval: 0
          }
        }
      }));

  };
  const onCloseButton = () => {
    navigateTo("/dashboard")
  }
  
  return (
    <div className="purchase-section">
      {/* <h1>Purchase</h1> */}
      <div className="purchase-header">
        <div className="purchase-input">
        <InputHandler
        key ={inputHandlerKey}
          myobj={{
            id: "spinput",
            page: "spbill",
            info: "Customer",
            idf: "customer",
            colname: "name",
            limit: "10",
            action: "search",
            cs: "customer",
            links: `${userContext.api}/partysearchenter?`,
            provided_data: "name",
            widthstyle: "1"
          }}
          
          rowdatahandler={rowdatahandler}
        />
         
        </div>
        <div className="purchase-input">
          <input placeholder="abcd" value={InvValue} readOnly type="text" />
          <label htmlFor="">Invoice</label>
        </div>
        <div className="purchase-input">
        <select name="transType" value={transType} onChange={(event) => settransType(event.target.value)}>
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
          <option value="challan">Challan</option>
        </select>

          <label htmlFor="">Transaction</label>
        </div>
        <div className="purchase-input">
          <input placeholder="" type="number" value={ddis} onChange={(event) => setddis(event.target.value)} />
          <label htmlFor="">D. Discount</label>
        </div>
        <div className="purchase-input">
          <input placeholder="" value={billDate} type="date"  onChange={(event) => setBillDate(event.target.value)} />
          <label htmlFor="">Bill Date</label>
        </div>
        <div className="purchase-input">
          <input placeholder="" value={invoiceDate} type="date"  onChange={(event) => setInvoiceDate(event.target.value)} />
          <label htmlFor="">Invoice Date</label>
        </div>
      </div>
      <div className="info-data">

          <p>{`${panData['add1']} - ${panData['add2']} - 
          ${userContext.store.recdic.pan['stcode']}`}</p>   
          <p>{`${panData['gstn']} - ${panData['regn']} `} 
          {`${panData['mobile']} - ${panData['email']}`}</p>

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
            cs = "customer"
            key={row.id}
            id={row.id}
            deleteHandler={() => handleRowDeletion(row.id)}
            rowData={rowData}
            setRowData={setRowData}
            
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
            <textarea name="" value="" onChange={(event) => setbilcmnt(event.target.value)} >{bilcmnt}</textarea>
            <label htmlFor="">Bill Comment</label>
          </div>
          <div className="account">
            <div className="summary-account">
              <input type="text" value={bilnme}  onChange={(event) => setbilnme(event.target.value)}/>
              <label htmlFor="">Account Name</label>
            </div>
            <div className="account-value">
              <input type="number" value={val}  onChange={(event) => setval(event.target.value)}/>
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
              <span className="value">{gst}</span>
            </div>
            <div>
              <span className="label">CGST</span>
              <span className="value">{cgst}</span>
            </div>
            <div>
              <span className="label">SGST</span>
              <span className="value">{sgst}</span>
            </div>
          </div>
          <div className="total-col">
            <div className="bill-total">
              <span className="label">Bill Total</span>
              <span className="value">
                <img src={rupeeSymbol} alt="" />
                {billtotal.toFixed(2)}
              </span>
            </div>
            <div className="sub-total">
              <span className="label">Sub Total</span>
              <span className="value">{subtotal}</span>
            </div>
            <div className="roundoff">
              <span className="label">Round Off</span>
              <span className="value">0.00</span>
            </div>
            <div className="discount">
              <span className="label">Discount</span>
              <span className="value">{disamt}</span>
            </div>
            <div className="amt-total">
              <span className="label">Amount Total</span>
              <span className="value">0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default index;
