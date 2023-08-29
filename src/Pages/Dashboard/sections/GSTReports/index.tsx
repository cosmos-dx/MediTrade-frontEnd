import { useState, useContext } from "react";
import "../../../../assets/css/searchsp.css";
import mygif from "../../../../assets/images/wrun.gif";
import InputHandler from "../../Components/InputHandler";
import { UserDataContext } from "../../../../context/Context";
import { useNavigate } from "react-router-dom";

const Index = ({idf, sp, searchroutes}) => {
  const userContext = useContext(UserDataContext);
  const [frmdate, setfrmdate] = useState('');
  const [todate, settodate] = useState('');
  
  const [tableheader, settableheader] = useState(["Bill.No","Bill.Date","PartyName","GST.No","StateCode",
                          "ItemName", "GstRate", "CGST", "SGST", "Qty", "Total", "Taxable", "Discount"]);
  const [agreegate, setagreegate] = useState(false);
  const [gsttable, setgsttable] = useState("b2b");
  const [itype, setitype] = useState([1,2]);
  const [billas, setbillas] = useState(["I","M"]);
  const [taxslab, settaxslab] = useState([0,5,12,18,28]);
  const [showgif, setshowgif] = useState("none"); 
  const [showbtn, setshowbtn] = useState("block");

  const [spdisplaydata, setspdisplaydata] = useState([{}]);
  const [panData, setpanData] = useState(userContext.store.recdic.pan);
  const navigateTo = useNavigate();
  const [disable , setenable] = useState(true);

  const today = new Date().toISOString().split('T')[0];
  useState(() => {
    setfrmdate(today);
    settodate(today);
  }, []);

  
  const rowdatahandler = (myHandlerObj, val, data, eventType) => {
  
    if(data){
      for (const [key, value] of Object.entries(data)) {
        userContext.store.recdic.pan[key] = value;
        setpanData((prevState) => ({ ...prevState, [key]: value}));
      }
      
    }
     
  };
  const onSaveButton = () => {
    setshowgif("block");
    setshowbtn("none");
    const spdata = {
      billas : billas,
      idf: idf,
      sp:sp,
      frm: frmdate,
      tod: todate,
      itype: itype,
      taxslab:taxslab,
      agreegate:agreegate, 
      gsttable:gsttable,
      ledgid : userContext.store.recdic.pan['ledgid'] || "",
      fyear : 0,
      identity : userContext.store['uqpath']['dbfname']
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
      console.log("dataaa", data)
      if(Object.keys(data).length>0){
        setspdisplaydata(data);
      }
      else{
        setspdisplaydata([{}]);
      }
      setshowgif("none");
      setshowbtn("block");
    })
    .catch(error => {
      console.log(error);
    });
  }
  
  
  function resetStore(){
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: userContext.store.recdic.pantemplate,},}))
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, ac: userContext.store.recdic.ac,},}))
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid: {[0] : userContext.store.recdic.itemtemplate},},}));
  
  }

  function onGsttabletype(e){setgsttable(e.target.value);setspdisplaydata([{}]);};

  function onAgreegateChange(e){
    if (e.target.checked) {
       settableheader(["","","","","","", "GstRate", "CGST", "SGST", "Qty", "Total", "Taxable", "Discount"]);
      setagreegate(true);
    }
    else{
       settableheader(["Bill.No","Bill.Date","PartyName","GST.No","StateCode",
                          "ItemName", "GstRate", "CGST", "SGST", "Qty", "Total", "Taxable", "Discount"]);
      setagreegate(false)
    }
    setspdisplaydata([{}]);
  }

  function onBillasChange(e) {
    const val = e.target.value;
    if (e.target.checked) {
      if(!billas.includes(val)){setbillas([...billas, val]);}
      else{setbillas(billas.filter((item) => item !== val));} //Removed
    } 
    else {
      if(billas.includes(val)){setbillas(billas.filter((item) => item !== val));} //Removed
      else{setbillas([...billas, val]);}
    }
    setspdisplaydata([{}]);
  }
  
  function onItypeChange(e) {
    const val = e.target.value;
    if (e.target.checked) {
      if(!itype.includes(parseInt(val))){setitype([...itype, parseInt(val)]);}
      else{setitype(itype.filter((item) => item !== parseInt(val))); } //Removed
    } 
    else {
      if(itype.includes(parseInt(val))){setitype(itype.filter((item) => item !== parseInt(val)));} //Removed
      else{setitype([...itype, parseInt(val)]);}
    }
    setspdisplaydata([{}]);
  }

  function onTaxSlabChange(e) {
    const val = parseInt(e.target.value);
      if (e.target.checked) {
        if(!taxslab.includes(val)){settaxslab([...taxslab, val]);}
        else{settaxslab(taxslab.filter((item) => item !== val)); } //Removed
      } 
      else {
        if(taxslab.includes(val)){settaxslab(taxslab.filter((item) => item !== val));} //Removed
        else{settaxslab([...taxslab, val]);}
      }
      setspdisplaydata([{}]);
   }

  function spInputSelector() {
    return (
      <>

      <div className="search-input">
          <div style={{display: "inline-flex"}} >
            <div style={{padding_right: "120px"}}>
              <input value = "M" defaultChecked={true}  type="checkbox" onChange = {onBillasChange} />
              <span > Intra-State &nbsp;&nbsp;</span>
            </div>
            <div style={{padding_right: "120px"}}>
               <input value = "I" defaultChecked={true} type="checkbox" onChange = {onBillasChange} />
              <span> Inter-State </span>
            </div>
          </div>  
        </div>
        <div className="search-input">
          <div style={{display: "inline-flex"}} >
            <div style={{padding_right: "120px"}}>
              <input value = "1" defaultChecked={true}  type="checkbox" onChange = {onItypeChange} />
              <span> Un-Registered </span>
            </div>
            <div style={{padding_right: "120px"}}>
               <input value = "2" defaultChecked={true} type="checkbox" onChange = {onItypeChange} />
              <span> GST-Registered </span>
            </div>
          </div>  
        </div>

      <div className="search-input">
          <div style={{display: "inline-flex"}} >
            <div style={{padding_right: "100px"}}>
              <input value = {false} type="checkbox" onChange = {onAgreegateChange} />
              <span > Agreegate Result &nbsp;&nbsp;</span>
            </div>
          </div>  
        </div>

        <div className="search-input">
          <select name="gsttable" onChange={onGsttabletype}>
            <option value="b2b">b2b</option>
            <option value="b2cs">b2cs</option>
            <option value="b2cl">b2cl</option>
          </select>

          <label htmlFor="">Report GST Table Type</label>
        </div>

      <div className="search-input">
      <InputHandler
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
     <div style={{display: "inline-flex"}} >
          <div style={{padding: "10px"}}>
              <input value = {0} defaultChecked={true}  type="checkbox" onChange = {onTaxSlabChange} />
              <span> 0% </span>
           </div>
           <div style={{padding: "10px"}}>
              <input value = {5} defaultChecked={true} type="checkbox" onChange = {onTaxSlabChange} />
              <span> 5% </span>
           </div>
           <div style={{padding: "10px"}}>
              <input value = {12} defaultChecked={true} type="checkbox" onChange = {onTaxSlabChange} />
              <span> 12% </span>
           </div>
           <div style={{padding: "10px"}}>
              <input value = {18} defaultChecked={true} type="checkbox" onChange = {onTaxSlabChange} />
              <span> 18% </span>
           </div>
           <div style={{padding: "10px"}}>
              <input value = {28} defaultChecked={true} type="checkbox" onChange = {onTaxSlabChange} />
              <span> 28% </span>
           </div>
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

  function generateTableHeaders() {
    //console.log(tableheader)
    if (gsttable==="b2cs") {
      return (
        <tr className="search-table-header">
          
          <th>GST-Rate</th>
          <th>Total Amount</th>
          <th>Taxable Amount</th>
          <th>CGST Amount</th>
          <th>SGST Amount</th>
          <th>Discount</th>
          <th>Qty</th>
          <th>TaxCount</th>
        </tr>
      );
    } 
    else {
      return (
        <tr className="search-table-header">
          {tableheader.map((value, index) => (
              <th key={index} >
                {value}
              </th>
            ))}
        </tr>
      );
    }
  }


  function generateTableData(value) {
    //console.log(value);
    if (gsttable==="b2cs") {
      return (
        <>
          <td>{value.gst}</td>
          <td>{value.netamt}</td>
          <td>{value.amt}</td>
          <td>{value.cgst}</td>
          <td>{value.sgst}</td>
          <td>{value.tdisamt}</td>
          <td>{value.qty}</td>
          <td>{value.taxcount}</td>
        </>
      );
    } 
    else {
      return (
        <>
          <td>{value.billno}</td>
          <td>{value.billdate}</td>
          <td>{value.name}</td>
          <td>{value.gstn}</td>
          <td>{value.stcode}</td>
          <td>{value.itemname}</td>
          <td>{value.gst}</td>
          <td>{value.cgst}</td>
          <td>{value.sgst}</td>
          <td>{value.qty}</td>
          <td>{value.netamt}</td>
          <td>{value.amt}</td>
          <td>{value.tdisamt}</td>
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
      //
      userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: data['pan'],},}));
      userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid: data['grid'],},}))
      document.getElementById("show").style.background = "#f1f5f4";
      document.getElementById("show").disabled = true;
      setenable(false);
      document.getElementById("open").style.background = "yellow";
      document.getElementById("open").style.color = "blue";
      //console.log(data);
    })
    

    
    
}
  return (
    <div className="search-section payrcpt-mobile">
      <div className="search-header payrcpt-header-mobile ">
        
        
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
              <tr key={index} >
                {generateTableData(value)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />
      <div style={{display:showgif}}>
        <img id="mygif" src={mygif} alt="loading..." />
      </div>
      <div style={{display:showbtn}} className="btns">
        <button id="show" className="show" onClick={onSaveButton}>Show</button>
        
        <button id="close" className="close" onClick={()=> {resetStore();(navigateTo("/dashboard"))}}>Close</button>
      </div>
    </div>
  );
};

export default Index;

