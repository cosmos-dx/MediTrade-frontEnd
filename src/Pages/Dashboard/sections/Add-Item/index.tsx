import React, {useEffect, useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import "../../../../assets/css/mystyles.css";
import { UserDataContext } from "../../../../context/Context";

import kMove from "../../../../assets/js/kMove.js";
function SetFocusToNext(inputid){
  const nextfield = document.getElementById(inputid+1);
  
  if (nextfield !== null) {
      nextfield.focus();
  }else{
    document.getElementById("save").focus();
  }
}
class CISComponent extends  React.Component {
  static contextType = UserDataContext;
  constructor(props){
     super(props);
     this.keyCount = -1;
     this.listattr = this.props.iidf[this.props.setid].listattr;
     this.handleComm =  this.handleComm.bind(this);
     this.itemClicked = this.itemClicked.bind(this);
     this.onitemKeyDown = this.onitemKeyDown.bind(this);
     this.state = {
           mykey:this.props.setval,
           setlabel:"",
           hoveredItemIndex:-1,
           xdata:[], 
     } 
  }
  
  onitemKeyDown(e){
    const keyc =  e.keyCode || e.which;

 const divList = document.getElementById(this.props.iidf[this.props.setid].listattr);
 const dataLen = this.state.xdata.length-1;

 if(keyc === 8||keyc === 46){
   if(this.props.iidf[this.props.setid].idf.startsWith("db_")){
     const val = e.target.value;
     if(val.length===1){
       this.setState({xdata : []});
       this.keyCount = -1;
          this.setState({mykey : ""});
          this.props.AddHandler(this.props.setid,this.props.iidf[this.props.setid].id, "", false, []); // fillone is false;
          kMove('reset', this.keyCount, 0, divList, this.props.iidf[this.props.setid].listattr, "text");
     }
   }
 }

    if(keyc === 40||keyc === 34){
      if(this.props.iidf[this.props.setid].idf.startsWith("db_")){
        this.setState({hoveredItemIndex : -1});
        this.keyCount = this.keyCount+1;
        kMove('down', this.keyCount, dataLen, divList, this.props.iidf[this.props.setid].listattr, "text");
        if(typeof (this.state.xdata[this.keyCount]) !== 'undefined'){
          const obj = this.state.xdata[this.keyCount];
          const val = obj.name;
             this.props.AddHandler(this.props.setid, this.props.iidf[this.props.setid].id, val, false, obj); // fillone is false;
         }
        if(this.keyCount > dataLen){
          // this.keyCount reached at maximum data available, now reset to zero, this will rotate keyCount over available data 
          this.keyCount = -1;
        }
      }
    }
    if(keyc === 38||keyc === 33){
      if(this.props.iidf[this.props.setid].idf.startsWith("db_")){
        this.setState({hoveredItemIndex : -1});
        kMove('up', this.keyCount, dataLen, divList, this.props.iidf[this.props.setid].listattr, "text");
        if(typeof (this.state.xdata[this.keyCount]) !== 'undefined'){
          const obj = this.state.xdata[this.keyCount];
          const val = obj.name;
          this.props.AddHandler(this.props.setid, this.props.iidf[this.props.setid].id, val, false, obj); // fillone is false;
        }
        this.keyCount = this.keyCount-1;
        if(this.keyCount < 0){
          this.keyCount = 0;
        }
      }
    }
    if(keyc === 13||keyc === 35||keyc === 9){
      if(this.props.iidf[this.props.setid].idf.startsWith("db_")){
        if(this.keyCount<0){
          this.keyCount = 0 ; // No KeyDown Movement default is zero index
        }
        if(this.state.xdata.length>0){
          const obj = this.state.xdata[this.keyCount];
          const val = obj.name;
          this.setState({mykey : val});
          this.props.AddHandler(this.props.setid,this.props.iidf[this.props.setid].id, val, false, obj); // fillone is false;
          this.setState({xdata : []});
        }else{
          this.setState({mykey : ""});
        }
        this.keyCount = -1;
        kMove('reset', this.keyCount, 0, divList,  this.props.iidf[this.props.setid].listattr, "text");
        
        SetFocusToNext(this.props.setid);
        }
      else{
        SetFocusToNext(this.props.setid);
        }
      }
      
  }

  itemClicked(e){
 const obj = this.state.xdata[e.target.id];
 const val = obj.name;
 this.setState({mykey : val});
 this.props.AddHandler(this.props.setid, this.props.iidf[this.props.setid].id, val, false, obj); // fillone is false;
 this.setState({xdata : []});
 this.keyCount = -1;
 this.setState({hoveredItemIndex : -1});
  }

  handleComm (event){
     const val = event.target.value;

      if(this.props.iidf[this.props.setid].idf.startsWith("db_")){

        if(this.props.iidf[this.props.setid].regexp.test(val)){
            this.setState({mykey : val});
            this.setState({hoveredItemIndex : -1});
            this.keyCount = -1;
            kMove('reset', this.keyCount, 0, document.getElementById(this.props.iidf[this.props.setid].listattr), this.props.iidf[this.props.setid].listattr, "text");

            if(val.length>0){
                //var urlqry = new URLSearchParams({name: val,idf:this.props.rscr.cssearch,getcolumn:"all",limit:2 });
                var urlqry = new URLSearchParams({name:val.toUpperCase(),idf:this.props.iidf[this.props.setid].cssearch,
                getcolumn:"all",mode:"search",limit:2,identity:this.context.store['uqpath']['dbfname'] });

                const url = this.props.iidf[this.props.setid].url+urlqry;

                let data = [];
                const fetchData = async () => {
                try {
                    const res = await fetch(url);
                    data = await res.json();
                    this.setState({xdata : data});
                    if(this.props.iidf[this.props.setid].id==="name"){
                        if(data.length < 1){
                          this.props.AddHandler(this.props.setid, this.props.iidf[this.props.setid].id, val, true, []); // fillone is true;                       
                          }else{
                          this.props.AddHandler(this.props.setid, this.props.iidf[this.props.setid].id, val, false, data[0]); // fillone is false;
                        }
                    }else{
                      if(data.length>0){
                        this.props.AddHandler(this.props.setid, this.props.iidf[this.props.setid].id, val, true, data[0]); // fillone is true;
                      }else{
                        this.props.AddHandler(this.props.setid, this.props.iidf[this.props.setid].id, val, true, []); // fillone is true;
                      }
                    }
                } catch (error) {
                  this.setState({setlabel:`Error ${this.props.iidf[this.props.setid].cssearch} [ ${error} ] `});
                  this.props.iidf[this.props.setid].in = false; 
                }
                };
                fetchData();
                
            }
            else{
              this.keyCount = -1;
              
            } 
        }
        else{
          this.keyCount = -1;
          if(this.props.iidf[this.props.setid].id!=="hsn"){
            this.props.AddHandler(this.props.setid, this.props.iidf[this.props.setid].id, val, true, []); 
            this.setState({xdata : []});
          }
        }

        }
      else{
        if(this.props.iidf[this.props.setid].regexp.test(val)){
          this.setState({mykey : val});
          this.props.AddHandler(this.props.setid, this.props.iidf[this.props.setid].id, val, true, []); // fillone is true;
        }
      }
    
  }
  render() {
    const spanStyles = {
      display: "block",
      padding: "10px",
      cursor: "pointer",
      width: "100%",
      background: "transparent", // Set a transparent background by default
      // transition: "background-color 0.3s ease-in-out", // Add a smooth transition effect
    };
    const hoverColor = "#3ddc8d";
    let hoveredItemIndex = this.state.hoveredItemIndex;
     return (
        <>
        <p id={this.props.iidf[this.props.setid].labelid} className="additemlabel" >{this.props.iidf[this.props.setid].info}</p>
        {this.props.iidf[this.props.setid].idf.startsWith("db_") &&
         <div id="myDropdown" style={{ position: "relative" }}>
            <input type="text" id={this.props.setid} value={this.props.setval} 
              list={this.props.iidf[this.props.setid].listattr} name={this.props.setid}
              className="additeminput" autoComplete="off" maxLength={this.props.iidf[this.props.setid].mxl}           
                onChange={this.handleComm} onKeyDown={this.onitemKeyDown} 
                placeholder ={this.props.iidf[this.props.setid].ph} /> 
             
             <div className="dropdownthing" 
                 list={this.props.iidf[this.props.setid].listattr} id={this.props.iidf[this.props.setid].listattr}>
             
               {this.state.xdata.map((rd, spanid)=>{
                 return <span className="dropdownthing-span"
                     style={{
                        ...spanStyles,
                        background:
                          this.keyCount === spanid
                            ? "#3ddc8d"
                            : hoveredItemIndex === spanid
                            ? hoverColor
                            : "transparent",
                      }} 
                     onMouseEnter={() => {
                        if (this.keyCount !== spanid) {
                          this.setState({ hoveredItemIndex: spanid });
                        }
                      }} 
                     key={spanid} data-id={rd} id={spanid} onClick={this.itemClicked} >{rd.name}</span>
         
         })
               }
             </div>
           
         </div>
                  
         } 
         { this.props.iidf[this.props.setid].idf.startsWith("dd_") &&
           <div>
            <select className="additeminput" selected={this.props.setval} onChange={this.handleComm} onKeyDown={this.onitemKeyDown} >
         { this.props.iidf[this.props.setid].dd.map((val,id) => 
             <option key={id}>{val}</option> )
         }
       </select>

             </div>
         }
         {

          this.props.iidf[this.props.setid].idf.startsWith("si_") &&
          <div>
            <input type="text" id={this.props.setid}
                value={this.props.setval} name={this.props.setid}
                disabled={this.props.iidf[this.props.setid].disable}
               className="additeminput" onChange={this.handleComm} onKeyDown={this.onitemKeyDown}
               placeholder={this.props.iidf[this.props.setid].ph} maxLength={this.props.iidf[this.props.setid].mxl} />
          </div>
         }
         
        </>
     )
  }
}


function isEmpty(str) {
   return (!str || str.length === 0 );
}

function Index({rscr, whichPage}){
  const userContext = useContext(UserDataContext);
  const gstobj = {'12':[6,6],'5':[2.5,2.5],'18':[9,9],'28':[14,14],'0':[0,0],'':[0,0]};

  var iidf = {"0":{"in":true,"value":"","labelid":"0info","id":"name","idf":"db_name","ph":"Add Customer-Name","mxl":"100",
					"listattr":"list-name","info":"","cssearch":"","url":"","db_data":{},"req":true,"regexp":/^[A-Za-z0-9.-]*$/, "disable":false,},
				"1":{"in":true,"value":"Bill By Bill","labelid":"1info","id":"mode","idf":"dd_mode","ph":"Transaction Type","mxl":"100",
					"listattr":"","info":"","dd":['Bill By Bill','On Account'],"db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/, "disable":false,},
				"2":{"in":true,"value":"","labelid":"2info","id":"add1","idf":"si_add1","ph":"Address 1","mxl":"100",
				"listattr":"","info":"","db_data":{},"req":true,"regexp":/^[A-Za-z0-9.-]*$/, "disable":false,},
				"3":{"in":true,"value":"","labelid":"3info","id":"add2","idf":"si_add2","ph":"Address 2","mxl":"100",
				"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9.-]*$/, "disable":false,},
				"4":{"in":true,"value":"","labelid":"4info","id":"add3","idf":"si_stcode","ph":"State Code","mxl":"2",
				"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*$/, "disable":false,},
				"5":{"in":true,"value":"","labelid":"5info","id":"pincode","idf":"si_pincode","ph":"PIN Code","mxl":"6",
				"listattr":"","info":"","db_data":{},"req":false,"regexp":/^-?\d*$/, "disable":false,},
				"6":{"in":true,"value":"","labelid":"6info","id":"area","idf":"db_area","ph":"Location Area","mxl":"18",
				"listattr":"list-area","info":"","cssearch":"","url":"","db_data":{},"req":true,"regexp":/^[A-Za-z0-9_-]*$/, "disable":false,},
				"7":{"in":true,"value":"","labelid":"7info","id":"mobile","idf":"si_phone","ph":"Contact Number","mxl":"10",
					"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*$/, "disable":false,},
				"8":{"in":true,"value":"","labelid":"8info","id":"email","idf":"si_email","ph":"email Address","mxl":"100",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9.@]*$/, "disable":false,},
				"9":{"in":true,"value":"","labelid":"9info","id":"ophone","idf":"si_offphone","ph":"Office Contact","mxl":"10",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^-?\d*$/, "disable":false,},
				"10":{"in":true,"value":"","labelid":"10info","id":"pan","idf":"si_pan","ph":"PAN","mxl":"10",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/, "disable":false,},
				"11":{"in":true,"value":"","labelid":"11info","id":"bal","idf":"si_obal","ph":"Opening Balance","mxl":"8",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^-?\d*$/, "disable":false,},
				"12":{"in":true,"value":"","labelid":"12info","id":"regn","idf":"si_regn","ph":"Registeration No","mxl":"30",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/, "disable":false,},
				"13":{"in":true,"value":"","labelid":"13info","id":"gstn","idf":"si_gstn","ph":"GST Number","mxl":"15",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/, "disable":false,},
				"14":{"in":true,"value":"","labelid":"14info","id":"cmnt","idf":"si_cmnt","ph":"Composition-Tax-Payer [Y=YES; N=NO]",
					"mxl":"11","listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/, "disable":false,},
				}
  useEffect(() => {

    const keys = "addsupplier";

    if(whichPage ==="items"){
     rscr["cs"]="suppliers";
     rscr["cssearch"]="supplier";
     rscr["pagename"]="ADD-ITEM";
     iidf = {"0":{"in":true,"value":"","labelid":"0info","id":"name","idf":"db_name","ph":"Item-Name","mxl":"100",
    			"listattr":"list-name","info":"","cssearch":"items","url": `${userContext.api}/itemsearchenter?`,
          "db_data":{},"req":true,"regexp":/^[A-Za-z0-9. -]*$/, "disable":false,},
    			"1":{"in":true,"value":"TAB","labelid":"1info","id":"unit","idf":"dd_unit","ph":"Item-Unit","mxl":"10","listattr":"","info":"",
    		    	"dd":['TAB','CAP','VIAL','BOTT','DROP','PCS','OINT','CREAM'],"db_data":{},"req":true,"regexp":/^[A-Za-z0-9_-]*$/, "disable":false,},
    			"2":{"in":true,"value":"","labelid":"2info","id":"pack","idf":"si_pack","ph":"Item-Pack","mxl":"10",
    				"listattr":"","info":"","db_data":{},"req":true,"regexp":/^(?!.*\**.*\+)[a-zA-Z0-9 *]*$/i, "disable":false,},
    			"3":{"in":true,"value":"","labelid":"3info","id":"igroup","idf":"db_igroup","ph":"Item-Composition","mxl":"500",
    				"listattr":"list-igroup","info":"","cssearch":"items_igroup","url": `${userContext.api}/addtodb?`,
            "db_data":{},"req":false,"regexp":/^[A-Za-z0-9.-]*$/, "disable":false,},
    			"4":{"in":true,"value":"","labelid":"4info","id":"irack","idf":"db_irack","ph":"Item-Rack Name","mxl":"25","listattr":"list-irack","info":"",
    			     "cssearch":"items_irack","url":`${userContext.api}/addtodb?`,"db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/, "disable":false,},
    			"5":{"in":true,"value":"","labelid":"5info","id":"comp","idf":"db_comp","ph":"Item-Manufecturer","mxl":"25","listattr":"list-comp","info":"",
    			   "cssearch":"comp","url":`${userContext.api}/addtodb?`,"db_data":{},"req":true,"regexp":/^[A-Za-z0-9.-]*$/, "disable":false,},
    			"6":{"in":true,"value":"","labelid":"6info","id":"prate","idf":"si_prate","ph":"Purchase Rate","mxl":"10",
    				"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*[.,]?\d*$/, "disable":false,},
    			"7":{"in":true,"value":"","labelid":"7info","id":"srate","idf":"si_srate","ph":"Sale Rate","mxl":"10",
    				"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*[.,]?\d*$/, "disable":false,},
    			"8":{"in":true,"value":"","labelid":"8info","id":"mrp","idf":"si_mrp","ph":"M.R.P","mxl":"10",
    				"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*[.,]?\d*$/, "disable":false,},
    			"9":{"in":true,"value":12,"labelid":"9info","id":"gst","idf":"dd_gst","ph":"IGST","mxl":"4",
    				"listattr":"","info":"ADD [ 12% ] as GST","dd":['12','5','18','28','0',],"db_data":{},
            "req":false,"regexp":/^-?\d*[.,]?\d*$/, "disable":false,},
    			"10":{"in":true,"value":6,"labelid":"10info","id":"cgst","idf":"label_cgst","ph":"CGST","mxl":"4",
    				"listattr":"","info":"ADD [ 6% ] as CGST","db_data":{},"req":false,"regexp":/^-?\d*[.,]?\d*$/, "disable":true,},
    			"11":{"in":true,"value":6,"labelid":"11info","id":"sgst","idf":"label_sgst","ph":"SGST","mxl":"4",
    				"listattr":"","info":"ADD [ 6% ] as SGST","db_data":{},"req":false,"regexp":/^-?\d*[.,]?\d*$/, "disable":true,},
    			"12":{"in":true,"value":"","labelid":"12info","id":"hsn","idf":"db_hsn","ph":"HSN Code","mxl":"8",
    				"listattr":"list-hsn","info":"","cssearch":"hsn","url":`${userContext.api}/addtodb?`,
            "db_data":{},"req":true,"regexp":/^-?\d*$/, "disable":false,},
    			"13":{"in":true,"value":"","labelid":"13info","id":"sup","idf":"db_sup","ph":"Item-Supplier Name","mxl":"100",
    				"listattr":"list-sup","info":"","cssearch":"sup","url":`${userContext.api}/addtodb?`,
            "db_data":{},"req":true,"regexp":/^[A-Za-z0-9.-]*$/, "disable":false,},
    			"14":{"in":true,"value":"","labelid":"14info","id":"cmnt","idf":"si_cmnt","ph":"Comment and Notes","mxl":"20",
    				"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9.-]*$/, "disable":false,},
    			}
        //  clearAllField("0", "", fielddata);
    }
    else if(window.location.search.split("?")[1]===keys || whichPage==="supplier"){
     rscr["cs"]="suppliers";
     rscr["cssearch"]="supplier";
     rscr["pagename"]="ADD-SUPPLIER";
     iidf["0"]["ph"]="Add Supplier-Name";
     iidf["0"]["cssearch"]="supplier";
     iidf["0"]["url"]= `${userContext.api}/partysearchenter?`;
     iidf["6"]["cssearch"]="supplier_area";
     iidf["6"]["url"]=`${userContext.api}/addtodb?`;
     
    }
    else{
     rscr["cs"]="customer";
     rscr["cssearch"]="customer";
     rscr["pagename"]="ADD-CUSTOMER";
     iidf["0"]["ph"]="Add Customer-Name";
     iidf["0"]["cssearch"]="customer";
     iidf["0"]["url"]= `${userContext.api}/partysearchenter?`;
     iidf["6"]["cssearch"]="customer_area";
     iidf["6"]["url"]=`${userContext.api}/addtodb?`;

     
    }
    setiidf(iidf);
  }, [whichPage]);



    const navigation = useNavigate();

    const [getiidf, setiidf] = useState(iidf);
    
    let fielddata = ["","","","","","","","","","","","","","","","","",]; 
    const [cisData, setcisData] = useState(fielddata);

  
    
    function clearAllField(id, val, fielddata){
       
        iidf[id].info = `Add New [ ${val.toUpperCase()} ] Records`;
        const cisInput = [...fielddata];
        cisInput[id] = val;
        setcisData(cisInput);
        for (const mobj of Object.entries(getiidf)){
         setiidf(previidf => ({...previidf,[mobj[0]]: { ...previidf[mobj[0]], "in":true }}));
         setiidf(previidf => ({...previidf,[mobj[0]]: { ...previidf[mobj[0]], "value":"" }}));
         setiidf(previidf => ({...previidf,[mobj[0]]: { ...previidf[mobj[0]], "db_data":{} }}));
         setiidf(previidf => ({...previidf,[mobj[0]]: { ...previidf[mobj[0]], "info":""}}));
       }
       if(rscr["pagename"]==="ADD-ITEM"){
         // default values
         setiidf(previidf => ({...previidf,["1"]: { ...previidf["1"], "value":"TAB" }}));
      
       }else{
         setiidf(previidf => ({...previidf,["1"]: { ...previidf["1"], "value":"BILL BY BILL" }}));
        
       }
      
        
      }
 
    function AddHandler (id, key, val, fillone, obj) {
      const cisInput = [...cisData];
      var setinfo = "";
      val = val.toUpperCase();
     
      setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "value":val }}));
      if(key==="gst"){
        var [cgst, sgst] = gstobj[val];
        setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "value":parseInt(val) }}));
        setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "db_data":obj }}));
        setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "info":`Add [ ${val}% ] as GST `}}));

        setiidf(previidf => ({...previidf,[id+1]: { ...previidf[id+1], "info":`Add [ ${cgst}% ] as CGST `}}));
        setiidf(previidf => ({...previidf,[id+1]: { ...previidf[id+1], "value":cgst }}));

        setiidf(previidf => ({...previidf,[id+2]: { ...previidf[id+2], "info":`Add [ ${sgst}% ] as SGST `}}));
        setiidf(previidf => ({...previidf,[id+2]: { ...previidf[id+2], "value":sgst }}));
        return;
      } 

      if(key==="area" || key==="igroup" || key==="irack" || key==="comp" || key==="hsn" || key==="sup"){
         cisInput[id] = val;
         setcisData(cisInput);
         if (Object.keys(obj).length>0){
           setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "db_data":obj }}));
           setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "info":`Select [ ${obj.name} ] as ${key.toUpperCase()} `}}));
           return;
         }else{
           setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "db_data":null }}));
           setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "info":`Add [ ${val.toUpperCase()} ] as New ${key.toUpperCase()} `}}));
           return;
          }
      }

      if(fillone){
        if(key==="name"){
          clearAllField(id, val, fielddata, false);
          setinfo = `Add New [ ${val.toUpperCase()} ] Records`;
          setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "in":true}}));
          setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "info":setinfo}}));
          setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "value":val}}));
          return;
        }
        else{
          setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "value":val}}));
          setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "info":` [ ${val.toUpperCase()} ] as ${key.toUpperCase()} `}}));
          cisInput[id] = val;
          setcisData(cisInput);
          return ;
        }
      } 

      if(key==="name"){
        if(!fillone){
          if(val.length>0){
            setinfo = `EDIT [ ${obj.name} ] Records`;
            setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "in":false}}));
            setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "db_data":obj }}));
            for (const [k, value] of Object.entries(getiidf)) {
              for (const [key, v] of Object.entries(value)) {
                if (typeof(obj[v])!=='undefined'){
                   setiidf(previidf => ({...previidf,[k]: { ...previidf[k], "value":obj[v]}}));
                   setiidf(previidf => ({...previidf,[k]: { ...previidf[k], "info":""}}));
                   cisInput[k] = obj[v];
                }
              }
            }
           cisInput[id] = val;
           setcisData(cisInput);
           setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "value":val}}));
           setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "info":setinfo}}));
           }
           else{
              clearAllField(id, "", fielddata, false);
              setinfo = `Add New [ ${val.toUpperCase()} ] Records`;
              setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "in":true}}));
              setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "info":setinfo}}));
              setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "db_data":null }}));
           } 
        }
        else{   			
          clearAllField(id, val, fielddata, false);
          setinfo = `Add New [ ${val.toUpperCase()} ] Records`;
          setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "in":true}}));
          setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "info":setinfo}}));
          setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "db_data":null }}));
        }
      }
    
 }


   // function onCustomerClick(e){clearAllField("0", "", fielddata);navigation("/addcis?"+keyc)};
   // function onItemClick(e){clearAllField("0", "", fielddata);navigation("/addcis?"+keyi)};
   // function onSupplierClick(e){clearAllField("0", "", fielddata);navigation("/addcis?"+keys)};

   function toggleButton(p1, p2){
   document.getElementById("save").style.display = p1;
   document.getElementById("delete").style.display = p1;
   document.getElementById("reset").style.display = p1;
   document.getElementById("confirm").style.display = p2;
   document.getElementById("confirm").style.backgroundColor = "yellow";
   document.getElementById("cancel").style.display = p2;
   }

   function onSave(e){
     let validate = true;
     for (const mobj of Object.entries(getiidf)){
       var obj = mobj[1];
       if(obj["req"]){
         var alerttext = `NOT ALLOWED !! Fill [ ${obj.ph} ] Value`;
         document.getElementById(obj["labelid"]).innerHTML = "";
         if(isEmpty(obj["value"])){
           if(obj["value"].trim()===""){
             validate=false;
             document.getElementById(obj["labelid"]).innerHTML = alerttext; 
             document.getElementById('statusinfo2').innerHTML = `${obj.ph} Fields is Empty ! Check Again !!`;
             //getiidf[mobj[0]]["info"]=alerttext;
             return;
           }
         }
       }

     }

     
     if (getiidf['13']['db_data']=== null) {
        validate = false;
        document.getElementById('statusinfo2').innerHTML = ` Create This Supplier First ! Check Again !!`;
        return ;
    }
     if(getiidf[0]["in"]){
       document.getElementById('statusinfo2').innerHTML = "Ready to SAVE Records";
     }else{
       document.getElementById('statusinfo2').innerHTML = "Ready to UPDATE Records";
       
     }
     if(!validate){

     }else{toggleButton("none", "block");}
       
   }

   function onDelete(e){
     document.getElementById('statusinfo2').innerHTML = "DataBase Warning for Delete Show Confirm Button ";
     toggleButton("none", "block");
   }

   function onReset(e){
     document.getElementById('statusinfo2').innerHTML = "Reset All Fields";
     clearAllField("0", "", fielddata)
   }

   

   function onConfirm(e){

    let addcompbool = false;
    let mode = "save";    
    let cs = whichPage;
    let getcolumn = "all";
    let formtext = {};
    
    if(whichPage === "items"){
      
      let compid = "";
      if (getiidf['5']['db_data'] === null) {
        addcompbool = true;
      }else{
        compid = getiidf['5']['db_data']["ledgid"];
      } 
      if (typeof (getiidf['0']['db_data']['_id']) !== 'undefined') {
        mode = "update";
      }     
           
      formtext = {
        addcomp: addcompbool,
        _id: getiidf['0']['db_data']['_id'],
        name: getiidf['0']['value'],
        itemdata : getiidf['0']['db_data'],
        itemid : getiidf['0']['db_data']["itemid"],
        unit: getiidf['1']['value'],
        pack: getiidf['2']['value'],
        igroup: getiidf['3']['value'],
        irack: getiidf['4']['value'],
        comp: getiidf['5']['value'],
        compid: compid,
        compdata : getiidf['5']['db_data'],
        compname: getiidf['5']['value'],
        prate: getiidf['6']['value'],
        srate: getiidf['7']['value'],
        mrp: getiidf['8']['value'],
        igst: getiidf['9']['value'],
        cgst: gstobj[getiidf['9']['value']][0],
        sgst: gstobj[getiidf['9']['value']][1],
        hsn: getiidf['12']['value'],
        sup: getiidf['13']['value'],
        supdata : getiidf['13']['db_data'],
        csid : getiidf['13']['db_data']["csid"],
        cmnt: getiidf['14']['value'],
        netrate: "0",
        dis: "0",
      };
    
    }
    else if(whichPage === "supplier"){      
      if (typeof (getiidf['0']['db_data']['_id']) !== 'undefined') {
        mode = "update";
      }   
      formtext = {
          _id: getiidf['0']['db_data']['_id'], 
          csid: getiidf['0']['db_data']['csid'],
          ledgid: getiidf['0']['db_data']['ledgid'],
          name: getiidf['0']['value'],
          add1: getiidf['2']['value'],
          add2: getiidf['3']['value'],
          add3: getiidf['4']['value'],
          pincode: getiidf['5']['value'],
          area: getiidf['6']['value'],
          mobile: getiidf['7']['value'],
          email: getiidf['8']['value'],
          ophone: getiidf['9']['value'],
          pan: getiidf['10']['value'],
          bal: getiidf['11']['value'],
          regn: getiidf['12']['value'],
          gstn: getiidf['13']['value'],
          cmnt: getiidf['14']['value'],
          mode: getiidf['1']['value'],
          stcode: getiidf['4']['value'],
          phone: getiidf['7']['value'],
          offphone: getiidf['9']['value'],
          obal: ''
      }
    }
    else {      
      if (typeof (getiidf['0']['db_data']['_id']) !== 'undefined') {
        mode = "update";
      }   
      formtext = {
          _id: getiidf['0']['db_data']['_id'], 
          csid: getiidf['0']['db_data']['csid'],
          ledgid: getiidf['0']['db_data']['ledgid'],
          name: getiidf['0']['value'],
          add1: getiidf['2']['value'],
          add2: getiidf['3']['value'],
          add3: getiidf['4']['value'],
          pincode: getiidf['5']['value'],
          area: getiidf['6']['value'],
          mobile: getiidf['7']['value'],
          email: getiidf['8']['value'],
          ophone: getiidf['9']['value'],
          pan: getiidf['10']['value'],
          bal: getiidf['11']['value'],
          regn: getiidf['12']['value'],
          gstn: getiidf['13']['value'],
          cmnt: getiidf['14']['value'],
          mode: getiidf['1']['value'],
          stcode: getiidf['4']['value'],
          phone: getiidf['7']['value'],
          offphone: getiidf['9']['value'],
          obal: ''
      }
    }
      const sendbody = {
      text: formtext,
      cs: cs,
      getcolumn: getcolumn,
      mode: mode,
      identity : userContext.store['uqpath']['dbfname']
    };
    fetch(`${userContext.api}/addtodb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendbody), 
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
    
    .then((data) => {      
      if(data[0] === undefined){
        data = data['name'];
      }else{ data = data[0]}
      document.getElementById('statusinfo2').innerHTML = `${data} - ${mode} to DataBase `;
      onReset();
    })
    .catch(error => {
      console.log(error);
    });
         
     toggleButton("block", "none");
   }

   function onCancel(e){
     document.getElementById('statusinfo2').innerHTML = "Cancel Button Pressed";
     toggleButton("block", "none");
   }

   function onBack(e){navigation("/dashboard");}

return (

<>
 <div className="search">
  <div>
   <label hidden="hidden" id='cs'>{iidf["1"]["cssearch"]}</label>  
   <div className="cismain" id="container" >
      <div id="statusinfo" className="blink_me info" >{rscr["pagename"]}</div>

      { Object.entries(iidf).map((obj,k) => 
        <CISComponent key={k} iidf={getiidf} setid={k} setname={obj[1].id} setval={cisData[k]} AddHandler={AddHandler} />
        ) } 

    <div id="statusinfo2" className="blink_me info" ></div>

      <div className="cisbtmbtn">
        <button id="save" className="mbtmbt" onClick={onSave} style={{display:'block'}} >SAVE</button>
        <button id="delete" className="mbtmbtdlt" onClick={onDelete} style={{display:'block'}} >DELETE</button>
        <button id="confirm" className="mbtmbtrst" onClick={onConfirm} style={{display:'none'}} >CONFIRM</button>
        <button id="cancel" className="mbtmbt" onClick={onCancel} style={{display:'none'}} >CANCEL</button>
        <button id="reset" className="mbtmbtrst" onClick={onReset} style={{display:'block'}} >RESET</button>
        <button type="submit" id="submit" className="mbtmbtbck" onClick={onBack}>BACK</button>
      </div> 
     </div>
 </div>
 </div>
</>

 );

};

export default Index;
