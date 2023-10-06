import React, { useContext } from "react";
import ReactStars from "react-rating-stars-component";
import { useLocation, useParams } from "react-router-dom";
import "./shopowner.css";
import Header from "../Header/Header";
import Footer from "../Footer/Index";
import Background from "../../assets/images/des1 (4).jpg";
import medicines from "../../assets/images/medicines.jpg";
import support from "../../assets/images/support.png";
import scrolls from "../../assets/images/scroll.svg";
import lessprice from "../../assets/images/lessPrice.png";
import openingHours from "../../assets/images/openingHours.png";
import { UserDataContext } from "../../../../context/Context";
import aboutus from "../../assets/images/aboutusshopowner.png";
const index = () => {
  const userContext = useContext(UserDataContext);
  const ratingChanged = (newRating) => {
    console.log(newRating);
  };
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
      <div className="shopOwner-mainsection">
        <div className="shoOwner-mainDisplay-section">
          <div className="shopOwner-tagline-section">
            <h2>
              Welcome to our website{" "}
              <span className="tagline-slogan-span">
                Jai Maa Durga Medical Store
              </span>{" "}
              get your Medicines at best price.
              {/* <span className="tagline-slogan-span">{shopData.shopName}</span> */}
              <p>
                <span className="tagline-slogan-span">Our Slogan</span>{" "}
                {shopData.tagline}
              </p>
            </h2>
            <div className="shopOwner-medicines-box">
              <a className="shopOwner-medicines">Find Medicines</a>
              <img src={scrolls} alt="" />
            </div>
          </div>
          <div className="shopWner-image-section"></div>
        </div>
        <div className="ShopOwner-card-section">
          <div className="shopOwner-cards">
            <img src={openingHours} alt="" />
            <p>Opening Hours </p>
            <p>We are open from 09:00-22:00. 24/7</p>
          </div>
          <div className="shopOwner-cards">
            <img src={lessprice} alt="" />
            <p>Less Prices</p>
            <p>You would get less price comperatively</p>
          </div>
          <div className="shopOwner-cards">
            <img src={support} alt="" />
            <p>24/7 Support</p>
            <p>You would get support 24/7 Contact us.</p>
          </div>
        </div>
      </div>
      <div className="shopOwner-about-section">
        <div className="shopOwner-about-image">
          <img src={`${userContext.api}/${shopData.imagePath}`} alt="" />
          <div className="shopOwner-about-image-rateus">
            <p>Rate Us </p>
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={54}
              isHalf={true}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#ffd700"
            />
          </div>
        </div>
        <div className="shopOwner-about-data">
          <div className="shopOwner-about-data-heading">
            <h2>About Us</h2>
            <img src={aboutus} alt="" />
          </div>
          <p>We have all the medicines you need with cheapest price.</p>
          <p>
            Our shop Name is{" "}
            <span className="tagline-slogan-span">{shopData.shopName}</span>
          </p>
          <p>
            We are at your district{" "}
            <span className="tagline-slogan-span">{shopData.district}</span>{" "}
            {shopData.state}
          </p>
          <p>
            near <span className="tagline-slogan-span">{shopData.address}</span>{" "}
          </p>
          <p>Our Motto is - {shopData.tagline} </p>
          <p>
            Our valid GST number is{" "}
            <span className="tagline-slogan-span">{shopData.GSTnumber}.</span>
          </p>
          <p>We provides you GST formated bill.</p>
          <p>You can prebook medcines from our service providers.</p>
          <p>
            We provide you <span className="tagline-slogan-span">24/7</span>{" "}
            service.
          </p>
          <p>You can find us on google map too.</p>
          <p>Please Rate us good. That would help us to grow.</p>
          <p>
            Explore our extensive selection of pharmaceuticals, <br />
            over-the-counter medications, health supplements, <br />
            and wellness products. <br />
            We meticulously curate our inventory to offer <br />
            you a wide array of options, all with a focus on safety, <br />
            efficacy, and affordability.
          </p>
        </div>
      </div>
      <br />
      <br />
      <div className="shopOwner-self-data">
          <div className="shopOwner-self-data-image">
          <img src={`${userContext.api}/${shopData.ownerimagePath}`} alt="" />
          </div>
          <div className="shopOwner-self-data-data">
              <h2>Shop Owner Contact - {shopData.phone}</h2>
          </div>
      </div>
      <Footer />
    </div>
  );
};

export default index;
