import React from "react";
import "../../assets/css/mystyles.css";
import Founder from "../../assets/images/founder.svg";

function Index() {
    const onFounderClick =() => {
        window.location.href = `https://profound-dasik-cd267f.netlify.app/`;
    }
  return (
    <div className="about-us-main">
      <p>About Us - MediTrade</p>
      <div>
        <p>
          Welcome to MediTrade, your trusted partner in seamless medication
          access and efficient inventory management solutions. Our platform is
          designed with the end-user in mind, empowering individuals to easily
          purchase medicines from their nearest local stores while
          revolutionizing the way pharmacies manage their inventory and handle
          GST management.
        </p>
        <br />
        <h4>Our Vision</h4>
        <p>
          At MediTrade, we envision a world where accessing essential
          medications is not only convenient but also deeply personalized. We
          understand the importance of timely medication, and our platform aims
          to bridge the gap between individuals and their local pharmacies,
          ensuring that everyone can get the medicines they need, when they need
          them.
        </p>
        <br />
        <h4>Our Mission</h4>
        <p>
          Our mission is two-fold: to empower end-users with a hassle-free way
          to procure medicines and to equip pharmacies with state-of-the-art
          inventory management solutions. We are not just developers; we are
          pharmacists, entrepreneurs, and individuals who have experienced the
          challenges of running a pharmacy firsthand. This unique perspective
          drives us to create technology that not only simplifies processes but
          also enhances the overall healthcare ecosystem.
        </p>
        <br />
        <h4>Whats Sets Us Apart</h4>
        <p>
          As pharmacy owners ourselves, we intimately understand the
          complexities of managing inventory, dealing with fluctuating demand,
          and navigating GST regulations. This firsthand experience has inspired
          us to develop an inventory management system that streamlines
          operations, reduces wastage, and optimizes supply chains. Our
          commitment to efficiency extends beyond just technology; it's embedded
          in our DNA.
        </p>
        <br />
        <h4>Why Choose MediTrade ?</h4>
        <ol>
          <li>
            <h5>Local Accessibility: </h5>
            <p>
              We believe in the power of community and local businesses. With
              MediTrade, you're not just a customer; you're part of a network
              that supports neighborhood pharmacies and ensures easy access to
              medicines.
            </p>
          </li>
          <br />
          <li>
            <h5>GST Management: </h5>
            <p>
              Dealing with GST can be daunting. Our system incorporates GST
              management features that simplify the process for pharmacies,
              helping them stay compliant and avoid unnecessary stress.
            </p>
          </li>
          <br />
          <li>
            <h5>User-Centric Approach:</h5>
            <p>
              Our platform is designed to be user-friendly and intuitive. We
              understand that health matters can be stressful, so we've made
              sure that ordering medicines is a seamless and reassuring
              experience.
            </p>
          </li>
          <br />
          <li>
            <h5>Experience and Empathy: </h5>
            <p>
              As pharmacy owners ourselves, we walk in your shoes. We know what
              it's like to juggle inventory, customer demands, and regulatory
              requirements. This firsthand experience guides our every decision.
            </p>
          </li>
          <br />
        </ol>
        <h4>Join Us in Revolutionizing Healthcare</h4>
        <p>
          MediTrade is more than a platform; it's a movement to reshape how we
          approach healthcare. Whether you're an individual seeking reliable
          access to medicines or a pharmacy looking to streamline operations, we
          invite you to join us on this journey. Together, we can make
          healthcare more accessible, efficient, and personalized for everyone.
        </p>
        <br />
        <h4>Thank you for choosing MediTrade.</h4>
        <br />
        <p>Sincerely,</p>
        <p>Abhishek</p>
        <p>Founder, MediTrade</p>
      </div>
      <div className="founder" onClick={onFounderClick}>
        <img src={Founder} alt="" />
        <h2>
          Know More About <span className="tagline-slogan-span">Founder</span>
        </h2>
      </div>
    </div>
  );
}

export default Index;
