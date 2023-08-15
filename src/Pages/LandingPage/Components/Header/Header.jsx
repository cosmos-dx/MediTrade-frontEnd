import React from "react";
import "./header.css";
import cartlogo from "./cart-black-icon.svg";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg"

const Header = () => {
  const navigateto = useNavigate();
  const onMediLogin = () => {
    navigateto('/login')
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          <img src={logo} alt="" />
        </a>
        <div className="nav-contents-container" >
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">
                Home 
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Shops
              </a>
            </li>
            <li className="nav-item" onClick={onMediLogin}>
              <a className="nav-link">
              MediTrade-Login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Blogs
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                About 
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
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
    </div>
  );
};

export default Header;
