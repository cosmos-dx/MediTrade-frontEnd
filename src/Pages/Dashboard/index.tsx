import "./dashboard.css";
import logo from "../../assets/logo_nearMed.svg";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../../context/Context";
import { useLocation } from "react-router-dom";
import rupeeSymbol from "./Indian-Rupee-symbol.svg";
import saleicon from "../../assets/images/sales.svg";
import purchaseicon from "../../assets/images/purchase.svg";
import totalProdicon from "../../assets/images/totalProducts.svg";
import partyName from "../../assets/images/partyname.svg";
import billNo from "../../assets/images/billno.svg";
import billDate from "../../assets/images/billdate.svg";
import trtype from "../../assets/images/trtype.svg";
import ApexChart from '../../assets/js/ApexChart.jsx';
import UserInfoDropDown from "../Dashboard/Components/UserInfoComponent";
export default function index() {
  const navigateTo = useNavigate();
  const location = useLocation();
  const userContext = useContext(UserDataContext);
  const [fystr, setfystr] = useState("Select Financial Year");
  const [finYearList, setFinYearList] = useState([]);
  const [isFinYearSelected, setIsFinYearSelected] = useState(false);
  const [totalSales, settotalSales] = useState(0.0);
  const [totalPurchase, settotalPurchase] = useState(0.0);
  const [totalProducts, settotalProducts] =useState(0);
  const [recpurchase, setrecpurchase] = useState({});
  const [recsale, setrecsale] = useState([{}]);
  const [avtaar, setavtaar] = useState(userContext.store.ownerimageURL);
  const [navlinkKey, setnavlinkKey] = useState(Date.now());

  function resetStore(){
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid: {[0] : userContext.store.recdic.itemtemplate},},}));
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
  
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("username");
    if (loggedInUser) {
    } 
    else {
      navigateTo("/");
    }
  }, []);

  

