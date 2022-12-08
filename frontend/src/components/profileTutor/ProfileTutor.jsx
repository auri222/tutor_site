import "./profileTutor.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

const ProfileTutor = ({ info }) => {
  return (
    <div className="pTContainer">
      <h2 className="pTTitle">
        <FontAwesomeIcon icon={faBook} />
        Thông tin gia sư
      </h2>
      <hr />
      <div className="pTDetailsContainer">
        {info !== null ? (
          <>
            <div className="row mb-3">
              <div className="col-md-12">
                <img src={info.tutor_profile_image} className="rounded mx-auto d-block pTImg" alt={`Hình gia sư ${info.tutor_name}`} />
              </div>
            </div>
            {/* Ho tne gia su */}
            <div className="row mb-3">
              <div className="col-md-4">
                <h4 className="pTDetailTitle">Họ tên</h4>
              </div>
              <div className="col-md-8">
                <span className="pTDetailContent">{info.tutor_name}</span>
              </div>
            </div>
            {/* Chuc danh gia su */}
            <div className="row mb-3">
              <div className="col-md-4">
                <h4 className="pTDetailTitle">Chức danh</h4>
              </div>
              <div className="col-md-8">
                <span className="pTDetailContent">{info.tutor_title}</span>
              </div>
            </div>
            {/* Nghe nghiep gia su */}
            <div className="row mb-3">
              <div className="col-md-4">
                <h4 className="pTDetailTitle">Nghề nghiệp hiện tại</h4>
              </div>
              <div className="col-md-8">
                <span className="pTDetailContent">{info.tutor_occupation}</span>
              </div>
            </div>
            {/* workplace gia su */}
            <div className="row mb-3">
              <div className="col-md-4">
                <h4 className="pTDetailTitle">
                  Nơi làm việc (học tập) hiện tại
                </h4>
              </div>
              <div className="col-md-8">
                <span className="pTDetailContent">{info.tutor_workplace_name}</span>
              </div>
            </div>
            {/* workplace addrs gia su */}
            <div className="row mb-3">
              <div className="col-md-4">
                <h4 className="pTDetailTitle">
                  Địa chỉ nơi làm việc (học tập) hiện tại
                </h4>
              </div>
              <div className="col-md-8">
                <span className="pTDetailContent">{info.tutor_workplace_address}</span>
              </div>
            </div>
            {/* lop giang day gia su */}
            <div className="row mb-3">
              <div className="col-md-4">
                <h4 className="pTDetailTitle">Lớp giảng dạy</h4>
              </div>
              <div className="col-md-8">
                <span className="pTDetailContent">{
                  info.tutor_classes.length > 0 ? info.tutor_classes.map((item, index) => (
                    <span key={index}>
                      {index === info.tutor_classes.length -1 ? `${item}`: `${item}, `}
                    </span>
                  )) : ""
                }</span>
              </div>
            </div>
            {/* mon giang day gia su */}
            <div className="row mb-3">
              <div className="col-md-4">
                <h4 className="pTDetailTitle">Môn giảng dạy</h4>
              </div>
              <div className="col-md-8">
                <span className="pTDetailContent">{
                  info.tutor_subjects.length > 0 ? info.tutor_subjects.map((item, index) => (
                    <span key={index}>
                      {index === info.tutor_subjects.length - 1 ? `${item}`: `${item}, `}
                    </span>
                  )) : ""
                }</span>
              </div>
            </div>
            {/* lich giang day cua gia su */}
            <div className="row mb-3">
              <div className="col-md-4">
                <h4 className="pTDetailTitle">Lịch giảng dạy</h4>
              </div>
              <div className="col-md-8">
                <span className="pTDetailContent">{
                  info.tutor_schedule.length > 0 ? info.tutor_schedule.map((item, index) => (
                    <span key={index}>
                      {index === info.tutor_schedule.length -1 ? `${item}`: `${item}, `}
                    </span>
                  )) : ""
                }</span>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <h4 className="pTDetailTitle">Hình CCCD</h4>
              </div>
              <div className="col-md-8">
                {info.tutor_CCCD_image.length >0 ? (
                  info.tutor_CCCD_image.map((item, index) => (
                    <img key={index} src={item} className="rounded pTCCCDImg img-fluid" alt={`Hình CCCD của gia sư ${info.tutor_name}`} />
                  ))
                ) : "Không có ảnh"}
              </div>
            </div>
          </>
        ) : (
          "Không tìm thấy thông tin"
        )}
      </div>
    </div>
  );
};

export default ProfileTutor;
