import React from "react";
import "../../assets/css/mystyles.css";
import Logo from "../../assets/images/logo_meditrade.svg";
function Index() {
  return (
    <div className="Footer">
      <div className="centered-row-foot">
        <div className="FooterRow">
            <div className="FooterSection">
              <h3>MediTrade</h3>
              <p>
                <a href="about-us-main">About</a>
              </p>
              <p>
                <a href="#">Contact</a>
              </p>
              <p>
                <a href="#">Blog</a>
              </p>
              <p>
                <a href="#">Career</a>
              </p>
            </div>
            <div className="FooterSection">
              <h3>For Customers</h3>
              <p>
                <a href="#">Medicines</a>
              </p>
              <p>
                <a href="#">Nearest Shops</a>
              </p>
              <p>
                <a href="#">Comparisons</a>
              </p>
              <p>
                <a href="#">Blogs</a>
              </p>
              <p>
                <a href="#">Consultancy</a>
              </p>
              <p>
                <a href="#">Informations</a>
              </p>
              <p>
                <a href="#">Labs</a>
              </p>
            </div>
            <div className="FooterSection">
              <h3>For Shop Owners</h3>
              <p>
                <a href="#">MediTrade Inventory</a>
              </p>
              <p>
                <a href="#">GST management</a>
              </p>
              <p>
                <a href="#">Bill Maintainance</a>
              </p>
              <p>
                <a href="#">Promotion to Customers</a>
              </p>
              <p>
                <a href="#">License Creation</a>
              </p>
              <p>
                <a href="#">Suggestions</a>
              </p>
            </div>
            <div className="FooterSection">
              <h3>Social Links</h3>
              <p>
                <a href="https://twitter.com/abhi18_01">Twitter</a>
              </p>
              <p>
                <a href="https://www.linkedin.com/in/abhishek-gupta-a1a44a203/">Linkedin</a>
              </p>
              <p>
                <a href="https://www.instagram.com/abhishek.gupta0118/">Instagram</a>
              </p>
              <p>
                <a href="https://www.facebook.com/profile.php?id=100002567964281">Facebook</a>
              </p>
              <p>
                <a href="https://github.com/cosmos-dx">GitHub</a>
              </p>
            </div>
        </div>
      </div>
      <div className="Logo">
        <img src={Logo} alt="" />
        <p>Copyright © 2023, MediTrade. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Index;
