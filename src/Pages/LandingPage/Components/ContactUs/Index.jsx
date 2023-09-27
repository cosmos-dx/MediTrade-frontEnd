import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import '../../assets/css/mystyles.css';

import Insta from "../../assets/images/instagram.png";
import Linkedin from "../../assets/images/linkedin.png";
import Github from "../../assets/images/github.png";
import Contactme from "../../assets/images/contactme.svg";
function Index() {
  const form = useRef();
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');

  const validateForm = () => {
    let valid = true;

    if (!form.current.email.value) {
      setEmailError('Email is required');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!form.current.project.value) {
      setMessageError('Message is required');
      valid = false;
    } else {
      setMessageError('');
    }

    return valid;
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (validateForm()) {
      emailjs
        .sendForm(
          'service_1fgl923',
          'template_9l0xf0u',
          form.current,
          'ORZW_JztdapHLXOMZ'
        )
        .then(
          (result) => {
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
    }
  };
  const OnContactImgClick = (idf) => {
    if (idf === "linkedin"){
      window.location.href = `https://www.linkedin.com/in/abhishek-gupta-a1a44a203/`;
    }
    else if (idf === "git"){
      window.location.href = `https://github.com/cosmos-dx`;
    }
    else if (idf === "insta"){
      window.location.href = `https://www.instagram.com/abhishek.gupta0118/`;
    }
  }

  return (
    <div id='contactus' className="contact-us-main">
      <div className="contact-left">
        <form ref={form} onSubmit={sendEmail}>
          <input type="email" name="email" placeholder='Email'/>
          {emailError && <p className="error">{emailError}</p>}
          <textarea name="project" placeholder='Write your Message'/>
          {messageError && <p className="error">{messageError}</p>}
          <input type="submit" value="Send" />
        </form>
      </div>
      <div className='contactimg'>
        <img src={Contactme} alt="" />
      </div>
      <div className="contact-right">
        <img src={Linkedin} onClick={() => OnContactImgClick("linkedin")} alt="" />
        <img src={Github} onClick={() => OnContactImgClick("git")} alt="" />
        <img src={Insta} onClick={() => OnContactImgClick("insta")} alt="" />
      </div>
    </div>
  );
}

export default Index;
