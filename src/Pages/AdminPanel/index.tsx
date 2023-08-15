import React, {useContext, useState} from 'react';
import { useLocation , useNavigate} from "react-router-dom";
import { UserDataContext } from "../../context/Context"; 
export default function index() {
  const [usersData, setUsersData] = useState([]);
  const navigateto = useNavigate();
  const location = useLocation();
  const userContext = useContext(UserDataContext);
  const fetchUsersData = () => {
    fetch(`${userContext.api}/showdatatoadmin`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: location.state.username,
        password: location.state.password,
      }),
    })
      .then(response => response.json())
      .then(data => setUsersData(data['usersdata']))
      .catch(error => console.error('Error fetching users data:', error));
  };

  const renderUserDataHeader = () => {
    return (
      <div className='user-data-header'>
        <span>Username</span>
        <span>First Name</span>
        <span>Shop Name</span>
        <span>Phone Number</span>
        <span>DL Number</span>
        <span>GSTN</span>
        <span>State</span>
        <span>District</span>
      </div>
    );
  };

  const renderUserDataRows = () => {
    return usersData.map((user, index) => (
      <div key={index} className='user-data-row'>
        <span>{user.username}</span>
        <span>{user.name}</span>
        <span>{user.shopName}</span>
        <span>{user.phone}</span>
        <span>{user.drugLicenseNo}</span>
        <span>{user.GSTnumber}</span>
        <span>{user.state}</span>
        <span>{user.district}</span>
      </div>
    ));
  };

  return (
    <div className='adminpanelmain'>
      <div className='admin-buttons'>
        <button onClick={fetchUsersData}>Show All Registered Users</button>
        {/* <button onClick={fetchActiveUsersData}>Show Active Users</button>s */}
      </div>
      {usersData.length > 0 && (
        <div className='user-data'>
          {renderUserDataHeader()}
          {renderUserDataRows()}
        </div>
      )}
    </div>
  );
}