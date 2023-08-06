import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import Dashboard from "./Pages/Dashboard";
import ErrorPage from "./Pages/ErrorPage";
import PurchaseSection from "./Pages/Dashboard/sections/Purchase";
import SalesSection from "./Pages/Dashboard/sections/Sales";
import AddItem from "./Pages/Dashboard/sections/Add-Item";
import SearchSP from "./Pages/Dashboard/sections/SearchSP";
import SPedit from "./Pages/Dashboard/sections/SPedit";
import SearchEvery from "./Pages/Dashboard/sections/SearchEvery";
// import AddCustomer from "./Pages/Dashboard/sections/Add-Customer";
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
      { index: true, element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      {
        path: "dashboard",
        element: <Dashboard />,
        children: [
          { path: "purchase", element: <PurchaseSection whichPage="purchase" idf="supplier" /> },
          { path: "sales", element: <PurchaseSection whichPage="sale" idf="customer" /> },
          // { path: "sales", element: <SalesSection />},
          { path: "search-purchase", element: <SearchSP idf="supplier" sp="purchase" searchroutes = "/sppartysearch"/>},
          { path: "search-sales", element: <SearchSP idf="customer" sp="sale" searchroutes = "/sppartysearch" />},
          { path: "cash-ledger", element: <SearchSP idf="cashledger" sp="cashledger" searchroutes = "/ledgersearch" />},

          { path: "customer-ledger", element: <SearchSP idf="customer" sp="saleledger" searchroutes = "/ledgersearch" />},
          { path: "supplier-ledger", element: <SearchSP idf="supplier" sp="purchaseledger" searchroutes = "/ledgersearch" />},

          

          { path: "gst-summary", element: <SearchSP idf="gst-summary" sp="gstsummary" searchroutes = "/ledgersearch" />},
          { path: "company-stock", element: <SearchSP idf="company-stock" sp="Updatecompanystock" searchroutes = "/ledgersearch" />},
          { path: "speditpage", element: <SPedit whichPage="sale" idf="customer" />},
          { path: "speditpage_purchase", element: <SPedit whichPage="purchase" idf="supplier" />},
          // { path: "search-purchase", element: <SearchEvery rscr={rscr} whichPage="spurchase"/>},
          
          
          { path: "add-item", element: <AddItem rscr={rscrItem} whichPage="items" />},
          { path: "add-supplier", element: <AddItem rscr={rscrSupplier} whichPage="supplier" />},
          { path: "add-customer", element: <AddItem rscr={rscrCustomer} whichPage="customer" />},
        ],
      },
    ],
  },
]);

function App() {
  const userContext = useContext(UserDataContext);
  const api = "http://localhost";
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

