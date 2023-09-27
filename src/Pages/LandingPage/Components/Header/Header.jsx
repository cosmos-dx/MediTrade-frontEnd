import React from "react";
import "./header.css";
import cartlogo from "./cart-black-icon.svg";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg"

const Header = ({isShopOwnerPage, shopData}) => {
  const navigateto = useNavigate();
  const onMediLogin = () => {
    navigateto('/login')
  }
  return (
    !isShopOwnerPage ?
    <div id="navmain" className="NavMain">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="" />
        </a>
        <div className="nav-contents-container" >
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#home">
                Home 
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#shops">
                Shops
              </a>
            </li>
            <li className="nav-item" onClick={onMediLogin}>
              <a className="nav-link">
              MediTrade-Login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#blogs">
                Blogs
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">
                About 
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contactus">
                Contact Us
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link disabled"
                href="#"
              >
              <img src={cartlogo} alt=""  />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div> : 


<div id="navmain" className="NavMain">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="" />
        </a>
        <div className="nav-contents-container" >
          <ul className="navbar-nav">
            <li className="nav-item active">
                 {shopData.shopName}
            </li>
            <li className="nav-item">
              {shopData.username}
            </li>
            <li className="nav-item" onClick={onMediLogin}>
              <a className="nav-link">
              MediTrade-Login
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
