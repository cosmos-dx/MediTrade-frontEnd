import React, { useState, useContext, useEffect } from "react";
import "./searchdata.css";
import search_icon from "../../assets/images/search-icon.png";
import { UserDataContext } from "../../../../context/Context";
import RuppeSymbol from "../../../Dashboard/Indian-Rupee-symbol.svg";
import capsule from "../../assets/images/capsule.png";
import salt from "../../assets/images/alternatesalt.png";
import SorryHere from "../../assets/images/sorryhere.jpg";
function Index({ shopOwnerData }) {
  const userContext = useContext(UserDataContext);
  const [searchValue, setSearchValue] = useState("");
  const [byNameResults, setByNameResults] = useState([]);
  const [bySaltResults, setBySaltResults] = useState([]);
  const [activeSearchType, setActiveSearchType] = useState("ByName");
  const [cartItemsCount, setCartItemCounts] = useState({});

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    handleSearch();
  }, [searchValue, activeSearchType]);

  const handleSearch = () => {
    console.log(searchValue);
    let searchedData = {
      shopOwnerData: shopOwnerData,
      searchValue: searchValue,
      searchMethod: "",
    };
    console.log("---->>>>>>--", activeSearchType);
    if (activeSearchType === "ByName") {
      searchedData["searchMethod"] = "name";
      setBySaltResults([]);
    } else {
      searchedData["searchMethod"] = "salt";
      setByNameResults([]);
    }
    fetch(`${userContext.api}/searchMedicine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchedData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        setByNameResults(responseData["success"]);
        setBySaltResults(responseData["success"]);
      })
      .catch((error) => {
        console.error("Error (By Name):", error);
      });
  };

  const handleAddToCart = (medicine) => {
    const updatedResults = byNameResults.map((result) => {
      if (result._id === medicine._id) {
        return { ...result, quantity: (result.quantity || 0) + 1 };
      }
      return result;
    });
    setByNameResults(updatedResults);
  };

  const handleRemoveFromCart = (medicine) => {
    const updatedResults = byNameResults.map((result) => {
      if (result._id === medicine._id) {
        return { ...result, quantity: (result.quantity || 0) - 1 };
      }
      return result;
    });
    setByNameResults(updatedResults);
  };

  return (
    <div className="search-container">
      <div className="search-input-container">
        <input
          onClick={() => {
            userContext.setShowSearchResult(true);
          }}
          type="text"
          className="search-input"
          placeholder={"Search Medicines Here In Our Shop ... "}
          value={searchValue}
          onChange={handleSearchChange}
        />
        <img src={search_icon} alt="" />
      </div>
      {userContext.showSearchResult ? (
        <div className="search-results">
          <div className="shopOwner-search-results-fragments">
            <h4
              onClick={() => setActiveSearchType("ByName")}
              className={`
                by-salt-btn ${
                  activeSearchType === "ByName"
                    ? "active-search-type by-name-active"
                    : "inactive-search-type"
                }
              `}
            >
              By Name
            </h4>
            <h4
              onClick={() => setActiveSearchType("BySalt")}
              className={`
                by-salt-btn ${
                  activeSearchType === "BySalt"
                    ? "active-search-type by-salt-active"
                    : "inactive-search-type"
                }
              `}
            >
              By Salt
            </h4>
          </div>

          {activeSearchType === "ByName" ? (
            <div className="medicinal-searchOwner-data">
              {console.log(byNameResults)}
              {byNameResults.length === 0 ? (
                <div className="Sorry-Medicine-Not-Found">
                  <img src={SorryHere} alt="" />
                  <p>Sorry !!!</p>
                  <p>We are'nt available with this medicine.</p>
                </div>
              ) : (
                byNameResults.map((result) => (
                  <div
                    className="medicinal-searchOwner-data-values"
                    key={result._id}
                  >
                    <div className="medicinal-searchOwner-data-values-name">
                      <img src={capsule} alt="" />
                      <p>{result.name}</p>
                      <p>
                        Price : <img src={RuppeSymbol} alt="" />{" "}
                        <span className="medicine-price-shopOwnerPage">
                          {result.mrp}
                        </span>
                      </p>
                    </div>
                    <div className="medicinal-searchOwner-data-values-prices">
                      <img src={salt} alt="" />
                      <p className="">Salt : {result.salt}</p>
                      <p className="">GST % : {result.gst}</p>
                    </div>
                    <div className="medicinal-searchOwner-data-values-name-button">
                      <div>
                        <button
                          className="medicinalplusminusbutton"
                          onClick={() => {
                            if (cartItemsCount[result._id]) {
                              setCartItemCounts((prev) => ({
                                ...prev,
                                [result._id]: cartItemsCount[result._id] + 1,
                              }));
                              return;
                            }
                            setCartItemCounts((prev) => ({
                              ...prev,
                              [result._id]: 1,
                            }));
                          }}
                        >
                          +
                        </button>
                        <span>{cartItemsCount[result._id] || 0}</span>
                        <button
                          className="medicinalplusminusbutton"
                          onClick={() => {
                            if (cartItemsCount[result._id]) {
                              setCartItemCounts((prev) => ({
                                ...prev,
                                [result._id]: cartItemsCount[result._id] - 1,
                              }));
                              return;
                            }
                            setCartItemCounts((prev) => ({
                              ...prev,
                              [result._id]: 0,
                            }));
                          }}
                        >
                          -
                        </button>
                      </div>
                      <button className="medicinalplusminusaddbutton">
                        +Add
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="medicinal-searchOwner-data">
              {bySaltResults.length === 0 ? (
                <div className="Sorry-Medicine-Not-Found">
                  <img  src={SorryHere} alt="" />
                  <p>Sorry !!!</p>
                  <p>We are'nt available with this medicine.</p>
                </div>
              ) : (
                bySaltResults.map((result) => (
                  <div
                    className="medicinal-searchOwner-data-values"
                    key={result._id}
                  >
                    <div className="medicinal-searchOwner-data-values-name">
                      <img src={salt} alt="" />
                      <p>{result.salt}</p>
                      <p>
                        Price : <img src={RuppeSymbol} alt="" />{" "}
                        <span className="medicine-price-shopOwnerPage">
                          {result.mrp}
                        </span>
                      </p>
                    </div>
                    <div className="medicinal-searchOwner-data-values-prices">
                      <img src={capsule} alt="" />
                      <p className="">Name : {result.name}</p>
                      <p className="">GST % : {result.gst}</p>
                    </div>
                    <div className="medicinal-searchOwner-data-values-name-button">
                      <div>
                        <button
                          className="medicinalplusminusbutton"
                          onClick={() => {
                            if (cartItemsCount[result._id]) {
                              setCartItemCounts((prev) => ({
                                ...prev,
                                [result._id]: cartItemsCount[result._id] + 1,
                              }));
                              return;
                            }
                            setCartItemCounts((prev) => ({
                              ...prev,
                              [result._id]: 1,
                            }));
                          }}
                        >
                          +
                        </button>
                        <span>{cartItemsCount[result._id] || 0}</span>
                        <button
                          className="medicinalplusminusbutton"
                          onClick={() => {
                            if (cartItemsCount[result._id]) {
                              setCartItemCounts((prev) => ({
                                ...prev,
                                [result._id]: cartItemsCount[result._id] - 1,
                              }));
                              return;
                            }
                            setCartItemCounts((prev) => ({
                              ...prev,
                              [result._id]: 0,
                            }));
                          }}
                        >
                          -
                        </button>
                      </div>
                      <button className="medicinalplusminusaddbutton">
                        +Add
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Index;
