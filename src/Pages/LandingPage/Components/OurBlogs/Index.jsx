import React from "react";
import "../../assets/css/mystyles.css";
import OurDoctors from "../../assets/images/ourblogs3.jpg";
import MediTrade from "../../assets/images/mediTrade.png";
import Diabeties from "../../assets/images/diabeties.jpg";
import Pathalogy from "../../assets/images/pathalogy.jpg";
function Index() {
  const onContentClick = (idf) => {
    if (idf === "docs") {
      window.location.href = `https://www.betterhealth.vic.gov.au/health/servicesandsupport/managing-your-health`;
    } else if (idf === "medi") {
      window.location.href = `http://meditradesoft.in/`;
    }
    else if (idf === "practo"){
        window.location.href = `https://www.practo.com/`;
    }
    else if (idf === "labtest"){
        //--
    }
  };
  return (
    <div className="ourBlogs-main">
      <div className="ourblogcontent">
        <img src={OurDoctors} />
        <div className="blog-heading" onClick={() => onContentClick("docs")}>
          <h1>
            See What Our <span className="blog-slogan-span">Doctors</span> Says{" "}
          </h1>
          <h1>
            About <span className="blog-slogan-span">Health</span> Management
          </h1>
        </div>
      </div>
      <div className="ourblogcontent">
        <div className="blog-heading" onClick={() => onContentClick("medi")}>
          <h1>
            <span className="blog-slogan-span">GST</span> Panel Management For{" "}
          </h1>
          <h1>Medical Shop Owners</h1>
          <div>
            <p>
              MediTrade is the Platform for medical shop owner to 
              manage there medical inventory in every manner. Now, when 
              it comes to sale and purchase its very efficient to manage these data.
              One of the most useful feature is GST visibility and management. User can 
              see the GSTr reports.
            </p>
          </div>
        </div>
        <img src={MediTrade} />
      </div>
      <div className="ourblogcontent">
        <img src={Diabeties} />
        <div className="blog-heading" onClick={() => onContentClick("practo")}>
          <h1>
            Consult Diabeties From Top{" "}
            <span className="blog-slogan-span">Doctors</span>
          </h1>
          <div>
            <p>
              Diabeties is one of the most common disease. Diabetes is a chronic
              (long-lasting) health condition that affects how your body turns
              food into energy. Your body breaks down most of the food you eat
              into sugar (glucose) and releases it into your bloodstream. When
              your blood sugar goes up, it signals your pancreas to release
              insulin. Insulin acts like a key to let the blood sugar into your
              body’s cells for use as energy.
            </p>
          </div>
          {/* <h1>About <span className="blog-slogan-span">Health</span> Management</h1> */}
        </div>
      </div>
      <div className="ourblogcontent">
        <div className="blog-heading" onClick={() => onContentClick("labtest")}>
          <h1>
            We are coming soon in your areas  ... 
          </h1>
          <h1>
            For <span className="blog-slogan-span">Lab Tests</span>
          </h1>
        </div>
        <img src={Pathalogy} />
      </div>
    </div>
  );
}

export default Index;
