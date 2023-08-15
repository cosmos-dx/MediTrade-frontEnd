import { useState, useContext } from "react";
import "./searchsp.css";
import InputHandler from "../../Components/InputHandler";
import { UserDataContext } from "../../../../context/Context";
import { useNavigate, Link , NavLink} from "react-router-dom";

const Index = ({idf, sp, searchroutes}) => {
  const userContext = useContext(UserDataContext);
  const [frmdate, setfrmdate] = useState('');
  const [todate, settodate] = useState('');
  const [itype, setitype] = useState("('1','2')");
  const [billas, setbillas] = useState("('I','M','E')");
  const [spdisplaydata, setspdisplaydata] = useState([{}]);
  const [panData, setpanData] = useState(userContext.store.recdic.pan);
  const navigateTo = useNavigate();
  const [disable , setenable] = useState(true);

  function check_nan_return_dash(v){
    var rv = '0';
    if (isNaN(parseFloat(v))){rv = '========'}
    else{rv = parseFloat(v).toFixed(2)}
    return rv;
  }

 
   function AppendTableGSTSUMMARY(ttt, rows, tag){
    
    ttt.push( {"tax": "", "billno" : tag, "cgst": "", "sgst" : "", "igst": "",  "taxamt" : "", "taxable" :"" , "netpayable": ""}) 
    Object.entries(rows).map((rowd, i) => {
      var cgst = check_nan_return_dash(rowd[1].cgst) ;
      var sgst = check_nan_return_dash(rowd[1].sgst) ;
      var igst = check_nan_return_dash(rowd[1].taxamt) ;
      var taxable = check_nan_return_dash(rowd[1].taxable) ;
      var taxamt = check_nan_return_dash(rowd[1].taxamt) ;
      var netpayable = check_nan_return_dash(rowd[1].netpayable) ;      
      ttt.push({"tax": rowd[1].tax, "billno" : rowd[1].billno, "cgst": cgst, "sgst" : sgst, "igst": taxamt,  "taxamt" : taxamt, "taxable" :taxable , "netpayable": netpayable})
    })
    setspdisplaydata(ttt);
  }



  const today = new Date().toISOString().split('T')[0];
  useState(() => {
    setfrmdate(today);
    settodate(today);
  }, []);

  
  const rowdatahandler = (myHandlerObj, val, data, eventType) => {
  
    if(data){
      for (const [key, value] of Object.entries(data)) {
        userContext.store.recdic.pan[key] = data[key];
        setpanData((prevState) => ({ ...prevState, [key]: data[key]}));
      }
      onSaveButton();
    }
     
  };
  const onSaveButton = () => {

    if(sp == "saleledger" || sp =="customerledger"){
      if(userContext.store.recdic.pan['name']==""){
        alert("enter party Name");
        return;

      }
      
    }
  
    const spdata = {
      name: sp,
      searchtxt: userContext.store.recdic.pan['name'] || "",
      partyname : "",
      billno : "",
      idf: idf,
      keyc: '0',
      frm: frmdate,
      tod: todate,
      itype: itype,
      billas: billas,
      ledgid : userContext.store.recdic.pan['ledgid'] || "",
      fyear : 0,
    };
    
    fetch(`${userContext.api}${searchroutes}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spdata)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      
      if(sp === "gstsummary"){
        var ttt =[];
        AppendTableGSTSUMMARY(ttt, data['rowp'], "Purchase");
        AppendTableGSTSUMMARY(ttt, data['rows'], "Sale");   
      }
      else{
        setspdisplaydata(data);
      }
      
    })
    .catch(error => {
      console.log(error);
    });
    
  }
  
  
  const onOpenButton = () => {
    if(idf === "supplier"){
      navigateTo('/dashboard/speditpage_purchase')
    }
    else if (idf === "customer")
    {
      navigateTo('/dashboard/speditpage')
    }
    
    
  }
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
  function spInputSelector() {
    if(sp === "saleledger" || sp === "purchaseledger" || sp === "purchase" || sp === "sale" || sp === "cashledger" ){
      return (
        <>
        <div className="search-input">
        <select name="billas" onChange={(event) => setbillas(event.target.value)}>
          <option value="('I','M','E')">Both</option>
          <option value="('I')">Inter State Only</option>
          <option value="('M')">Intra State Only</option>
          <option value="('E')">Challan</option>
        </select>

          <label htmlFor="">Invoice Type 1</label>
        </div>
        <div className="search-input">
        <select name="itype" onChange={(event) => setitype(event.target.value)}>
          <option value="('1','2')">Both</option>
          <option value="('2')">Registered Party</option>
          <option value="('1')">Un-Registered Party</option>
        </select>

          <label htmlFor="">Invoice Type 2</label>
        </div>
        <div className="search-input">
        <InputHandler
          key={idf}
          myobj={{
            id: "spinput",
            page: "searchsp",
            info: idf,
            idf: idf,
            colname: "name",
            limit: "10",
            action: "search",
            cs: "supplier",
            links: `${userContext.api}/partysearchenter?`,
            provided_data: "name",
            widthstyle: "1",
            itemname : ""
          }}
          rowdatahandler = {rowdatahandler}
        />
       </div>
            <div className="info-data">

            <p>{`${panData['add1']} - ${panData['add2']} - 
            ${userContext.store.recdic.pan['stcode']}`}</p>   
            <p>{`${panData['gstn']} - ${panData['regn']} `} 
            {`${panData['mobile']} - ${panData['email']}`}</p>

        </div>
        </>
      )
    }
    else if (sp==="gstsummary" || sp === "Updatecompanystock"){
      return (
      <>
        <br />
        <br />
        <br />
        <br />

      </>
      )
    }
  } 

  function generateTableHeaders() {
    if (sp === "purchase" || sp === "sale") {
      return (
        <tr className="search-table-header">
          <th>inv. Date</th>
          <th>inv. No</th>
          <th>inv Type</th>
          <th>Party Name</th>
          <th>Amount</th>
        </tr>
      );
    } else if (sp === "cashledger") {
      return (
        <tr className="search-table-header">
          <th>inv. Date</th>
          <th>Inv No</th>
          <th>inv Type</th>
          <th>Party Name</th>
          <th>Amount</th>
        </tr>
      );
    }
    else if (sp === "saleledger") {
      return (
        <tr className="search-table-header">
          <th>inv. Date</th>
          <th>Inv No</th>
          <th>inv Type</th>
          <th>Party Name</th>
          <th>CREDIT</th>
          <th>DEBIT</th>
        </tr>
      );
    }
    else if (sp === "purchaseledger") {
      return (
        <tr className="search-table-header">
          <th>inv. Date</th>
          <th>Inv No</th>
          <th>inv Type</th>
          <th>Party Name</th>
          <th>CREDIT</th>
          <th>DEBIT</th>
        </tr>
      );
    }
    else if (sp === "gstsummary") {
      return (
        <tr className="search-table-header">
          <th>TaxRates</th>
          <th>MODE</th>
          <th>CGST</th>
          <th>SGST</th>
          <th>IGST</th>
          <th>Taxable</th>
          <th>TaxAmount</th>
          <th>Payable</th>
        </tr>
      );
    }
    else if (sp === "Updatecompanystock") {
      return (
        <tr className="search-table-header">
          <th>TaxRates</th>
          <th>MODE</th>
          <th>CGST</th>
          <th>SGST</th>
          <th>IGST</th>
          <th>Taxable</th>
          <th>TaxAmount</th>
          <th>Payable</th>
        </tr>
      );
    }
  }


  function generateTableData(value) {
    
    if (sp === "purchase" || sp === "sale") {
      return (
        <>
          <td>{value.billdate}</td>
          <td>{value.billno}</td>
          <td>{value.itype === 1 ? "CASH" : value.itype === 2 ? "CREDIT" : value.itype === 3? "CHALLAN" : ""}</td>
          <td>{value.name}</td>
          <td>{value.amount}</td>
        </>
      );
    } else if (sp === "cashledger") {
      return (
        <>
          <td>{value.billdate}</td>
          <td>{value.billno}</td>
          <td>{value.itype === 1 ? "CASH" : value.itype === 2 ? "CREDIT" : value.itype === 3? "CHALLAN" : ""}</td>
          <td>{value.name}</td>
          <td>{value.debit}</td>
        </>
      );
    }
    else if (sp === "saleledger") {
      return (
        <>
          <td>{value.billdate}</td>
          <td>{value.billno}</td>
          <td>{value.trtype === "1" ? "CREDIT" : value.itype === "2" ? "CASH" : value.itype === "3"? "CHALLAN" : ""}</td>
          <td>{value.name}</td>
          <td>{value.credit}</td>
          <td>{value.debit}</td>
        </>
      );
    }
    else if (sp === "purchaseledger") {
      return (
        <>
          <td>{value.billdate}</td>
          <td>{value.billno}</td>
          <td>{value.trtype === "1" ? "CREDIT" : value.itype === "2" ? "CASH" : value.itype === "3"? "CHALLAN" : ""}</td>
          <td>{value.name}</td>
          <td>{value.credit}</td>
          <td>{value.debit}</td>
        </>
      );
    }

    else if (sp === "gstsummary") {
      return (
        <>
          <td>{value.tax}</td>
          <td>{value.billno}</td>
          <td>{value.cgst}</td>
          <td>{value.sgst}</td>
          <td>{value.igst}</td>
          <td>{value.taxable}</td>
          <td>{value.taxamt}</td>
          <td>{value.netpayable}</td>
        </>
      );
    }
    else if (sp === "Updatecompanystock") {
      return (
        <>
          <td>{value.tax}</td>
          <td>{value.billno}</td>
          <td>{value.cgst}</td>
          <td>{value.sgst}</td>
          <td>{value.igst}</td>
          <td>{value.taxable}</td>
          <td>{value.taxamt}</td>
          <td>{value.netpayable}</td>
        </>
      );
    }
    
  }

  
function onRowClick(index){  
  
  var temp =spdisplaydata[index];
  temp['idf'] = idf;
  var params = new URLSearchParams(temp);
  
  const url = `${userContext.api}/speditcalculate?${params}`
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },

    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: data['pan'],},}));
      userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid: data['grid'],},}));
      document.getElementById("show").style.background = "#f1f5f4";
      document.getElementById("show").disabled = true;

      setenable(false);
      document.getElementById("open").style.background = "yellow";
      document.getElementById("open").style.color = "blue";
    })    
    
}
  return (
    <div className="search-section">
      <div className="search-header">
        
        
        <div className="search-input">
          <input placeholder="" type="date" autoFocus value={frmdate} onChange={(event) => setfrmdate(event.target.value)} />
          <label htmlFor="">From Date</label>
        </div>
        <div className="search-input">
          <input placeholder="" type="date" value={todate} onChange={(event) => settodate(event.target.value)} />
          <label htmlFor="">To Date</label>
        </div>

        {spInputSelector()}
     
        </div>
      
      

      <div className="table-container">
        <table className="search-table">
          <thead>{generateTableHeaders()}</thead>
     
          <tbody>
          {spdisplaydata.map((value, index) => (
              <tr key={index} onClick={() => (onRowClick(index))}>
                {generateTableData(value)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />
      <div className="btns">
        <button id="show" className="show" onClick={onSaveButton}>Show</button>
        <button id="open" className="open" disabled={disable} onClick={onOpenButton}>Open</button>
        <button id="close" className="close" onClick={()=> {resetStore();(navigateTo("/dashboard"))}}>Close</button>
      </div>
    </div>
  );
};

export default Index;

