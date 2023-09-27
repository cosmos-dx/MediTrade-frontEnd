import React, { useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./shopowner.css";
import Header from "../Header/Header";
import Background from "../../assets/images/des1 (4).jpg";
import { UserDataContext } from "../../../../context/Context";
const index = () => {
  const userContext = useContext(UserDataContext);
  const { navUsername } = useParams();
  const location = useLocation();
  const shopData = location.state.shopData;
  console.log(shopData);
  if (!shopData) {
    return <div>sdfsdf...</div>;
  }

  return (
    <div className="shopOwner-main">
      <Header isShopOwnerPage={true} shopData={shopData} />
      <img src={Background} alt=""  className="shop-owner-background"/>
      <div className="shopOwner-displaydetails">
          <img
            src={`${userContext.api}/${shopData.imagePath}`}
            alt={shopData.shopName}
            className="shop-image"
          />
        <div className="shopOwner-shopName">
            <h2>Jai Maa Durga Medical Store</h2>
            {/* <h2>{shopData.shopName}</h2> */}
        </div>

          <img
            src={`${userContext.api}/${shopData.ownerimagePath}`}
            alt={shopData.shopName}
            className="owner-image"
          />
      </div>
    </div>
  );
};

export default index;