const populateTotalSP = (idf) => {
  const today = new Date();
      const fromday = new Date(today);
      fromday.setMonth(today.getMonth() - 1);

      const todayDateString = today.toISOString().split('T')[0];
      const fromdayDateString = fromday.toISOString().split('T')[0];
    const requestData = {
      idf : idf,
      today: todayDateString, 
      fromday: fromdayDateString,
    };
    

    fetch(`${userContext.api}/getTotalsp`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((res) => res.json())
      .then((data) => {
        if(idf === "recentpurchase"){
          
          setrecpurchase(data);
        }
        if(idf === "products") settotalProducts(data);
        if(idf === "recentsale") setrecsale(data);
        if(data.sales) settotalSales(data.sales);
        else if(data.purchase) settotalPurchase(data.purchase);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
}

  useEffect(() => {
    
    if (!userContext.store.owner.cal || 
      userContext.store.owner.cal === undefined || 
      userContext.store.owner.cal === null || 
      userContext.store.owner.cal === "" || !Array.isArray(userContext.store.owner.cal) ||
      userContext.store.owner.cal.length === 0
      ) 
    {    
      return;
    }
    else {
      setFinYearList(() => [...userContext.store.owner.cal] || 0);
      populateTotalSP("sales");
      populateTotalSP("purchase");
      populateTotalSP('recentpurchase');
      populateTotalSP('recentsale');
      populateTotalSP('products');
    }
    
  }, []);
  return (
    <div className="dashboard">
      <div className="dashboard-sidebar mobile-dashboard-sidebar">
        <div className="sidebar-header">
          <Link to={"/"}>
            <img src={logo} alt="MediTrade Logo" className="logo" />
          </Link>
          <select
            onChange={(e) => {
              fetch(`${userContext.api}/selectfyear`, {
                method: "post",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  action: "action",
                  type: "fyear",
                  daterow: JSON.parse(e.target.value),
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  userContext.updateStore(data);
                });
                
                setIsFinYearSelected(true);
                var sv = JSON.parse(e.target.value);
                setfystr(`FROM ${sv["frm"]} TO ${sv["tod"]}`)
            }}
            name=""
            id=""
          >
            <option value="none">{fystr}</option>
            {finYearList.map((yearObj) => {
              return (
                <option key={yearObj["_id"]} value={JSON.stringify(yearObj)}>
                  From {yearObj.frm} to {yearObj.tod}
                </option>
              );
            })}
          </select>
          {!isFinYearSelected && (
            <p className="select-fin-year-paragraph">Please select a financial year</p>
          )}
        </div>
        <ul className="sidebar-items">
          <li>
          <NavLink
          key={navlinkKey}
              to={"purchase"}
              onClick={resetStore}
              className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
              end
            >
              Purchase
            </NavLink>
          </li>
          <li>
          <NavLink
            key={navlinkKey}
              to={"sales"}
              onClick={resetStore}
              className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
              end
            >
              Sales
            </NavLink>
          </li>
          <li>
            <NavLink to={"search-purchase"}
            onClick={resetStore}
            className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            end>
              Search Purchase
            </NavLink>
          </li>
          <li>
            <NavLink to={"search-sales"} className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              Search Sales
            </NavLink>
          </li>
          <li>
            <NavLink to={"add-item"} className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              Add Item
            </NavLink>
          </li>
          <li>
            <NavLink to={"add-supplier"} className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              Add Supplier
            </NavLink>
          </li>
          <li>
            <NavLink to={"add-customer"} className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              Add Customer
            </NavLink>
          </li>
          <li>
            <NavLink to={"cash-ledger"}className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              Cash Ledger
            </NavLink>
          </li>
          <li>
            <NavLink to={"customer-ledger"}className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              Customer Ledger
            </NavLink>
          </li>
          <li>
            <NavLink to={"supplier-ledger"} className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              Supplier Ledger
            </NavLink>
          </li>
          <li>
            <NavLink to={"company-stock"} className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              Company Stock Adjustment
            </NavLink>
          </li>
          
          <li>
            <NavLink to={"receipt"} className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              Receipt
            </NavLink>
          </li>
          <li>
            <NavLink to={"payment"} className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              Payment
            </NavLink>
          </li>
          <li>
            <NavLink to={"gstr1"} className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              GSTR 1
            </NavLink>
          </li>
          <li>
            <NavLink to={"gstr2"} className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              GSTR 2
            </NavLink>
          </li>
          <li>
            <NavLink to={"gst-summary"} className={`sidebar-link ${!isFinYearSelected ? "disabled-link" : ""}`}
            onClick={resetStore}
              end>
              GSTR 3
            </NavLink>
          </li>

        </ul>
      </div>
      <div className="dashboard-main mobile-dashboard">
        <Outlet />
        {location.pathname === "/dashboard" && (
        <div className="dashboard-cover">
          <div className= "dashboard-sections">
            <div className="user-info">
              <div className="tagName">
                Dashboard
              </div>
              <div className="user-info-display">
                <div className="user-avatar">
                  
                <img src={`${userContext.api}${avtaar}`} alt="Profile" />
                  <UserInfoDropDown />
                </div>
                <div>{sessionStorage.getItem('username')}</div>
                
              </div>
            </div>
            
           
             <div className="dashboard-info dashboard-info-mobile">
                <div className="dashboard-info-sales">
                <img className= "sicon" src={saleicon} alt="" />
                <div className="dashboard-info-sales-values">
                    <p>Total Sales</p>
                    <div className="dashboard-info-sales-values-fin">
                      <img src={rupeeSymbol} alt="" />
                      <h2>{totalSales}</h2> 
                    </div>
                </div>
                </div>
                <div className="dashboard-info-sales">
                <img className= "picon" src={purchaseicon} alt="" />
                <div className="dashboard-info-sales-values">
                    <p>Total Purchase</p>
                    <div className="dashboard-info-sales-values-fin">
                      <img src={rupeeSymbol} alt="" />
                      <h2>{totalPurchase}</h2> 
                    </div>
                </div>
                </div>
                <div className="dashboard-info-sales">
                <img className= "prodicon" src={totalProdicon} alt="" />
                <div className="dashboard-info-sales-values">
                    <p>Total Products</p>
                    <div className="dashboard-info-sales-values-fin">
                      <img src={rupeeSymbol} alt="" />
                      <h2>{totalProducts}</h2> 
                    </div>
                </div>
                </div>
             </div>
             <div className= "dashboard-center">
                <div className="dashboard-center-first">
                <ApexChart />
                </div>
                &nbsp; &nbsp; &nbsp;
                <div className="dashboard-center-second">
                   <p>Recent Purchase Report</p>
                   <div className="dashboard-center-second-data">
                   <div className="dashboard-center-second-data-heads">
                      <img src={partyName} alt="" />
                      <h4>Party Name</h4>
                    </div>
                      <p>{recpurchase['name']}</p>
                   </div>
                   <div className="dashboard-center-second-data">
                   <div className="dashboard-center-second-data-heads">
                      <img src={billNo} alt="" />
                      <h4>Bill No</h4>  
                    </div>
                    <p>{recpurchase['billno']}</p>
                   </div>
                   <div className="dashboard-center-second-data">
                   <div className="dashboard-center-second-data-heads">
                      <img src={billDate} alt="" />
                      <h4>Bill Date</h4>
                    </div>
                    <p>{recpurchase['billdate']}</p>

                   </div>
                   <div className="dashboard-center-second-data">
                   <div className="dashboard-center-second-data-heads">
                      <img src={trtype} alt="" />
                      <h4>Trns. Type</h4>
                    </div>
                    <p>{recpurchase['cscr'] === 1 ? 'Cash' : recpurchase['cscr'] === 2  ? 'Credit'  : recpurchase['cscr'] === 3 ?'Challan': ""}</p>
                   </div>
                   <div className="dashboard-center-second-data">
                    <div className="dashboard-center-second-data-heads">
                      <img src={rupeeSymbol} alt="" />
                      <h4>Amount</h4>
                    </div>
                    <p>{recpurchase['amount']}</p>
                   </div>
                </div>
             </div>

             <div className="dashboard-bottom">
              <p>Recent Sales</p>
                  <table className="dashboard-search-table">
                    <thead>
                    <tr className="dashboard-search-table-header">
                      <th>inv. Date</th>
                      <th>Inv No</th>
                      <th>inv Type</th>
                      <th>Party Name</th>
                      <th>Amount</th>
                    </tr>
                    </thead>
              
                    <tbody>
                      {recsale.map((value, index) => (
                          <tr key={index} onClick={() => console.log(recsale[index])}>
                            {<td>{value.billdate}</td>}
                            {<td>{value.billno}</td>}
                            {<td>{value.cscr === 1 ? "CASH" : value.cscr === 2 ? "CREDIT" : value.cscr === 3? "CHALLAN" : ""}</td>}
                            {<td>{value.name}</td>}
                            {<td>{value.amount}</td>}
                          </tr>
                        ))}
                    </tbody>
                  </table>
     
             </div>
          </div>
        </div>
        )}
        
      </div>
    </div>
  );
}
