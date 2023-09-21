import React from 'react'
import ReactDOM from 'react-dom/client'
import "./landing-main.css";
// Components Below
import Header from "./Components/Header/Header";
import HomeInfo from './Components/HomeInfo/HomeInfo.jsx';
import Shops from './Components/Shops/Shops.jsx';
import Particles from "./Components/Particles/Index.jsx";
import OurBlog from "./Components/OurBlogs/Index.jsx";
import Footer from "./Components/Footer/Index.jsx";
import About from "./Components/AboutUs/Index.jsx";
import Contact from "./Components/ContactUs/Index.jsx";
import NearestShops from "./Components/NearestShops/Index.jsx";
// Images Below
import OurBlogs1 from "./assets/images/ourblogs.svg";
import OurBlogs2 from "./assets/images/ourblogs2.svg";
import About1 from "./assets/images/about1.svg";
import About2 from "./assets/images/about2.svg";
import Contact1 from "./assets/images/contact1.svg";
import Contact2 from "./assets/images/contact2.svg";
import Location1 from "./assets/images/location1.svg";
import Location2 from "./assets/images/location2.svg";
import Chatbot from './Components/Chatbot/Chatbot';


function Index() {
  return (
    <>
    <Header />
    <HomeInfo />
    {/* <br /><br /><br /><br /> */}
    <Shops itemShop="shop" />
    <Particles />
    <Shops itemShop="item" />
    <div className='blog-info-nearest'> 
      <img src={Location2} alt="" />
      <h1>Find Nearest Shops</h1>
      <img src={Location1} alt="" />
    </div>
    <NearestShops />
    <div className='blog-info'> 
      <img src={OurBlogs1} alt="" />
      <h1>Our Blogs</h1>
      <img src={OurBlogs2} alt="" />
    </div>
    <OurBlog />
    <div className='blog-info'> 
      <img src={About1} alt="" />
      <h1>About Us</h1>
      <img src={About2} alt="" />
    </div>
    <About />
    <div className='blog-info contact-info'> 
      <img src={Contact1} alt="" />
      <h1>Contact Us</h1>
      <img className="contact-info-second-img" style={{"width":"12%"}} src={Contact2} alt="" />
    </div>
    <Contact />
    <Footer />
    <Chatbot />
    </>
  )
}

export default Index;
