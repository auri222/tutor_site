import "./courseItem.css";

import React from "react";

const CourseItem = ({
  item,
  handleClickDetails,
  option,
  handleClickRegister,
  show,
}) => {
  const showCreatedDate = (date) => {
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
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-12">
          <div className="card-body cICardBody">
            <h5 className="card-title cICardTitle">
              {item.course_name}
              {item.course_purpose === 2 ? (
                <span className="badge text-bg-primary ms-2">Khóa không công khai</span>
              ) : (
                <span className="badge text-bg-info ms-2">Khóa công khai</span>
              )}
            </h5>
            <span className="card-datetime">
              Tạo lúc {showCreatedDate(item.course_created_at)}
            </span>
            <div className="card-text mb-2">
              <div className="row">
                <div className="col-md-3 courseItemTitle">Mã khóa học</div>
                <div className="col-md-9">
                  {item.course_code}
                </div>
              </div>
            </div>
            <div className="card-text mb-2">
              <div className="row">
                <div className="col-md-3 courseItemTitle">Lớp học</div>
                <div className="col-md-9">
                  {item.course_classes
                    ? item.course_classes.map((classElem, index) => (
                        <span key={index}>
                          {index === item.course_classes.length - 1
                            ? `${classElem}`
                            : `${classElem}, `}
                        </span>
                      ))
                    : "Không có"}
                </div>
              </div>
            </div>
            <div className="card-text mb-2">
              <div className="row">
                <div className="col-md-3 courseItemTitle">Môn học</div>
                <div className="col-md-9">
                  {item.course_subjects
                    ? item.course_subjects.map((subjectElem, index) => (
                        <span key={index}>
                          {index === item.course_subjects.length - 1
                            ? `${subjectElem}`
                            : `${subjectElem}, `}
                        </span>
                      ))
                    : "Không có"}
                </div>
              </div>
            </div>
            <div className="card-text mb-2">
              <div className="row">
                <div className="col-md-3 courseItemTitle">Lịch học</div>
                <div className="col-md-9">
                  {item.course_schedule
                    ? item.course_schedule.map((scheduleElem, index) => (
                        <span key={index}>
                          {index === item.course_schedule.length - 1
                            ? `${scheduleElem}`
                            : `${scheduleElem}, `}
                        </span>
                      ))
                    : "Không có"}
                </div>
              </div>
            </div>
            <div className="card-text mb-2">
              <div className="row">
                <div className="col-md-3 courseItemTitle">Địa chỉ</div>
                <div className="col-md-9">{`${item.course_address.street}, ${item.course_address.ward}, ${item.course_address.district}, ${item.course_address.province}`}</div>
              </div>
            </div>
            <div className="card-text mb-2">
              <div className="row">
                <div className="col-md-3 courseItemTitle">Yêu cầu </div>
                <div className="col-md-9">{item.course_requirement}</div>
              </div>
            </div>
            <div className="card-text mb-2">
              <div className="row">
                <div className="col-md-3 courseItemTitle">
                  Trạng thái khóa học
                </div>
                <div className="col-md-9">
                  {item.course_status === 0 ? (
                    <span
                      style={{
                        color: "#4a934a",
                        fontWeight: "bold",
                        textShadow: "#08f26e 1px 0 1px",
                      }}
                    >
                      Khóa chưa chọn gia sư
                    </span>
                  ) : item.course_status === 2 ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Khóa đã đóng (đã chọn được gia sư) lúc{" "}
                      {showCreatedDate(
                        item?.course_registered_tutor?.registered_date_accepted
                      )}
                    </span>
                  ) : item.course_status === 1 ? (
                    <span style={{ fontWeight: "bold" }}>
                      Khóa đang đợi gia sư đồng ý
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="optionButton">
              {show && show === 1 ? (
                option ? (
                  <>
                    {option === 1 ? (
                      <>
                        {item.course_status === 2 ? (
                          ""
                        ) : (
                          <button
                            className="buttonRegister"
                            onClick={() => {
                              handleClickRegister(item._id);
                            }}
                          >
                            Đăng ký ngay
                          </button>
                        )}
                        <button
                          className="buttonDetails"
                          onClick={() => {
                            handleClickDetails(item._id);
                          }}
                        >
                          Xem chi tiết khóa học
                        </button>
                      </>
                    ) : (
                      <button
                        className="buttonDetails"
                        onClick={() => {
                          handleClickDetails(item._id);
                        }}
                      >
                        Xem chi tiết khóa học
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    className="buttonDetails"
                    onClick={() => {
                      handleClickDetails(item._id);
                    }}
                  >
                    Xem chi tiết khóa học
                  </button>
                )
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
