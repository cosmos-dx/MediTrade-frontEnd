import React,{ useContext, useRef, useState } from "react";
import { UserDataContext } from "../../context/Context"; 
import { useNavigate } from "react-router-dom";
import "./admin.css";
export default function index () {
  const navigateto = useNavigate();
  const userContext = useContext(UserDataContext);
  const userNameInputRef = useRef("");
  const passwordInputRef = useRef("");
  const [loginfo, setloginfo] = useState("Prove you are Admin !!!")
  return (
    <div className='adminmain'>
      <div className='form-container'>
        <div className="credinfo">
          <h3>{loginfo}</h3>
        </div>
      <form
            onSubmit={(e) => {
              e.preventDefault();
              const userName = userNameInputRef.current.value;
              const password = passwordInputRef.current.value;
              fetch(`${userContext.api}/adminlogin`, {
                method: "post",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  username: userName,
                  password,
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (!data['success']) {
                    setloginfo("Wrong ID or Password");
                    return;
                  }
                  navigateto("/adminpanel",{ state: { "username": userName, "password": password } });
                });
            }}
            action="#"
            className="form"
          >
            <div className="input-container">
              <input
                ref={userNameInputRef}
                type="text"
                placeholder="Username"
                required
              />
            </div>
            <div className="input-container">
              <input
                ref={passwordInputRef}
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <button onClick={() => {}} className="btn btn-primary">
              SIGN IN
            </button>
          </form>
      </div>
    </div>
  )
}
