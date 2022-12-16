import "./courseDetailsForDB.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import TutorPFC from "../../../components/tutorProfileForCourse/TutorPFC";

const CourseDetailsForDB = () => {
  const { id } = useParams();
  const [course, setCourse] = useState([]);
  const [publicCourseTutor, setPublicCourseTutor] = useState({});
  const [privateCourseTutor, setPrivateCourseTutor] = useState({});
  const [candidates, setCandidates] = useState([]);

  //Load course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/course/${id}`);

        if (res.data) {
          setCourse(res.data.course);
          setCandidates(res.data.candidates);
          setPublicCourseTutor(res.data.publicCourseTutor);
          setPrivateCourseTutor(res.data.privateCourseTutor);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourse();
  }, [id]);

  const showArrItem = (arr) => {
    let string = "";
    let i = 0;
    for (let item of arr) {
      if (i !== arr.length - 1) {
        string += item + ", ";
      } else {
        string += item;
      }
      i++;
    }

    return string;
  };

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
    <div className="courseDetailsForDB">
      <div className="courseDetailsTitleForDB">Thông tin chi tiết khóa học</div>
      <div className="courseDetailsWrapper">
        <div className="row mx-0">
          <div className="col-md-9 courseDetailsForDBWrapper">
            {/* Course details */}
            <div className="courseDetailsInfoForDB ">
              <h4 className="courseMiniTitleForDB">Chi tiết khóa học {course?.course_name}</h4>
              <div className="row mb-3">
                <div className="col-md-3 courseDetailsMiniTitle">Mã khóa học</div>
                <div className="col-md-9">{course?.course_code}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 courseDetailsMiniTitle">Tên khóa học</div>
                <div className="col-md-9">{course?.course_name}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 courseDetailsMiniTitle">Lớp</div>
                <div className="col-md-9">
                  {course?.course_classes
                    ? showArrItem(course?.course_classes)
                    : ""}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 courseDetailsMiniTitle">Môn</div>
                <div className="col-md-9">
                  {course?.course_subjects
                    ? showArrItem(course?.course_subjects)
                    : ""}
                </div>
              </div>
              <div className="row mb-3 ">
                <div className="col-md-3 courseDetailsMiniTitle">Lịch học</div>
                <div className="col-md-9">
                  {course?.course_schedule
                    ? showArrItem(course?.course_schedule)
                    : ""}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 courseDetailsMiniTitle">Thời lượng</div>
                <div className="col-md-9">{course?.course_time}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 courseDetailsMiniTitle">Yêu cầu riêng</div>
                <div className="col-md-9">{course?.course_requirement}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 courseDetailsMiniTitle">Địa chỉ</div>
                <div className="col-md-9">{`${course?.course_address?.ward}, ${course?.course_address?.district}, ${course?.course_address?.province}`}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 courseDetailsMiniTitle">
                  Trạng thái khóa học
                </div>
                <div className="col-md-9">
                  {course?.course_status === 2 ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Khóa đã đóng
                    </span>
                  ) : course?.course_status === 1 ? (
                    "Khóa đã chọn gia sư"
                  ) : (
                    <span
                      style={{
                        color: "#4a934a",
                        fontWeight: "bold",
                        textShadow: "#08f26e 1px 0 1px",
                      }}
                    >
                      Khóa chưa chọn gia sư
                    </span>
                  )}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3 courseDetailsMiniTitle">
                  Ngày tạo khóa học
                </div>
                <div className="col-md-9">
                  {showCreatedDate(course?.course_created_at)}
                </div>
              </div>
              <hr />
            </div>

            {/* Course's chosen tutor */}
            {publicCourseTutor || privateCourseTutor ? (
              publicCourseTutor !== null &&
              privateCourseTutor !== null &&
              (Object.keys(publicCourseTutor).length !== 0 ||
                Object.keys(privateCourseTutor).length !== 0) ? (
                <div className="courseTutorForDB">
                  <h4 className="courseMiniTitleForDB">
                    Thông tin gia sư được chọn
                  </h4>
                  <div className="row">
                    {course?.course_registered_tutor ? (
                      <div className="col-md-12 mb-3">
                        {course?.course_purpose === 1 &&
                        course?.course_registered_tutor?.registered_tutor &&
                        Object.keys(publicCourseTutor).length !== 0 ? (
                          <TutorPFC item={publicCourseTutor} />
                        ) : (
                          ""
                        )}

                        {course?.course_purpose === 2 &&
                        course?.course_registered_tutor?.registered_tutor &&
                        Object.keys(privateCourseTutor).length !== 0 ? (
                          // <TutorPFC item={privateCourseTutor} />
                          <TutorPFC item={privateCourseTutor} />
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      <div className="col-md-12">Chưa có</div>
                    )}
                    <hr />
                  </div>
                </div>
              ) : (
                <div className="courseTutorForDB">
                  <h4 className="courseMiniTitleForDB">
                    Thông tin gia sư được chọn
                  </h4>
                  <div className="row mb-3">
                      <div className="col-md-12">Chưa chọn gia sư hoặc gia sư này đã bị xóa<hr /> </div>
                    
                  </div>
                </div>
              )
            ) : (
              ""
            )}

            {/* Course candidates */}
            {course?.course_candidates && candidates.length > 0 ? (
              <div className="courseCandidatesForDB">
                <h4 className="courseMiniTitleForDB">Danh sách gia sư ứng cử</h4>
                <div className="row">
                  <div className="mb-3">
                    {course?.course_candidates && candidates.length > 0
                      ? candidates.map((item, index) => (
                          <>
                            {item !== null ? (
                              <TutorPFC
                                item={item}
                                key={index}
                                status={course?.course_status === 2 ? 1 : 0}
                              />
                            ) : (
                              "Tài khoản của một gia sư trong danh sách ứng cử viên đã bị xóa."
                            )}
                          </>
                        ))
                      : ""}
                      <hr />
                  </div>
                  
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsForDB;
