import "./searchTutorItem.css";
import React from "react";

const SearchTutorItem = ({ item, handleClickRegister, onClick }) => {
  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-12  col-lg-4 sTImgWrapper">
          <img
            src={item.tutor_profile_image}
            alt="Hình đại diện"
            className="sTImg"
          />
        </div>
        <div className="col-md-12 col-lg-8">
          <div className="card-body sTCardBody">
            <h5 className="card-title sTCardTitle">Gia sư {item.tutor_name}</h5>
            <p className="card-text">
              Nghề nghiệp: {item.tutor_occupation}</p>
            <p className="card-text">
              Nơi làm việc (học tập): {item.tutor_workplace_name}
            </p>
            <p className="card-text">
              Giảng dạy các lớp: &nbsp;
              {item.tutor_classes
                ? item.tutor_classes.map((classElem, index) => (
                    <span key={index}>
                      {index === item.tutor_classes.length - 1
                        ? `${classElem}`
                        : `${classElem}, `}
                    </span>
                  ))
                : "Không có"}
            </p>
            <p className="card-text">
              Môn giảng dạy: &nbsp;
              {item.tutor_subjects
                ? item.tutor_subjects.map((subjectElem, index) => (
                    <span key={index}>
                      {index === item.tutor_subjects.length - 1
                        ? `${subjectElem}`
                        : `${subjectElem}, `}
                    </span>
                  ))
                : "Không có"}
            </p>
            <div className="optionButton">
              <button className="buttonRegister" onClick={() => {handleClickRegister(item.account._id, item.tutor_name)}}>Đăng ký ngay</button>
              <button className="buttonDetails" onClick={() => {onClick(item.account._id)}} >Xem chi tiết</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTutorItem;
