import "./tutorPFC.css";

import React from "react";

// Show Tutor profile for Course page
// IN List Candidates AND Chosen Tutor
const TutorPFC = ({
  item,
  handleChooseTutor,
  handleClickDetails,
  option,
  status,
  type,
}) => {
  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-12  col-lg-4 cTImgWrapper">
          <img
            src={item.tutor_profile_image}
            alt="Hình đại diện"
            className="cTImg"
          />
        </div>
        <div className="col-md-12 col-lg-8">
          <div className="card-body cTCardBody">
            <h5 className="card-title cTCardTitle">
              Gia sư {item.tutor_name}
            </h5>
            <div className="card-text">
              <div className="row mb-2">
                <div className="col-md-4">Nghề nghiệp</div>
                <div className="col-md-8">{item.tutor_occupation}</div>
              </div>
            </div>
            <div className="card-text">
              <div className="row mb-2">
                <div className="col-md-4">Nơi làm việc/học tập </div>
                <div className="col-md-8">{item.tutor_workplace_name}</div>
              </div>
            </div>
            <div className="card-text">
              <div className="row mb-2">
                <div className="col-md-4">Giảng dạy các lớp</div>
                <div className="col-md-8">
                  {item.tutor_classes
                    ? item.tutor_classes.map((classElem, index) => (
                        <span key={index}>
                          {index === item.tutor_classes.length - 1
                            ? `${classElem}`
                            : `${classElem}, `}
                        </span>
                      ))
                    : "Không có"}
                </div>
              </div>
            </div>
            <div className="card-text">
              <div className="row mb-2">
                <div className="col-md-4">Môn giảng dạy</div>
                <div className="col-md-8">
                  {item.tutor_subjects
                    ? item.tutor_subjects.map((subjectElem, index) => (
                        <span key={index}>
                          {index === item.tutor_subjects.length - 1
                            ? `${subjectElem}`
                            : `${subjectElem}, `}
                        </span>
                      ))
                    : "Không có"}
                </div>
              </div>
            </div>
            {/* lựa chọn trong danh sách ứng viên */}
            {option === 1 ? (
              <div className="optionButton">
                {/* status =1 -> course is closed */}
                {status !== 1 ? (
                  type !== "TUTOR" ? (
                    <button
                      className="buttonChooseTutor"
                      onClick={() => {
                        handleChooseTutor(item.account);
                      }}
                    >
                      Chọn gia sư
                    </button>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
                <button
                  className="buttonDetails"
                  onClick={() => {
                    handleClickDetails(item.account);
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            ) : option === 2? (
              <>
              {/* status =1 -> course is closed */}
              {status !== 1 ? (
                  type !== "TUTOR" ? (
                    <button
                      className="buttonChooseTutor"
                      onClick={() => {
                        handleChooseTutor(item.account);
                      }}
                    >
                      Chọn gia sư
                    </button>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </>
            ) : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorPFC;
