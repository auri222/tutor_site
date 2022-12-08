import "./profileAdmin.css";
import React from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProfileAdmin = () => {
  const {id}  = useParams();
  const {user} = useContext(AuthContext);
  const [account, setAccount] = useState([]);

  useEffect(()=> {
    const loadAccountInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/account/${id}`, {withCredentials:true});
        if(res.data){
          setAccount(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    loadAccountInfo();
  }, [id]);

  const handleDate = (date) => {
    let d = new Date(date);
    let dob = `${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}/${
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    }/${d.getFullYear()} `;
    return dob;
  };

  const handleCreatedDate = (date) => {
    let d = new Date(date);
    return `${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:${
      d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
    }:${d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds()} ${
      d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()
    }/${
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    }/${d.getFullYear()}`;
  };


  return (
    <div className="profileAdmin">
      <Sidebar />
      <div className="profileAdminContainer">
        <DashboardNav />
        <div className="profileAdminWrapper">
          <div className="profileAdminTitle">Thông tin tài khoản</div>
          <hr />
          <div className="profileAdminContent">
            <div className="row mb-3">
              <div className="col-md-3">Tên tài khoản</div>
              <div className="col-md-9">{account?.username}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">Ngày sinh</div>
              <div className="col-md-9">{handleDate(account?.birthday)}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">Địa chỉ</div>
              <div className="col-md-9">{`${account?.address?.home_number}, ${account?.address?.street}, ${account?.address?.ward}, ${account?.address?.district}, ${account?.address?.province}`}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">Email</div>
              <div className="col-md-9">{account?.email}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">Số điện thoại</div>
              <div className="col-md-9">{account?.phone_number}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-3">Ngày tạo</div>
              <div className="col-md-9">{handleCreatedDate(account?.createdAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAdmin;
