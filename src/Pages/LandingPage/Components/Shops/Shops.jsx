import React, { useState, useContext , useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import "./shops.css";
import DrugImage from "../../assets/shopImages/n1.jpg";
import Shop1 from "../../assets/shopImages/f1.jpg";
import Shop2 from "../../assets/shopImages/f2.jpg";
import Shop3 from "../../assets/shopImages/f3.jpg";
import Shop4 from "../../assets/shopImages/f4.jpg";
import Shop5 from "../../assets/shopImages/f5.jpg";
import Shop6 from "../../assets/shopImages/f6.jpg";
import Shop7 from "../../assets/shopImages/f7.jpg";
import Shop8 from "../../assets/shopImages/f8.jpg";
import { UserDataContext } from "../../../../context/Context";
const Shops = ({ itemShop }) => {
  const userContext = useContext(UserDataContext);
  const [selectedLocation, setSelectedLocation] = useState("Ghaziabad");
  const [shopsData, setShopsData] = useState([]);
  const [isExpanded,setIsExpanded] = useState(false)
  const [ratings, setRatings] = useState([].fill(0));
  const [mediratings, setMediRatings] = useState([].fill(0));
  const navigateTo = useNavigate();
  useEffect(() => {
    const fetchData = () => {
      const requestData = {
        place: selectedLocation,
      };

      fetch(`${userContext.api}/initland`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((responseData) => {
          console.log("---", responseData);
          setShopsData(responseData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    fetchData();
  }, [selectedLocation]);
  const MedicinesData = [
    {
      id: 1,
      name: "Azithromycin",
      image: Shop1,
    },
    {
      id: 2,
      name: "Morfit",
      image: Shop2,
    },
    {
      id: 3,
      name: "Mefinamic Acid",
      image: Shop3,
    },
    {
      id: 4,
      name: "Alpha Dope",
      image: Shop4,
    },
    {
      id: 5,
      name: "Konzip",
      image: Shop5,
    },
    {
      id: 6,
      name: "Albendazole",
      image: Shop6,
    },
    {
      id: 7,
      name: "Morgan",
      image: Shop7,
    },
    {
      id: 8,
      name: "Deca",
      image: Shop8,
    },
  ];
  

  const handleShopCardClick = (shop) => {
    navigateTo(`/${shop.username}`, { state: { shopData: shop } });
  };

  
  const handleLocationChange = (event) => {
    const newLocation = event.target.value;
    setSelectedLocation(newLocation);
  };
  const handleStarClick = (shopIndex, starIndex) => {
    const newRatings = [...ratings];
    newRatings[shopIndex] = starIndex + 1;
    setRatings(newRatings);
  };
  const handleMediStarClick = (mediIndex, starIndex) => {
    const newMediRatings = [...mediratings];
    newMediRatings[mediIndex] = starIndex + 1;
    setmediRatings(newMediRatings);
  }
  const showData = () => {
    if (itemShop === "item") {
      return (
        <>
          <div className="container-shops-location-details">
            <div className="location-info"></div>
          </div>
          <div className="shops-cards shop-cards-mobile">
             {MedicinesData.map((medi, mediIndex) => (
              <div key={medi.id} className="shop-card">
                <img src={DrugImage} alt={medi.name} className="shop-image" />
                <div className="shop-details">
                  <div className="rating">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <span
                        key={starIndex}
                        className={`star ${
                          starIndex < mediratings[mediIndex] ? "filled" : ""
                        }`}
                        onClick={() => handleMediStarClick(mediIndex, starIndex)}
                      >
                        ★
                      </span>
                    ))}
                    <h3 className="shop-name">{medi.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    } else if (itemShop === "shop") {
      return (
        <>
        <div id="shops" className="container-shops-location-details">
          <div className="location-info">
            We are <span className="tagline-slogan-span">Available</span> Here
            <select
              className="locations"
              name="locations"
              id="locations"
              onChange={handleLocationChange}
              value={selectedLocation}
            >
              <option value="Ghaziabad">Ghaziabad</option>
              <option value="Banglore">Banglore</option>
              <option value="Delhi">Delhi</option>
              <option value="Deoria">Deoria</option>
            </select>
          </div>
        </div>
          <div className="shops-cards shop-cards-mobile">
            {shopsData.slice(0,isExpanded?shopsData.length:8).map((shop, shopIndex) => (
              <div key={shop.id} className="shop-card" onClick={() => handleShopCardClick (shop)}>
                <img src={`${userContext.api}/${shop.imagePath}`} alt={shop.shopName} className="shop-image" />
                <div className="shop-details">
                  <div className="rating">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <span
                        key={starIndex}
                        className={`star ${
                          starIndex < ratings[shopIndex] ? "filled" : ""
                        }`}
                        onClick={() => handleStarClick(shopIndex, starIndex)}
                      >
                        ★
                      </span>
                    ))}
                    <h3 className="shop-name">{shop.shopname}</h3>
                  <p className="shop-location">{shop.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="show-btn-container">
              <span onClick={()=>setIsExpanded(!isExpanded)} className="show-btn">{isExpanded?"Show less":"Show more"}</span>
            </div>
        </>
      );
    }
  };

  return <>{showData()} </>;
};

export default Shops;
