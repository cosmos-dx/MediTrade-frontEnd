import React, { useEffect, useState, useContext } from "react";
import "./signup.css";
import logo from "../../assets/logo_nearMed.svg";
import GoogleMapReact from "google-map-react";
import { Link , useNavigate} from "react-router-dom";
import { UserDataContext } from "../../context/Context";
import stateDistrictData from "../../assets/js/stateDistrictData.js";
import GstinChker from "../../assets/js/GsstinChker.jsx";

export default function index() {
  const navigateTo = useNavigate();
  const [currentLocation, setCurrentLocation] = useState({
    coords: { lattitude: 28.640552786049202, longitude: 77.22074051949213 },
  });
  const userContext = useContext(UserDataContext);
  const [username, setusername] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [password, setpassword] = useState("");
  const [confpassword, setconfpassword] = useState("");
  const [shopName, setshopName] = useState("");
  const [drugLicenseNo, setdrugLicenseNo] = useState("");
  const [GSTnumber, setGSTnumber] = useState("");
  const [locality, setlocality] = useState("");
  const [address, setaddress] = useState("");
  const [shopimage, setshopimage] = useState(null);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [districtsForSelectedState, setDistrictsForSelectedState] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [clickedLocation, setClickedLocation] = useState({
    lat: null,
    lng: null,
  });
  const [info, setinfo] = useState("Enter your details");
  const [infobool, setinfobool] = useState(false);
  const [duplicateusernamebool, setduplicateusernamebool] = useState(false);
  const [duplicatephonebool, setduplicatephonebool] = useState(false);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentLocation({
        coords: {
          lattitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        },
      });
      console.log(pos.coords);
    });
    document.title = "MediTrade | Signup";
  }, []);

  const validateUsername = (e) => {
    const username = e.target.value.trim(); // Trim leading and trailing spaces
    setduplicateusernamebool(false);
    setusername(username);
    const validUsernameRegex = /^[A-Za-z0-9_]+$/;
    
    if (username.length > 2) {
      if (validUsernameRegex.test(username)) {
        fetch(`${userContext.api}/onuserValidation?username=${username}`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data['success']['username'] == null) {
              setinfobool(true);
              setinfo("Valid user");
            } else {
              setinfobool(false);
              setduplicateusernamebool(true);
              setinfo(data['success']['username']);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        setinfobool(false);
        setinfo("Invalid characters in username. Only letters, numbers, and underscores are allowed.");
      }
    } else {   
      setinfobool(false);
      setinfo("Minimum 3 characters allowed");
    }
  };
  
  const validatePhone = (e) => {
    const phoneNo = e.target.value.trim();
    setduplicatephonebool(false);
    const validPhoneRegex = /^\d+$/;
    
    if (validPhoneRegex.test(phoneNo)) {
      if (phoneNo.length <= 10) {
        setphoneNo(phoneNo);
      } else {
        setinfo("Phone length should be 10");
      }
    
      if (phoneNo.length > 8) {
        fetch(`${userContext.api}/onphoneValidation?phone=${phoneNo}`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data['success']['phone'] == null) {
              setinfobool(true);
              setinfo("Valid Phone");
            } else {
              setinfobool(false);
              setduplicatephonebool(true);
              setinfo(data['success']['phone']);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    } else {
      setinfobool(false);
      setinfo("Invalid phone number. Only numbers are allowed.");
    }
  };
  
  const confpass = (e) => {
    const confPasswordValue = e.target.value;
    setconfpassword(confPasswordValue);
  
    if (confPasswordValue === password) {
      setinfobool(true);
      setinfo("Matched");
    } else {
      setinfobool(false);
      setinfo("Password Did not Matched");
    }
  };

  const validateGSTnumber = (e) => {
    const gnumber = e.target.value.toUpperCase();;
    const validationResult = GstinChker(gnumber);
    setGSTnumber(gnumber);

    if (validationResult === 'No Errors') {
      setinfobool(true);
      setinfo('Valid GST number');
    } else {
      setinfobool(false);
      setinfo(validationResult);
    }
  };
  function GSTINCHECKERFIN (gstin){
    if(gstin.length !== 15) return false;
    var default_string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var  default_string_length = default_string.length;
    let default_string_obj = {}
    let default_num_obj = {} 
    for(let i = 0; i <default_string_length; i++){
        default_string_obj[default_string[i]] = i;
    }
    for (let i = 0; i < default_string.length; i++) {
        default_num_obj[i] = default_string[i];
    }
    const gstin_list = gstin.split('');
    const new_gstin_list = gstin_list.slice(0, 14);
    const get_weg = new_gstin_list.map((char, i) => (i % 2 === 0 ? default_string_obj[char.toUpperCase()]  :default_string_obj[char.toUpperCase()] * 2));
    const get_qut = get_weg.map((get_weg_value) => Math.floor(get_weg_value / default_string_length));
    const get_rmd = get_weg.map((get_weg_value, i) => get_weg_value - get_qut[i] * default_string_length);
    const get_tot = get_rmd.map((rmd, i) => rmd + get_qut[i]);
    const lsttot = get_tot.reduce((sum, val) => sum + val, 0);
    const lstfnl = lsttot + -(Math.floor(lsttot / default_string_length) * default_string_length);
    const vldnum = default_string_length - lstfnl;
    const partychr = gstin[14];
    const rmsvaldnum = default_num_obj[vldnum];
    if (partychr === rmsvaldnum) {
        return true; 
    } else {
        return false; 
    } 
    
    
}
  
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setState(selectedState);
  
    const districts = stateDistrictData[selectedState] || [];
    setDistrictsForSelectedState(districts);
    setDistrict("");
  };
  
const onRegisterUser = (event) => {
  event.preventDefault();
  console.log(clickedLocation['lat'], clickedLocation['lng']);
  
  if(password !== confpassword){alert("Password Not Matched"); setinfo("Provide Politely Password"); return;}
  if(duplicateusernamebool || username.length < 2) {alert("Create a Valid User"); setinfo("Create a Valid user"); return;}
  if(duplicatephonebool || phoneNo.length < 9) {alert("Provide a Valid Phone"); setinfo("Provide a Valid Phone"); return;}
  if(clickedLocation['lat'] == null || clickedLocation['lng'] == null) {alert("Provide a Valid Location"); setinfo("Provide a Valid Location"); return;}
  if(!GSTINCHECKERFIN(GSTnumber)){alert("Invalid GST number"); setinfo("Provide GSTIN"); return;}

  const formData = new FormData();
  if (shopimage) {
    const fileBlob = new Blob([shopimage], { type: shopimage.type });
    formData.append("shopimage", fileBlob, shopimage.name);
  }

  formData.append("username", username);
  formData.append("firstname", firstname);
  formData.append("lastname", lastname);
  formData.append("phoneNo", phoneNo);
  formData.append("password", password);
  formData.append("confpassword", confpassword);
  formData.append("shopName", shopName);
  formData.append("drugLicenseNo", drugLicenseNo);
  formData.append("GSTnumber", GSTnumber);
  formData.append("state", state);
  formData.append("district", district);
  formData.append("locality", locality);
  formData.append("address", address);
  formData.append("latitude", clickedLocation['lat'] );
  formData.append("longitude", clickedLocation['lng'] );

  fetch(`${userContext.api}/register_member`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response from server:", data);
      alert(data['info']);
      navigateTo("/");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const handleShopImageChange = (e) => {
  const file = e.target.files[0];
  setshopimage(file);
};
const handleMapClick = (event) => {
  const latitude = event.lat;
  const longitude = event.lng;
  setClickedLocation({ lat: latitude, lng: longitude });
  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);
  
};


  return (
    <div className="signup-form-container signup-form-container-mobile">
      
      <div className="header header-mobile">
        <img src={logo} className="logo" alt="" />
        <Link to={"/"} className="link">
          Already have an account.
        </Link>
      </div>
      <form
        onSubmit={onRegisterUser}
        className="signup-form signup-form-mobile"
      >
       <div style={{ color: infobool ? "#3ddc8d" : "rgba(237, 59, 59, 0.926)" , textAlign : "center"}}>
          <p>{info}</p></div>
        <div><p></p></div>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
            />
          </svg>
          <input required placeholder="Username"
           value={username}
           onChange={validateUsername}
           type="text" />
        </div>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
          <input required placeholder="First Name" 
          value={firstname}
          onChange={(e) => setfirstname(e.target.value)}
          type="text" />
        </div>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
          <input required placeholder="Last Name"
          value={lastname}
          onChange={(e) => setlastname(e.target.value)}
           type="text" />
        </div>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z"
            />
          </svg>
          <input required placeholder="Phone" 
          value={phoneNo}
          onChange={validatePhone}
          type="phone" />
        </div>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
            />
          </svg>
          <input required placeholder="Password" 
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          type="password" />
        </div>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
            />
          </svg>
          <input required placeholder="Repeat Password"
          value={confpassword}
          onChange={confpass}
           type="password" />
        </div>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M6 5v1H4.667a1.75 1.75 0 00-1.743 1.598l-.826 9.5A1.75 1.75 0 003.84 19H16.16a1.75 1.75 0 001.743-1.902l-.826-9.5A1.75 1.75 0 0015.333 6H14V5a4 4 0 00-8 0zm4-2.5A2.5 2.5 0 007.5 5v1h5V5A2.5 2.5 0 0010 2.5zM7.5 10a2.5 2.5 0 005 0V8.75a.75.75 0 011.5 0V10a4 4 0 01-8 0V8.75a.75.75 0 011.5 0V10z"
            />
          </svg>
          <input required placeholder="Shop Name" 
          value={shopName}
          onChange={(e) => setshopName(e.target.value)}
          type="text" />
        </div>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M5.404 14.596A6.5 6.5 0 1116.5 10a1.25 1.25 0 01-2.5 0 4 4 0 10-.571 2.06A2.75 2.75 0 0018 10a8 8 0 10-2.343 5.657.75.75 0 00-1.06-1.06 6.5 6.5 0 01-9.193 0zM10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
            />
          </svg>
          <input required placeholder="Drug License Number" 
          value={drugLicenseNo}
          onChange={(e) => setdrugLicenseNo(e.target.value)}
          type="text" />
        </div>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            />
          </svg>
          <input
            maxLength="15"
            placeholder="GST Number"
            value={GSTnumber}
            onChange={validateGSTnumber}
            type="text"
          />
        </div>
        <select
          name="state"
          id="state"
          value={state}
          onChange={handleStateChange}
          required
        >
          <option value="">Select State</option>
          {Object.keys(stateDistrictData).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          name="district"
          id="district"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          required
        >
          <option value="">Select District</option>
          {districtsForSelectedState.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
            />
          </svg>
          <input required placeholder="Locality"
          value={locality}
          onChange={(e) => setlocality(e.target.value)}
           type="text" />
        </div>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M8.157 2.175a1.5 1.5 0 00-1.147 0l-4.084 1.69A1.5 1.5 0 002 5.251v10.877a1.5 1.5 0 002.074 1.386l3.51-1.453 4.26 1.763a1.5 1.5 0 001.146 0l4.083-1.69A1.5 1.5 0 0018 14.748V3.873a1.5 1.5 0 00-2.073-1.386l-3.51 1.452-4.26-1.763zM7.58 5a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0v-6.5A.75.75 0 017.58 5zm5.59 2.75a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z"
            />
          </svg>
          <input required placeholder="Address" 
          value={address}
          onChange={(e) => setaddress(e.target.value)}
          type="text" />
        </div>
        <div className="input-container">
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
          </svg>
          <input
            type="file"
            onChange={handleShopImageChange}
          />
        </div>
        <div className="btn-container">
          <button className="btn btn-primary" >SIGN UP</button>
        </div>
      </form>
      <div className="map-container map-container-mobile">
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
  );
}
