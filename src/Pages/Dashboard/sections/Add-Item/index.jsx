import React, {useEffect, useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import "./mystyles.css";
import { UserDataContext } from "../../../../context/Context";
// import "./bootstrap.css";
import kMove from "../kMove.js";
function SetFocusToNext(inputid){
  const nextfield = document.getElementById(inputid+1);
  
  if (nextfield !== null) {
      nextfield.focus();
  }else{
    document.getElementById("save").focus();
  }
}
class CISComponent extends  React.Component {
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
        console.log("abcd");
        
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
  }

  handleComm (event){
     const val = event.target.value;

      if(this.props.iidf[this.props.setid].idf.startsWith("db_")){
        if(this.props.iidf[this.props.setid].regexp.test(val)){
            this.setState({mykey : val});
            this.keyCount = -1;
            kMove('reset', this.keyCount, 0, document.getElementById(this.props.iidf[this.props.setid].listattr), this.props.iidf[this.props.setid].listattr, "text");

            if(val.length>0){
                //var urlqry = new URLSearchParams({name: val,idf:this.props.rscr.cssearch,getcolumn:"all",limit:2 });
                var urlqry = new URLSearchParams({name:val.toUpperCase(),idf:this.props.iidf[this.props.setid].cssearch,
                getcolumn:"all",mode:"search",limit:2 });

                //const url = 'http://localhost:80/partysearchenter_test?'+urlqry;
                const url = this.props.iidf[this.props.setid].url+urlqry;
                console.log(url)
                let data = [];
                const fetchData = async () => {
                try {
                    const res = await fetch(url);
                    data = await res.json();
                    this.setState({xdata : data});
                    //console.log("1111ASDSDA", this.props.iidf[this.props.setid].id)
                    if(this.props.iidf[this.props.setid].id==="name"){
                        if(data.length < 1){
                          this.props.AddHandler(this.props.setid, this.props.iidf[this.props.setid].id, val, true, []); // fillone is true;
                          //this.setState({setlabel:`Add New [ ${val.toUpperCase()} ] Records`});
                          //this.props.iidf[this.props.setid].in = true; 
                          //console.log("add now ", data.length);
                          }else{
                          //console.log("updateee now ", data.length);
                          //this.props.iidf[this.props.setid].in = false; 
                          //this.setState({setlabel:`Edit [ ${data[0].name} ] Records`});
                          //this.props.iidf[this.props.setid].info = `Edit [ ${data[0].name} ] Records`;
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
                  //this.props.iidf[this.props.setid].info = `Error ${this.props.iidf[this.props.setid].cssearch} [ ${error} ] `;
                  this.props.iidf[this.props.setid].in = false; 
                }
                };
                fetchData();

            }
            else{
              this.setState({xdata : []});
            } 
        }
        else{
          console.log("fallin ");
          this.props.AddHandler(this.props.setid, this.props.iidf[this.props.setid].id, val, true, []); 
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
    
    
     return (
        <>
        <label id={this.props.iidf[this.props.setid].labelid} className="instructions" >{this.props.iidf[this.props.setid].info}</label>
        {this.props.iidf[this.props.setid].idf.startsWith("db_") &&
         <div>
            <input type="text" id={this.props.setid} value={this.props.setval} 
              list={this.props.iidf[this.props.setid].listattr} name={this.props.setid}
              className="cisinput" autoComplete="off"             
                onChange={this.handleComm} onKeyDown={this.onitemKeyDown} 
                placeholder ={this.props.iidf[this.props.setid].ph} /> 
             
             <div className="cisspanlistdiv" list={this.props.iidf[this.props.setid].listattr} id={this.props.iidf[this.props.setid].listattr}>
             
               {this.state.xdata.map((rd, spanid)=>{
                 return <span className="cisspanlist" 
                     key={spanid} data-id={rd} id={spanid} onClick={this.itemClicked} >{rd.name}</span>
         
         })
               }
             </div>
           
         </div>
                  
         } 
         { this.props.iidf[this.props.setid].idf.startsWith("dd_") &&
           <div>
            <select className="cisinput" selected={this.props.setval} onChange={this.handleComm} onKeyDown={this.onitemKeyDown} >
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
               className="cisinput" onChange={this.handleComm} onKeyDown={this.onitemKeyDown}
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

function index({rscr, whichPage}){
  const userContext = useContext(UserDataContext);
  
 //rscr["addcis"]={"0":"","1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"",
 //				"9":"","10":"","11":"","12":"","13":"","14":"","15":"","16":"","17":""}

 let iidf = {"0":{"in":true,"value":"","labelid":"0info","id":"name","idf":"db_name","ph":"Add Customer-Name","mxl":"100",
					"listattr":"list-name","info":"","cssearch":"","url":"","db_data":{},"req":true,"regexp":/^[A-Za-z0-9.-]*$/},
				"1":{"in":true,"value":"Bill By Bill","labelid":"1info","id":"mode","idf":"dd_mode","ph":"Transaction Type","mxl":"100",
					"listattr":"","info":"","dd":['Bill By Bill','On Account'],"db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/},
				"2":{"in":true,"value":"","labelid":"2info","id":"add1","idf":"si_add1","ph":"Address 1","mxl":"100",
				"listattr":"","info":"","db_data":{},"req":true,"regexp":/^[A-Za-z0-9.-]*$/},
				"3":{"in":true,"value":"","labelid":"3info","id":"add2","idf":"si_add2","ph":"Address 2","mxl":"100",
				"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9.-]*$/},
				"4":{"in":true,"value":"","labelid":"4info","id":"add3","idf":"si_stcode","ph":"State Code","mxl":"2",
				"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*$/},
				"5":{"in":true,"value":"","labelid":"5info","id":"pincode","idf":"si_pincode","ph":"PIN Code","mxl":"6",
				"listattr":"","info":"","db_data":{},"req":false,"regexp":/^-?\d*$/},
				"6":{"in":true,"value":"","labelid":"6info","id":"area","idf":"db_area","ph":"Location Area","mxl":"18",
				"listattr":"list-area","info":"","cssearch":"","url":"","db_data":{},"req":true,"regexp":/^[A-Za-z0-9_-]*$/},
				"7":{"in":true,"value":"","labelid":"7info","id":"mobile","idf":"si_phone","ph":"Contact Number","mxl":"10",
					"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*$/},
				"8":{"in":true,"value":"","labelid":"8info","id":"email","idf":"si_email","ph":"email Address","mxl":"100",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9.@]*$/},
				"9":{"in":true,"value":"","labelid":"9info","id":"ophone","idf":"si_offphone","ph":"Office Contact","mxl":"10",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^-?\d*$/},
				"10":{"in":true,"value":"","labelid":"10info","id":"pan","idf":"si_pan","ph":"PAN","mxl":"10",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/},
				"11":{"in":true,"value":"","labelid":"11info","id":"bal","idf":"si_obal","ph":"Opening Balance","mxl":"8",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^-?\d*$/},
				"12":{"in":true,"value":"","labelid":"12info","id":"regn","idf":"si_regn","ph":"Registeration No","mxl":"30",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/},
				"13":{"in":true,"value":"","labelid":"13info","id":"gstn","idf":"si_gstn","ph":"GST Number","mxl":"15",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/},
				"14":{"in":true,"value":"","labelid":"14info","id":"cmnt","idf":"si_cmnt","ph":"Composition-Tax-Payer [Y=YES; N=NO]",
					"mxl":"11","listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/},
				}
 useEffect(() => {

 const keyc = "addcustomer";
 const keyi = "additem";
 const keys = "addsupplier";
 console.log(" ====== ",whichPage);
 
 if(whichPage =="items"){
   rscr["cs"]="suppliers";
   rscr["cssearch"]="supplier";
   rscr["pagename"]="ADD-ITEM";
   iidf = {"0":{"in":true,"value":"","labelid":"0info","id":"name","idf":"db_name","ph":"Item-Name","mxl":"100",
				"listattr":"list-name","info":"","cssearch":"items","url":"http://localhost:80/itemsearchenter?","db_data":{},"req":true,"regexp":/^[A-Za-z0-9.-]*$/},
				"1":{"in":true,"value":"TAB","labelid":"1info","id":"unit","idf":"dd_unit","ph":"Item-Unit","mxl":"10","listattr":"","info":"",
			    	"dd":['TAB','CAP','VIAL','BOTT','DROP','PCS','OINT','CREAM'],"db_data":{},"req":true,"regexp":/^[A-Za-z0-9_-]*$/},
				"2":{"in":true,"value":"","labelid":"2info","id":"pack","idf":"si_pack","ph":"Item-Pack","mxl":"10",
					"listattr":"","info":"","db_data":{},"req":true,"regexp":/^(?!.*\**.*\+)[a-zA-Z0-9 *]*$/i},
				"3":{"in":true,"value":"","labelid":"3info","id":"igroup","idf":"db_igroup","ph":"Item-Composition","mxl":"500",
					"listattr":"list-igroup","info":"","cssearch":"items_igroup","url":"http://localhost:80/addtodb?","db_data":{},"req":false,"regexp":/^[A-Za-z0-9.-]*$/},
				"4":{"in":true,"value":"","labelid":"4info","id":"irack","idf":"db_irack","ph":"Item-Rack Name","mxl":"25","listattr":"list-irack","info":"",
				     "cssearch":"items_irack","url":"http://localhost:80/addtodb?","db_data":{},"req":false,"regexp":/^[A-Za-z0-9_-]*$/},
				"5":{"in":true,"value":"","labelid":"5info","id":"comp","idf":"db_comp","ph":"Item-Manufecturer","mxl":"25","listattr":"list-comp","info":"",
				   "cssearch":"comp","url":"http://localhost:80/addtodb?","db_data":{},"req":true,"regexp":/^[A-Za-z0-9.-]*$/},
				"6":{"in":true,"value":"","labelid":"6info","id":"prate","idf":"si_prate","ph":"Purchase Rate","mxl":"10",
					"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*[.,]?\d*$/},
				"7":{"in":true,"value":"","labelid":"7info","id":"srate","idf":"si_srate","ph":"Sale Rate","mxl":"10",
					"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*[.,]?\d*$/},
				"8":{"in":true,"value":"","labelid":"8info","id":"mrp","idf":"si_mrp","ph":"M.R.P","mxl":"10",
					"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*[.,]?\d*$/},
				"9":{"in":true,"value":"12","labelid":"9info","id":"gst","idf":"dd_gst","ph":"IGST","mxl":"4",
					"listattr":"","info":"","dd":['12','5','18','28','0',],"db_data":{},"req":true,"regexp":/^-?\d*[.,]?\d*$/},
				"10":{"in":true,"value":"","labelid":"10info","id":"cgst","idf":"si_cgst","ph":"CGST","mxl":"4",
					"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*[.,]?\d*$/},
				"11":{"in":true,"value":"","labelid":"11info","id":"sgst","idf":"si_sgst","ph":"SGST","mxl":"4",
					"listattr":"","info":"","db_data":{},"req":true,"regexp":/^-?\d*[.,]?\d*$/},
				"12":{"in":true,"value":"","labelid":"12info","id":"hsn","idf":"db_hsn","ph":"HSN Code","mxl":"8",
					"listattr":"list-hsn","info":"","cssearch":"hsn","url":"http://localhost:80/addtodb?","db_data":{},"req":true,"regexp":/^-?\d*$/},
				"13":{"in":true,"value":"","labelid":"13info","id":"sup","idf":"db_sup","ph":"Item-Supplier Name","mxl":"100",
					"listattr":"list-sup","info":"","cssearch":"sup","url":"http://localhost:80/addtodb?","db_data":{},"req":true,"regexp":/^[A-Za-z0-9.-]*$/},
				"14":{"in":true,"value":"","labelid":"14info","id":"cmnt","idf":"si_cmnt","ph":"Comment and Notes","mxl":"20",
					"listattr":"","info":"","db_data":{},"req":false,"regexp":/^[A-Za-z0-9.-]*$/},
				}
      //  clearAllField("0", "", fielddata);
 }
 else if(window.location.search.split("?")[1]===keys || whichPage=="supplier"){
   rscr["cs"]="suppliers";
   rscr["cssearch"]="supplier";
   rscr["pagename"]="ADD-SUPPLIER";
   iidf["0"]["ph"]="Add Supplier-Name";
   iidf["0"]["cssearch"]="supplier";
   iidf["0"]["url"]="http://localhost:80/partysearchenter?";
   iidf["6"]["cssearch"]="supplier_area";
   iidf["6"]["url"]="http://localhost:80/addtodb?";
   
 }
 else{
   rscr["cs"]="customer";
   rscr["cssearch"]="customer";
   rscr["pagename"]="ADD-CUSTOMER";
   iidf["0"]["ph"]="Add Customer-Name";
   iidf["0"]["cssearch"]="customer";
   iidf["0"]["url"]="http://localhost:80/partysearchenter?";
   iidf["6"]["cssearch"]="customer_area";
   iidf["6"]["url"]="http://localhost:80/addtodb?";

   
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
 
   if(key==="area" || key==="igroup" || key==="irack" || key==="comp" || key==="hsn" || key==="sup"){
     cisInput[id] = val;
     setcisData(cisInput);
     if (Object.keys(obj).length>0){
       setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "db_data":obj }}));
       setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "info":`Select [ ${obj.name} ] as ${iidf[id].ph} `}}));
       //console.log(key, "ckkkkkk available", fillone);
       return;
     }else{
       setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "db_data":null }}));
       setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "info":`Add [ ${val.toUpperCase()} ] as New ${iidf[id].ph} `}}));
       //console.log(key, "NNOTT available", fillone);
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
        setiidf(previidf => ({...previidf,[id]: { ...previidf[id], "info":` [ ${val.toUpperCase()} ] as ${iidf[id].ph} `}}));
        cisInput[id] = val;
        setcisData(cisInput);
        console.log("dddd ", fillone, key, val, getiidf[id].value)
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


   function onCustomerClick(e){clearAllField("0", "", fielddata);navigation("/addcis?"+keyc)};
   function onItemClick(e){clearAllField("0", "", fielddata);navigation("/addcis?"+keyi)};
   function onSupplierClick(e){clearAllField("0", "", fielddata);navigation("/addcis?"+keys)};

   function toggleButton(p1, p2){
   document.getElementById("save").style.display = p1;
   document.getElementById("delete").style.display = p1;
   document.getElementById("reset").style.display = p1;
   document.getElementById("confirm").style.display = p2;
   document.getElementById("cancel").style.display = p2;
   }

   function onSave(e){
     
     let validate = true;
     
     
     for (const mobj of Object.entries(getiidf)){
       var obj = mobj[1];
       if(obj["req"]){
         //console.log(isEmpty(obj["value"]),obj["value"], obj)
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
       //console.log(obj["value"], obj["db_data"])
     }
     if(getiidf[0]["in"]){
       document.getElementById('statusinfo2').innerHTML = "Ready to SAVE Records";
     }else{
       document.getElementById('statusinfo2').innerHTML = "Ready to UPDATE Records";
       
     }
     if(!validate){
       console.log("cannot Save of Update, do not move for confirmation button")
     }else{toggleButton("none", "block");}
       
   }

   function onDelete(e){
     document.getElementById('statusinfo2').innerHTML = "DataBase Warning for Delete Show Confirm Button ";
     console.log("Delete Pressed")
     toggleButton("none", "block");
   }

   function onReset(e){
     document.getElementById('statusinfo2').innerHTML = "Reset All Fields";
     console.log("Reset Pressed")
     clearAllField("0", "", fielddata)
   }

   

   function onConfirm(e){

    let addcompbool = false;
    let mode = "save";    
    let cs = whichPage;
    let getcolumn = "all";
    let text = {};

    if(whichPage === "items"){
  
      if (getiidf['5']['db_data'] === null) {
        addcompbool = true;
      } 
      if (typeof (getiidf['0']['db_data']['_id']) !== 'undefined') {
        mode = "update";
      }     

      text = {
        addcomp: addcompbool,
        _id: getiidf['0']['db_data']['_id'],
        name: getiidf['0']['value'],
        unit: getiidf['1']['value'],
        pack: getiidf['2']['value'],
        igroup: getiidf['3']['value'],
        irack: getiidf['4']['value'],
        comp: getiidf['5']['value'],
        prate: getiidf['6']['value'],
        srate: getiidf['7']['value'],
        mrp: getiidf['8']['value'],
        igst: getiidf['9']['value'],
        cgst: getiidf['10']['value'],
        sgst: getiidf['11']['value'],
        hsn: getiidf['12']['value'],
        sup: getiidf['13']['value'],
        compname: getiidf['5']['value'],
        cmnt: getiidf['14']['value'],
        compid : getiidf['0']['db_data']['compid'],
        itemid: getiidf['0']['db_data']['itemid'],
        netrate: getiidf['0']['db_data']['netrate'],
        dis: getiidf['0']['db_data']['dis'],
        csid: getiidf['0']['db_data']['csid'] ,

      };
    
    }
    if(whichPage === "supplier")
    {      
      if (typeof (getiidf['0']['db_data']['_id']) !== 'undefined') {
        mode = "update";
      }   
      text = {
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
      console.log(getiidf);
      
      if (typeof (getiidf['0']['db_data']['_id']) !== 'undefined') {
        mode = "update";
      }   
      text = {
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
      text: text,
      cs: cs,
      getcolumn: getcolumn,
      mode: mode,
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
      document.getElementById('statusinfo2').innerHTML = `${data} ` +` ${mode} to DataBase `;
      onReset();
    })
    .catch(error => {
      console.log(error);
    });
    
            
     console.log("Confirm Pressed")
     toggleButton("block", "none");
   }

   function onCancel(e){
     document.getElementById('statusinfo2').innerHTML = "Cancel Button Pressed";
     console.log("Cancel Pressed")
     toggleButton("block", "none");
   }

   function onBack(e){navigation("/dashboard");}

return (

<>
 <div>
   <label hidden="hidden" id='cs'>{iidf["1"]["cssearch"]}</label>  
   <div className="container" id="container" >
    {/* <div className="addpanel" id="addpanel">
        <table id="cis" className="addtable" >
       <thead><tr><td>
         <button className="btm"  id="c" value="customer" onClick={onCustomerClick} >Customer</button>
         <button className="btm"  id="i" value="items" onClick={onItemClick} >Items</button>
         <button className="btm"  id="s" value="supplier" onClick={onSupplierClick} >Supplier</button>
          </td></tr></thead>
     </table>
      </div> */}
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
</>

 );

};

export default index;
