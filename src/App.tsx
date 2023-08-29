import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LandingPage from "./Pages/LandingPage/Index.jsx"
import LoginPage from "./Pages/LoginPage";
import AdminPage from "./Pages/AdminPage";
import AdminPanel from "./Pages/AdminPanel";
import SignupPage from "./Pages/SignupPage";
import Dashboard from "./Pages/Dashboard";
import ErrorPage from "./Pages/ErrorPage";
import PurchaseSection from "./Pages/Dashboard/sections/Purchase";
import AddItem from "./Pages/Dashboard/sections/Add-Item";
import SearchSP from "./Pages/Dashboard/sections/SearchSP";
import PayRcpt from "./Pages/Dashboard/sections/PayRcpt";
import GstReports from "./Pages/Dashboard/sections/GSTReports";
import { UserDataContext } from "./context/Context";
import { useContext, useState, useEffect } from "react";
const rscr = {cs: "supplier", pagename : "", cssearch : "supplier", sdates : {}}
const rscrItem = {cs: "supplier", pagename : "", cssearch : "supplier"}
const rscrSupplier = {cs: "supplier", pagename : "", cssearch : "supplier"}
const rscrCustomer = {cs: "supplier", pagename : "", cssearch : "supplier"}
const browserRouter = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "adminpanel", element: <AdminPanel /> },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          { path: "purchase", element: <PurchaseSection whichPage="purchase" idf="supplier" edit={false} pageName="purchase" /> },
          { path: "sales", element: <PurchaseSection whichPage="sale" idf="customer" edit={false} pageName="sale" /> },
          { path: "search-purchase", element: <SearchSP idf="supplier" sp="purchase" searchroutes = "/sppartysearch"/>},
          { path: "search-sales", element: <SearchSP idf="customer" sp="sale" searchroutes = "/sppartysearch" />},

          { path: "speditpage_purchase", element: <PurchaseSection whichPage="purchase" idf="supplier" edit={true} pageName="editpurchase"/> },
          { path: "speditpage", element: <PurchaseSection whichPage="sale" idf="customer" edit={true} pageName="editsale" /> },
          
          { path: "add-item", element: <AddItem rscr={rscrItem} whichPage="items" />},
          { path: "add-supplier", element: <AddItem rscr={rscrSupplier} whichPage="supplier" />},
          { path: "add-customer", element: <AddItem rscr={rscrCustomer} whichPage="customer" />},

          { path: "cash-ledger", element: <SearchSP idf="cashledger" sp="cashledger" searchroutes = "/ledgersearch" />},
          { path: "customer-ledger", element: <SearchSP idf="customer" sp="saleledger" searchroutes = "/ledgersearch" />},
          { path: "supplier-ledger", element: <SearchSP idf="supplier" sp="purchaseledger" searchroutes = "/ledgersearch" />},

          { path: "company-stock", element: <SearchSP idf="company-stock" sp="Updatecompanystock" searchroutes = "/ledgersearch" />},
          { path: "receipt", element: <PayRcpt idf="customer" sp="receipt" crdr="DEBIT" searchroutes="/payrcpt" />},
          { path: "payment", element: <PayRcpt idf="supplier" sp="payment" crdr="CREDIT" searchroutes="/payrcpt" />},
          { path: "gstr1", element: <GstReports idf="customer" sp="sale"  searchroutes="/gstreports" />},
          { path: "gstr2", element: <GstReports idf="supplier" sp="purchase" searchroutes="/gstreports" />},
          { path: "gst-summary", element: <SearchSP idf="gst-summary" sp="gstsummary" searchroutes = "/ledgersearch" />},
        ],
      },
    ],
  },
]);

function App() {
  const api =   "http://localhost:8080";//"http://meditradesoft.in:8080";   //"http://192.168.29.116"; //localhost add
  const [store, setStore] = useState({ owner: { cal: null } });
  const [isLoading, setLoading] = useState(true);

  const updateStore = (data) => {
    setStore(data);
    setLoading(false);
  };

  

  useEffect(() => {
    const loadFromLocalStorage = () => {
      const data = localStorage.getItem("rscr");
      if (data) {
        const parsedData = JSON.parse(data);
        updateStore(parsedData);
      } else {
        setLoading(false);
      }
    };
    const timer = setTimeout(loadFromLocalStorage, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <div className="ring">Loading
        <span></span>
      </div>
      ) : (
        <UserDataContext.Provider value={{ api, store, updateStore }}>
          <RouterProvider router={browserRouter} />
        </UserDataContext.Provider>
      )}
    </div>
  );
}

export default App;

