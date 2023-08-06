import React, { useState , useContext} from "react";
import "./userinfocomponent.css";
import { Link, useNavigate } from "react-router-dom";
import {UserDataContext} from "../../../../context/Context";
const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const navigateto = useNavigate();
  const userContext = useContext(UserDataContext);
  //userinfo
  const [shopname, setshopname] = useState(userContext.store.userinfo.ownerstatic[0]);
  const [add1, setadd1] = useState(userContext.store.userinfo.ownerstatic[1]);
  const [add2, setadd2] = useState(userContext.store.userinfo.ownerstatic[2]);
  const [add3, setadd3] = useState(userContext.store.userinfo.ownerstatic[3]);
  const [disclaimer, setdisclaimer] = useState(userContext.store.userinfo.info);
  const [phoneno, setphoneno] = useState(userContext.store.userinfo.phone);
  const [altphone, setaltphone] = useState(userContext.store.userinfo.phone1);
  const [email, setemail] = useState(userContext.store.userinfo.email);
  const [regn, setregn] = useState(userContext.store.userinfo.regn);
  const [gstn, setgstn] = useState(userContext.store.userinfo.gstn);
  
  //billseries
  const [mainbill, setmainbill] = useState(userContext.store.billseries['main']);
  const [estibill, setestibill] = useState(userContext.store.billseries['esti']);
  const [challanbill, setchallanbill] = useState(userContext.store.billseries['challan'] );
  const [saleorderbill, setsaleorderbill] = useState(userContext.store.billseries['saleorder'] );
  const [purchaseorderbill, setpurchaseorderbill] = useState(userContext.store.billseries['purchaseorder']);
  const [receiptbill, setreceiptbill] = useState(userContext.store.billseries['receipt'] );
  
  //bankinfo
  const [bankName1, setbankName1] = useState(userContext.store.bankinfo['bank1']['name'] );
  const [bankadd1, setbankadd1] = useState(userContext.store.bankinfo['bank1']['add'] );
  const [bankupid1, setbankupid1] = useState(userContext.store.bankinfo['bank1']['upid'] );
  const [bankifsc1, setbankifsc1] = useState(userContext.store.bankinfo['bank1']['ifsc'] );
  const [bankac1, setbankac1] = useState(userContext.store.bankinfo['bank1']['ac'] );

  const [bankName2, setbankName2] = useState(userContext.store.bankinfo['bank2']['name'] );
  const [bankadd2, setbankadd2] = useState(userContext.store.bankinfo['bank2']['add'] );
  const [bankupid2, setbankupid2] = useState(userContext.store.bankinfo['bank2']['upid'] );
  const [bankifsc2, setbankifsc2] = useState(userContext.store.bankinfo['bank2']['ifsc'] );
  const [bankac2, setbankac2] = useState(userContext.store.bankinfo['bank2']['ac'] );

  const [ownerimage, setownerimage] = useState(null);


  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setIsModalOpen(true); 
  };
  
  const logout = () => {
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: userContext.store.recdic.pantemplate,},}))
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["cscr"]: "CASH"},},}))
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["regn"]: ""},},}))
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["gstn"]: ""},},}))
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["add1"]: ""},},}))
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["add2"]: ""},},}))
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["mobile"]: ""},},}))
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["stcode"]: ""},},}))
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, pan: {...ps.recdic.pan, ["email"]: ""},},}))
    let ac={"acname1":"" ,"acname2":"" ,"acname3":"" ,"acid1":0,"acid2":0,"acid3":0,"acval1":0,"acval2":0,"acval3":0,}
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, ac: userContext.store.recdic.ac,},}))
    userContext.updateStore((ps) => ({...ps, recdic: {...ps.recdic, grid: {[0] : userContext.store.recdic.itemtemplate},},}));
    setnavlinkKey(Date.now());
    navigateto("/");
  }

  const handleModalClose = () => {

    setIsModalOpen(false);
  };

  const handleFormSubmit = (event, selectedMenuItem) => {
    event.preventDefault();
    switch (selectedMenuItem) {
      case "updateuserinfo":
        if(!GSTINCHECKERFIN(gstn)){alert("WRONG GST"); setIsModalOpen(false);}
        const userdata = {
          name : shopname,
          add1: add1, 
          add2: add2,
          add3: add3,
          info : disclaimer,

          phone1 : phoneno,
          phone2: altphone, 
          email: email,
          regn: regn,
          gstn : gstn,
        };
        fetch(`${userContext.api}/adduserinfo`, {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(userdata),
        })
          .then((res) => res.json())
          .then((data) => {
            navigateto("/");
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
        break;
      case "updateBillSeries":
        const billdata = {
          main : mainbill,
          esti : estibill,
          saleorder : saleorderbill,
          purchaseorder : purchaseorderbill,
          receipt : receiptbill,
          challan : challanbill
        }
        fetch(`${userContext.api}/addbillseriesinfo`, {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(billdata),
        })
          .then((res) => res.json())
          .then((data) => {
            navigateto("/");
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
        break;
      case "updateBankInfo":
        const bankdata = {
          name1 : bankName1,
          acno1: bankac1, 
          ifsc1: bankifsc1,
          upid1: bankupid1,
          add1 : bankadd1,

          name2 : bankName2,
          acno2: bankac2, 
          ifsc2: bankifsc2,
          upid2: bankupid2,
          add2 : bankadd2,
        };
        fetch(`${userContext.api}/addbankinfo`, {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(bankdata),
        })
          .then((res) => res.json())
          .then((data) => {
            navigateto("/");
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
       
        break;
      default:
        break;
    }
    setIsModalOpen(false);
  };
  const handleShopImageChange = (e) => {
    const file = e.target.files[0];
    setownerimage(file);
  };
  const ownerimageUpload = (e) => {

    const formData = new FormData();
    formData.append("ownerimage", ownerimage);
    formData.append("filename", sessionStorage.getItem('username'));
  
    fetch(`${userContext.api}/ownerimage`, {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Image uploaded successfully!");
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
      setIsModalOpen(false);
      window.location.reload();
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
  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    const uppercaseValue = value.toUpperCase();
  
    switch (name) {
      case "shopname":
        setshopname(uppercaseValue);
        break;
      case "add1":
        setadd1(uppercaseValue);
        break;
      case "add2":
        setadd2(uppercaseValue);
        break;
      case "add3":
        setadd3(uppercaseValue);
        break;
      case "disclaimer":
        setdisclaimer(uppercaseValue);
        break;
      case "phoneno":
        setphoneno(uppercaseValue);
        break;
      case "altphone":
        setaltphone(uppercaseValue);
        break;
      case "email":
        setemail(uppercaseValue);
        break;
      case "regn":
        setregn(uppercaseValue);
        break;
      case "gstn":
        setgstn(uppercaseValue);
        break;
      default:
        break;
    }
  };
  
  const handleFormInputChangeBill = (event) => {
    const { name, value } = event.target;
    const uppercaseValue = value.toUpperCase();
  
    switch (name) {
      case "mainbill":
        setmainbill(uppercaseValue);
        break;
      case "challanbill":
        setchallanbill(uppercaseValue);
        break;
      case "estibill":
        setestibill(uppercaseValue);
        break;
      case "saleorderbill":
        setsaleorderbill(uppercaseValue);
        break;
      case "purchaseorderbill":
        setpurchaseorderbill(uppercaseValue);
        break;
      case "receiptbill":
        setreceiptbill(uppercaseValue);
        break;
      default:
        break;
    }
  };
  
  const handleFormInputChangeBank = (event) => {
    const { name, value } = event.target;
    const uppercaseValue = value.toUpperCase();
  
    switch (name) {
      case "bankName1":
        setbankName1(uppercaseValue);
        break;
      case "bankadd1":
        setbankadd1(uppercaseValue);
        break;
      case "bankifsc1":
        setbankifsc1(uppercaseValue);
        break;
      case "bankupid1":
        setbankupid1(uppercaseValue);
        break;
      case "bankac1":
        setbankac1(uppercaseValue);
        break;
      case "bankName2":
        setbankName2(uppercaseValue);
        break;
      case "bankadd2":
        setbankadd2(uppercaseValue);
        break;
      case "bankifsc2":
        setbankifsc2(uppercaseValue);
        break;
      case "bankupid2":
        setbankupid2(uppercaseValue);
        break;
      case "bankac2":
        setbankac2(uppercaseValue);
        break;
      default:
        break;
    }
  };
  const closebuttonhandle =(e) => {
    e.preventDefault();
    setIsModalOpen(false);

  }
  

  const getModalContent = () => {
    switch (selectedMenuItem) {
      case "updateuserinfo":
        return (
          
          <form onSubmit={(event) => handleFormSubmit(event, "updateuserinfo")}>
            <input type="text" name="shopname" placeholder="Shop Name" value={shopname} onChange={handleFormInputChange}/>
            <input type="text" name="add1" placeholder="Address 1" value={add1} onChange={handleFormInputChange} />
            <input type="text" name="add2" placeholder="Address 2" value={add2} onChange={handleFormInputChange}/>
            <input type="text" name="add3" placeholder="Address 3" value={add3} onChange={handleFormInputChange}/>
            <input type="text" name="disclaimer" placeholder="Disclaimer" value={disclaimer} onChange={handleFormInputChange}/>
            <input type="text" name="phoneno" placeholder="Phone No" value={phoneno} onChange={handleFormInputChange}/>
            <input type="text" name="altphone" placeholder="Alternate Phone No" value={altphone} onChange={handleFormInputChange}/>
            <input type="email" name="email" placeholder="Email" value={email} onChange={handleFormInputChange}/>
            <input type="text" name="regn" placeholder="Registration Number" value={regn} onChange={handleFormInputChange} />
            <input type="text" name="gstn" placeholder="GSTIN" value={gstn} onChange={handleFormInputChange}/>
            <input type="text" placeholder="Bill Page Type"  />
            <button className="save-button-user-info" type="submit">Save</button>
            <button className="close-button-user-info" onClick={closebuttonhandle}>Close</button>
          </form>

        );
      case "updateBillSeries":
        return (
          <form onSubmit={(event) => handleFormSubmit(event, "updateBillSeries")}>
            <input type="text" name="mainbill" placeholder="Main" value={mainbill} onChange={handleFormInputChangeBill} />
            <input type="text" name="challanbill" placeholder="Challan" value={challanbill} onChange={handleFormInputChangeBill} />
            <input type="text" name="estibill" placeholder="Estimate" value={estibill} onChange={handleFormInputChangeBill} />
            <input type="text" name="saleorderbill" placeholder="Sale Order" value={saleorderbill} onChange={handleFormInputChangeBill} />
            <input type="text" name="purchaseorderbill" placeholder="Purchase Order" value={purchaseorderbill} onChange={handleFormInputChangeBill} />
            <input type="text" name="receiptbill" placeholder="Receipt" value={receiptbill} onChange={handleFormInputChangeBill} />
            <button className="save-button-user-info" type="submit">Save</button>
            <button className="close-button-user-info" onClick={closebuttonhandle}>Close</button>
          </form>

        );
      case "updateBankInfo":
        return (
          <form onSubmit={(event) => handleFormSubmit(event, "updateBankInfo")}>
            <input type="text" name="bankName1" placeholder="Bank Name" value={bankName1} onChange={handleFormInputChangeBank} />
            <input type="text" name="bankadd1" placeholder="Bank Address" value={bankadd1} onChange={handleFormInputChangeBank} />
            <input type="text" name="bankifsc1" placeholder="IFSC code" value={bankifsc1} onChange={handleFormInputChangeBank} />
            <input type="text" name="bankupid1" placeholder="UPI id" value={bankupid1} onChange={handleFormInputChangeBank} />
            <input type="text" name="bankac1" placeholder="Account Number" value={bankac1} onChange={handleFormInputChangeBank} />
            <p>Other Bank</p>
            <input type="text" name="bankName2" placeholder="Bank Name" value={bankName2} onChange={handleFormInputChangeBank} />
            <input type="text" name="bankadd2" placeholder="Bank Address" value={bankadd2} onChange={handleFormInputChangeBank} />
            <input type="text" name="bankifsc2" placeholder="IFSC code" value={bankifsc2} onChange={handleFormInputChangeBank} />
            <input type="text" name="bankupid2" placeholder="UPI id" value={bankupid2} onChange={handleFormInputChangeBank} />
            <input type="text" name="bankac2" placeholder="Account Number" value={bankac2} onChange={handleFormInputChangeBank} />
            <button className="save-button-user-info" type="submit">Save</button>
            <button className="close-button-user-info" onClick={closebuttonhandle}>Close</button>
          </form>

        );
      case "addPhoto":
        return (
            <>
              <input
                type="file"
                accept=".jpeg, .jpg, .png"
                onChange={handleShopImageChange}
              />
            <button className="save-button-user-info" onClick={ownerimageUpload} >Upload</button>
            <button className="close-button-user-info" onClick={closebuttonhandle}>Close</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="dropdown-menu">
        <ul>
          <li onClick={() => handleMenuItemClick("updateuserinfo")}>Update Profile</li>
          <li onClick={() => handleMenuItemClick("updateBillSeries")}>Update Bill Series</li>
          <li onClick={() => handleMenuItemClick("updateBankInfo")}>Update Bank Info</li>
          <li onClick={() => handleMenuItemClick("addPhoto")}>Add Your Photo</li>
          <li id="usernme">{sessionStorage.getItem("username")}</li>
          <li id="logout" onClick={logout}>Log Out</li>
        </ul>
      </div>
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            {getModalContent()}
          
          
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
