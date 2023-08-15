import React, { useState } from "react";
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
const Shops = ({ itemShop }) => {
  const shopsData = [
    {
      id: 1,
      name: "Jai Durga Medical Store",
      location: "Lal Kuwan",
      image: Shop1,
    },
    {
      id: 2,
      name: "Omkar Medical Store",
      location: "Raj Nagar",
      image: Shop2,
    },
    {
      id: 3,
      name: "Praveen Medical Store",
      location: "Meerut Road",
      image: Shop3,
    },
    {
      id: 4,
      name: "Kishan Medical Store",
      location: "5 no Stone",
      image: Shop4,
    },
    {
      id: 5,
      name: "Chitra Medicals",
      location: "Sanjay Nagar",
      image: Shop5,
    },
    {
      id: 6,
      name: "Kumabh Medical",
      location: "Sector 10",
      image: Shop6,
    },
    {
      id: 7,
      name: "Astri Medicals",
      location: "Turab Nagar",
      image: Shop7,
    },
    {
      id: 8,
      name: "Dashmesh Medical Store",
      location: "Gaur City",
      image: Shop8,
    },
  ];
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
  
  
  const [ratings, setRatings] = useState([].fill(0));
  const [mediratings, setmediRatings] = useState([].fill(0));

  const handleStarClick = (shopIndex, starIndex) => {
    const newRatings = [...ratings];
    newRatings[shopIndex] = starIndex + 1;
    console.log(shopIndex, starIndex);
    setRatings(newRatings);
  };
  const handleMediStarClick = (mediIndex, starIndex) => {
    const newMediRatings = [...mediratings];
    newMediRatings[mediIndex] = starIndex + 1;
    console.log(mediIndex, starIndex);
    setmediRatings(newMediRatings);
  }
  const showData = () => {
    if (itemShop === "item") {
      return (
        <>
          <div className="container-shops-location-details">
            <div className="location-info"></div>
          </div>
          <div className="shops-cards">
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
          <div className="container-shops-location-details">
            <div className="location-info">
              We are <span className="tagline-slogan-span">Available</span> Here
              <select className="locations" name="locations" id="locations">
                <option value="Ghaziabad">Ghaziabad</option>
                <option value="Banglore">Banglore</option>
                <option value="Delhi">Delhi</option>
                <option value="Deoria">Deoria</option>
              </select>
            </div>
          </div>
          <div className="shops-cards">
            {shopsData.map((shop, shopIndex) => (
              <div key={shop.id} className="shop-card">
                <img src={shop.image} alt={shop.name} className="shop-image" />
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
                    <h3 className="shop-name">{shop.name}</h3>
                  <p className="shop-location">{shop.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  return <>{showData()} </>;
};

export default Shops;
