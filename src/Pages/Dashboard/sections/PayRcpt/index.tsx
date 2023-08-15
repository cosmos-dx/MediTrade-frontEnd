import { useState, useContext } from "react";
import "../../../../assets/css/searchsp.css";
import mygif from "../../../../assets/images/wrun.gif";
import InputHandler from "../../Components/InputHandler";
import { UserDataContext } from "../../../../context/Context";
import { useNavigate } from "react-router-dom";

const Index = ({idf, sp, crdr, searchroutes}) => {
  const userContext = useContext(UserDataContext);
  const [frmdate, setfrmdate] = useState('');
  
  const [panData, setpanData] = useState(userContext.store.recdic.pan);
  const [partybalance, setpartybalance] = useState(0);
  const [voucherno, setvoucherno] = useState("");
  const [enteramount, setenteramount] = useState(0.00);
  const [finalbalance, setfinalbalance] = useState(0.00);
  const [paymode, setpaymode] = useState("CASH");
  const [cmnt, setcmnt] = useState("");
  const [showgif, setshowgif] = useState("none"); 
  const [showbtn, setshowbtn] = useState("block");
  const navigateTo = useNavigate();
  
  function isRateDisValidate(value){
    return /^-?\d*[.,]?\d*$/.test(value); 
  }

  const today = new Date().toISOString().split('T')[0];
  useState(() => {
    setfrmdate(today);
    
  }, []);

  
  const rowdatahandler = (myHandlerObj, val, data, eventType) => {
  
    if(data){
      for (const [key, value] of Object.entries(data)) {
        userContext.store.recdic.pan[key] = value;
        setpanData((prevState) => ({ ...prevState, [key]: value}));
      }

      if(eventType==="select"){
        const payrcptsearch = {idf:idf,sp:sp,ledgid:userContext.store.recdic.pan['ledgid'] || ""}

        fetch(`${userContext.api}/payrcptsearch`, {
           method: 'POST',
           headers: {'Content-Type': 'application/json'  },
           body: JSON.stringify(payrcptsearch)
        }).then((response) => {
          if (!response.ok) {throw new Error('Network response was not ok');}
          return response.json();
        }).then((data) => {
          if(Object.keys(data).length>0){
            setpartybalance(data.partybalance.balance);
            setfinalbalance(data.totalbalance.balance);
            
          }
        })
        .catch(error => {
          console.log(error);
        });

        

      }
      
      
    }
  };

  function updatedata(keys, val){
    if(keys==="voucherno"){
      setvoucherno(val.toUpperCase())
    }
    if(keys==="paymode"){
      setpaymode(val.toUpperCase())
    }
    if(keys==="cmnt"){
      setcmnt(val.toUpperCase())
    }
    if(keys==="enteramount"){
      if(val.trim()===""){
        setenteramount(0.00);
      }
      else{
        if (isRateDisValidate(val)){
          setenteramount(parseFloat(val))
        }
      }
    }
  }

  const onSaveButton = () => {
    setshowgif("block");
    setshowbtn("none");
    const spdata = {
      idf: idf,
      sp:sp,
      frm: frmdate,
      tod: "",
      itype: "",
      gsttable:"",
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
  

  return (
    <div className="search-section">
      <div className="search-header">
        
        
        <div className="search-input">
          <input placeholder="" type="date" autoFocus value={frmdate} onChange={(event) => setfrmdate(event.target.value)} />
          <label htmlFor=""> Date</label>
        </div>
        <div></div>

        <div className="search-input">
          <input id="voucherno" placeholder="abcd" value={voucherno} 
           onChange={(event) => updatedata("voucherno", event.target.value)} type="text" />
          <label htmlFor="">Voucher Number</label>
        </div>
        <div></div>
        <div>
          <div className="search-input">
          <InputHandler
            myobj={{
              id: "spinput",
              page: "gstreport",
              info: idf,
              idf: idf,
              colname: "name",
              limit: "10",
              action: "search",
              cs: idf,
              links: `${userContext.api}/partysearchenter?`,
              provided_data: "name",
              widthstyle: "1",
              itemname : ""
            }}
            rowdatahandler = {rowdatahandler}
          />
          </div>
        </div>
      

        <div className="info-data">
            
              <p>{`${panData['add1']} - ${panData['add2']} - 
              ${userContext.store.recdic.pan['stcode']}`}</p>   
              <p>{`${panData['gstn']} - ${panData['regn']} `} 
              {`${panData['mobile']} - ${panData['email']}`}</p>
        </div>
      </div>

      <div style={{width:"870px",height:"350px",border:"1px solid #000"}}>
        {sp.toUpperCase()}

        <div>
          <div style={{display:"inline-flex",marginTop:"30px"}}>
            <div  style={{border:'1px solid green',borderRadius:'5px', 
                    overflow:'hidden',width:"400px",height:"50px",lineHeight:"45px",}} >
              <label> {userContext.store.recdic.pan['name']} </label>
            </div>
            <div style={{paddingLeft:"30px", paddingRight:"30px", lineHeight:"45px",}}>
              <label> {`Balance: ${partybalance}`}</label>
            </div>

            <div className="search-input" style={{paddingRight:"30px", paddingLeft:"30px", lineHeight:"45px",
            border:'1px solid green',borderRadius:'5px',}}>
              <input id="enteramount" value={parseFloat(enteramount)} 
                 onChange={(event) => updatedata("enteramount", event.target.value)} type="text" />
            </div>
          </div>

          <div>
            <div style={{display:"inline-flex",marginTop:"30px"}} >
              <select id="paymode" style={{width:"100px", height:"50px",paddingLeft:"30px"}} 
                 onChange={(event) => updatedata("paymode", event.target.value)} selected={paymode}>
                <option value="cash">CASH</option>
                <option value="bank">BANK</option>
              </select>
              <div style={{paddingLeft:"100px", paddingRight:"100px", lineHeight:"45px",}}>
                <label> {`${crdr} AMOUNT: ${enteramount} `}</label>
              </div>

              <div style={{paddingLeft:"100px", paddingRight:"30px", lineHeight:"45px",}}>
                <label> {`TOTAL BALANCE: ${finalbalance} `}</label>
              </div>
            </div>
          </div> 

          <div>
            <div style={{display:"inline-flex",marginTop:"30px", padding:"25px"}} >
            <label style={{lineHeight:"45px", paddingRight:"25px"}}>Note: </label>
              <div className="search-input" style={{paddingRight:"30px", paddingLeft:"30px", lineHeight:"45px",
                    border:'1px solid green',borderRadius:'5px'}}>
                <input id="cmnt" style={{width:"600px"}} value={cmnt}
                onChange={(event) => updatedata("cmnt", event.target.value)} type="text" />
              </div>
            </div>
          </div>

          </div>
        </div>
      <br />
      <div style={{display:showgif}}>
        <img id="mygif" src={mygif} alt="loading..." />
      </div>
      <div style={{display:showbtn}} className="btns">
        <button id="show" className="show" onClick={onSaveButton}>Save</button>
        <button id="close" className="close" onClick={()=> {resetStore();(navigateTo("/dashboard"))}}>Close</button>
      </div>
    </div>
  );
};

export default Index;

