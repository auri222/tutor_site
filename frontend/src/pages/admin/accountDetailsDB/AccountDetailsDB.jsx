import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import AccountDetailsForDB from "../../../components/admin/accountDetailsForDB/AccountDetailsForDB";
import './accountDetailsDB.css';

import React from 'react';

const AccountDetailsDB = () => {
  return (
    <div className='accountDetails'>
      <Sidebar />
      <div className="accountDetailsContainer">
        <DashboardNav />
        <AccountDetailsForDB />
      </div>
    </div>
  )
}

export default AccountDetailsDB