import "./profileAccount.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard } from "@fortawesome/free-regular-svg-icons";

const ProfileAccount = ({ info, show }) => {
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
    <div className="pAContainer mb-3">
      <h2 className="pATitle">
        <FontAwesomeIcon icon={faAddressCard} />
        Thông tin tài khoản
      </h2>
      <hr />
      {info !== null ? (
        <div className="pADetailsContainer">
          {/* Username */}
          <div className="row mb-3">
            <div className="col-md-4">
              <h4 className="pADetailTitle">Tên đăng nhập</h4>
            </div>
            <div className="col-md-8">
              <span className="pADetailContent">{info?.username}</span>
            </div>
          </div>
          {/* BoD */}
          <div className="row mb-3">
            <div className="col-md-4">
              <h4 className="pADetailTitle">Ngày sinh</h4>
            </div>
            <div className="col-md-8">
              <span className="pADetailContent">
                {info.birthday ? handleDate(info.birthday) : "Trống"}
              </span>
            </div>
          </div>
          {/* Addrs */}
          <div className="row mb-3">
            <div className="col-md-4">
              <h4 className="pADetailTitle">Địa chỉ</h4>
            </div>
            <div className="col-md-8">
              {show !== 0 ? (
                <span className="pADetailContent">{`${info?.address?.home_number}, ${info?.address?.street}, ${info?.address?.ward}, ${info?.address?.district}, ${info?.address?.province}`}</span>
              ) : (
                <span className="pADetailContent">{`${info?.address?.ward}, ${info?.address?.district}, ${info?.address?.province}`}</span>
              )}
            </div>
          </div>
          {/* Email */}
          <div className="row mb-3">
            <div className="col-md-4">
              <h4 className="pADetailTitle">Email</h4>
            </div>
            <div className="col-md-8">
              <span className="pADetailContent">{info?.email}</span>
            </div>
          </div>
          {/* phone */}
          <div className="row mb-3">
            <div className="col-md-4">
              <h4 className="pADetailTitle">Số điện thoại</h4>
            </div>
            <div className="col-md-8">
              <span className="pADetailContent">{info?.phone_number}</span>
            </div>
          </div>
          {/* CCCD */}
          {show !== 0 ? (
            <div className="row mb-3">
              <div className="col-md-4">
                <h4 className="pADetailTitle">Số CCCD</h4>
              </div>
              <div className="col-md-8">
                <span className="pADetailContent">{info?.CCCD}</span>
              </div>
            </div>
          ) : (
            ""
          )}
          {/* created at */}
          <div className="row mb-3">
            <div className="col-md-4">
              <h4 className="pADetailTitle">Ngày tạo</h4>
            </div>
            <div className="col-md-8">
              <span className="pADetailContent">
                {info.createdAt ? handleCreatedDate(info.createdAt) : ""}
              </span>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProfileAccount;
