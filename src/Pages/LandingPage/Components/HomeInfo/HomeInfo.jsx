import "./homeinfo.css";
import Wrun from "../../../../assets/images/wrun.gif";
const HomeInfo = () => {
  return (
    <>
    <div id="home" className="landing-main-container">
      <div className="under-constr">
        <br />
      <h1>
          Site is Under <span className="tagline-slogan-span">Construction</span>.
          <img className="construction-land" src={Wrun}/>
        </h1>

      </div>
      <div className="landing-below-container">
      <div className="tagline">
      
        <h3>We Best Serves You</h3>
        <h1>
          Find <span className="tagline-slogan-span">Medicines</span> From Your <span className="tagline-slogan-span">Nearest</span> Medical
          Stores
        </h1>
        <button className="tagline-button">
          Get Started
        </button>
      </div>
      <div className="sliders">
      </div>
      </div>
    </div>
    
    </>
    
  );
};

export default HomeInfo;
