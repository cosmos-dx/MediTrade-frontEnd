import React, { useState, useContext } from "react";
import "../../assets/css/mystyles.css";
import logo from "../../assets/logo.svg"
import GoogleMapReact from "google-map-react";
import { UserDataContext } from "../../../../context/Context";;
function Index() {
  const [clickedLocation, setClickedLocation] = useState({
    lat: null,
    lng: null,
  });
  const [currentLocation, setCurrentLocation] = useState({
    coords: { lattitude: 28.640552786049202, longitude: 77.22074051949213 },
  });
  const userContext = useContext(UserDataContext);
  const handleMapClick = (event) => {
    const latitude = event.lat;
    const longitude = event.lng;
    setClickedLocation({ lat: latitude, lng: longitude });

    fetch(`${userContext.api}/nearestShops?latitude=${latitude}&longitude=${longitude}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
       console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="nearest">
      <div className="nearest-main">
        <div className="search-bar">
            <img src={logo} alt="" />
            <input type="text" placeholder="Search Nearest Stores" />
        </div>
        <div className="map-holder">
          
          <div className="nearest-stores">
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyBcjOCY2sK1-HXkxsQUqISRRYqF9p9Ul8U",
              }}
              defaultZoom={11}
              defaultCenter={{
                lat: currentLocation?.coords.lattitude,
                lng: currentLocation?.coords.longitude,
              }}
              onClick={(event) => handleMapClick(event)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
