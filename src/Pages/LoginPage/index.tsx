import "./login.css";
import logo from "../../assets/logo_nearMed.svg";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { UserDataContext } from "../../context/Context";

export default function () {
  const [loginfo, setloginfo] = useState("Login To Your Account");
  const navigateTo = useNavigate();
  const userContext = useContext(UserDataContext);
  const userNameInputRef = useRef("");
  const passwordInputRef = useRef("");
  return (
    <div className="main">
      <div className="form-container">
        <div className="topbar">
          <img src={logo} alt="" className="logo" />
        </div>
        <div className="form-content">
          <span className="message">{loginfo}</span>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const userName = userNameInputRef.current.value;
              const password = passwordInputRef.current.value;
              fetch(`${userContext.api}/medilogin`, {
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
                  if (!data.owner.cal) {
                    setloginfo("Wrong ID or Password");
                    return;
                  }
                  userContext.updateStore(data);
                  localStorage.setItem("rscr", JSON.stringify(data));
                  sessionStorage.setItem("username", userName);
                  localStorage.setItem("username", userName);
                  localStorage.setItem("password", password);
                  navigateTo("/dashboard");
                });
            }}
            action="#"
            className="form"
          >
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
              <input
                ref={userNameInputRef}
                type="text"
                placeholder="Username"
                required
              />
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
      <div className="sidebar">
        <div className="sidebar__container">
          <span className="ques">New Here?</span>
          <span className="msg">
            Sign up and discover a great amount of new opportunities!
          </span>
          <Link to="/signup" className="btn btn-secondary">
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
}
