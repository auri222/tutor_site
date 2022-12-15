import "./course.css";
import React from "react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import TutorPFC from "../../../components/tutorProfileForCourse/TutorPFC";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import ScaleLoader from "react-spinners/ScaleLoader";
import ScrollTop from "../../../components/scrollTop/ScrollTop";
//Public
//Show course details
//Hiển thị nút "Đăng ký khóa" => Chặn khi USER chưa LOGIN
//User type == USER hay PHHS and check ID == account ID => show "Sửa", "Chọn" -> list ứng viên, "Xóa"
//User type == TUTOR => show "Đăng ký khóa học"
//User type == TUTOR AND user accountId == registed_tutor => Show "Chấp nhận" và "không chấp nhận"
const Course = () => {
  const { id } = useParams(); // CourseID
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  const [publicCourseTutor, setPublicCourseTutor] = useState({});
  const [privateCourseTutor, setPrivateCourseTutor] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  //Load course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/course/${id}`);

        if (res.data) {
          // console.log(res.data);
          // console.log(res.data.course);
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


  //Choose tutor for public course
  const handleChooseTutor = async (tutorID) => {
    // console.log("Chọn gia sư: " + tutorID);
    // console.log(course?.account === user?._id);
    try {
      if (user !== null) {
        if (user?.accountType === "USER" && course?.account === user?._id) {
          const confirm = await Swal.fire({
            title: "Cảnh báo",
            text: `Bạn có muốn chọn gia sư này cho khóa học của bạn?`,
            icon: "warning",
            confirmButtonText: "Chắc chắn",
            cancelButtonText: "Đóng",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
          });

          if (confirm && confirm.isConfirmed) {
            setLoading(true);
            const res = await axios.put(
              `http://localhost:8000/api/course/choose/${course._id}`,
              {
                PHHS_id: user?._id,
                tutor_id: tutorID,
              },
              { withCredentials: true }
            );
            if (res.data.success) {
              setLoading(false);
              Swal.fire({
                title: "Hoàn thành",
                text: `${res.data.message}`,
                icon: "success",
                confirmButtonText: "Xong",
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate(0, { replace: true });
                }
              });
            }
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Bạn không có quyền để thực hiện hành động này!",
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Bạn cần đăng nhập để thực hiện hành động này!",
        });
      }
    } catch (error) {
      if (!error.response.data.success) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "" + error.response.data.message,
        });
        setLoading(false);
      }
    }
  };

  //click to see tutor details for public course
  const handleClickDetails = (tutorID) => {
    // console.log("Xem chi tiết gia sư: " + tutorID);
    navigate(`/profile/${tutorID}`);
  };

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

  //Register Course
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (user !== null) {
        if (user?.accountType === "TUTOR") {
          setLoading(true);
          const res = await axios.put(
            `http://localhost:8000/api/course/register/${id}`,
            { tutor_id: user._id },
            { withCredentials: true }
          );

          if (res.data.success) {
            setLoading(false);
            Swal.fire({
              title: "Hoàn thành",
              text: `${res.data.message}`,
              icon: "success",
              confirmButtonText: "Xong",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate(0); //replace: true => cannot going back to this page
              }
            });
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Bạn không có quyền để thực hiện hành động này!",
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Bạn cần đăng nhập để thực hiện hành động này!",
        });
      }
    } catch (error) {
      if (!error.response.data.success) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "" + error.response.data.message,
        });
        setLoading(false);
      }
    }
  };

  const handleUnregister = async (e) => {
    e.preventDefault();
    try {
      const confirm = await Swal.fire({
        title: "Cảnh bác",
        text: `Bạn chắc sẽ hủy đăng ký chứ?`,
        icon: "warning",
        confirmButtonText: "Chắc chắn",
        cancelButtonText: "Đóng",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });
      // console.log(`confirm: `);
      // console.log(confirm);
      if (confirm && confirm.isConfirmed) {
        setLoading(true);
        const res = await axios.put(
          `http://localhost:8000/api/course/unregister/${id}`,
          { tutor_id: user?._id },
          { withCredentials: true }
        );
        if (res.data.success) {
          setLoading(false);
          Swal.fire({
            title: "Hoàn thành",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Xong",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(0);
            }
          });
        }
      }
    } catch (error) {
      // console.log(error);
      if (!error.response.data.success) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "" + error.response.data.message,
        });
        setLoading(false);
      }
    }
  };

  const handleAcceptPrivateCourse = async () => {
    console.log(`Accept: ${user._id}`);
    try {
      if (user !== null) {
        if (user?.accountType === "TUTOR") {
          setLoading(true);
          const res = await axios.put(
            `http://localhost:8000/api/course/acceptPrivateCourse/${course._id}`,
            {
              tutor_id: user?._id,
            },
            { withCredentials: true }
          );
          if (res.data.success) {
            setLoading(false);
            Swal.fire({
              title: "Hoàn thành",
              text: `${res.data.message}`,
              icon: "success",
              confirmButtonText: "Xong",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate(0);
              }
            });
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Bạn không có quyền để thực hiện hành động này!",
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Bạn cần đăng nhập để thực hiện hành động này!",
        });
      }
    } catch (error) {
      if (!error.response.data.success) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "" + error.response.data.message,
        });
        setLoading(false);
      }
    }
  };
  const handleRejectPrivateCourse = async () => {
    console.log(`Reject: ${user._id}`);
    try {
      if (user !== null) {
        if (user?.accountType === "TUTOR") {
          const confirm = await Swal.fire({
            title: "Cảnh bác",
            text: `Bạn không chấp nhận giảng dạy cho khóa học này?`,
            icon: "warning",
            confirmButtonText: "Chắc chắn",
            cancelButtonText: "Đóng",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
          });

          if (confirm && confirm.isConfirmed) {
            setLoading(true);
            const res = await axios.delete(
              `http://localhost:8000/api/course/rejectPrivateCourse/${course._id}&${user?._id}`,
              { withCredentials: true }
            );
            if (res.data.success) {
              setLoading(false);
              Swal.fire({
                title: "Hoàn thành",
                text: `${res.data.message}`,
                icon: "success",
                confirmButtonText: "Xong",
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate("/");
                }
              });
            }
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Bạn không có quyền để thực hiện hành động này!",
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Bạn cần đăng nhập để thực hiện hành động này!",
        });
      }
    } catch (error) {
      if (!error.response.data.success) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "" + error.response.data.message,
        });
        setLoading(false);
      }
    }
  };

  const handleDeleteCourse = async () => {
    try {
      if (user !== null) {
        if (user?.accountType === "USER") {
          const confirm = await Swal.fire({
            title: "Cảnh báo",
            text: `Bạn có muốn xóa khóa học này?`,
            icon: "warning",
            confirmButtonText: "Chắc chắn",
            cancelButtonText: "Đóng",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
          });

          if (confirm && confirm.isConfirmed) {
            setLoading(true);
            const res = await axios.delete(
              `http://localhost:8000/api/course/delete/${course._id}&${user?._id}`,
              { withCredentials: true }
            );
            if (res.data.success) {
              setLoading(false);
              Swal.fire({
                title: "Hoàn thành",
                text: `${res.data.message}`,
                icon: "success",
                confirmButtonText: "Xong",
              }).then((result) => {
                if (result.isConfirmed) {
                  navigate(`/courses/list/${user._id}`, { replace: true });
                }
              });
            }
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Bạn không có quyền để thực hiện hành động này!",
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Bạn cần đăng nhập để thực hiện hành động này!",
        });
      }
    } catch (error) {
      if (!error.response.data.success) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "" + error.response.data.message,
        });
        setLoading(false);
      }
    }
  };

  const handleEditCourse = () => {
    navigate(`/courses/edit/${id}`);
  }
  // useEffect(() => {
  //   console.log("Bắt đầu kiểm tra loại khóa học: ")
  //   if(course){
  //     console.log(course?.course_purpose === 2 && course?.course_registered_tutor?.registered_tutor && Object.keys(privateCourseTutor).length !== 0);
  //     console.log(course?.course_purpose === 2);
  //     console.log(course?.course_registered_tutor?.registered_tutor);
  //     console.log(Object.keys(privateCourseTutor).length !== 0);
  //   }
  //   else {
  //     console.log("Khóa học không tồn tại");
  //   }
  //   console.log("Kết thúc kiểm tra");
  // }, [course]);

  return (
    <>
      <Navbar />
      <ScrollTop />
      <section
        className="courseContainer"
        style={{ minHeight: "calc(100vh - 80px - 163.6px)" }}
      >
        {loading && (
          <div className="loader">
            <ScaleLoader
              color="rgba(126, 208, 240, 1)"
              loading={loading}
              size={50}
            />
            <span>Đang xử lý. Hãy đợi một tí ...</span>
          </div>
        )}
        <div className="container">
          <div className="courseWrapper">
            {course ?
              Object.keys(course).length > 0 ? (
              <>
                <h2 className="courseTitle">
                  Thông tin chi tiết {course?.course_name}
                </h2>
                <hr />
                {/* Course details */}
                <div className="courseDetails mb-3">
                  <h4 className="courseMiniTitle">Chi tiết khóa học</h4>
                  <div className="row mb-3">
                    <div className="col-md-3 courseDetailsTitle">
                      Mã khóa học
                    </div>
                    <div className="col-md-9">{course?.course_code}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-3 courseDetailsTitle">
                      Tên khóa học
                    </div>
                    <div className="col-md-9">{course?.course_name}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-3 courseDetailsTitle">Lớp</div>
                    <div className="col-md-9">
                      {course?.course_classes
                        ? showArrItem(course?.course_classes)
                        : ""}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-3 courseDetailsTitle">Môn</div>
                    <div className="col-md-9">
                      {course?.course_subjects
                        ? showArrItem(course?.course_subjects)
                        : ""}
                    </div>
                  </div>
                  <div className="row mb-3 ">
                    <div className="col-md-3 courseDetailsTitle">Lịch học</div>
                    <div className="col-md-9">
                      {course?.course_schedule
                        ? showArrItem(course?.course_schedule)
                        : ""}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-3 courseDetailsTitle">
                      Thời lượng
                    </div>
                    <div className="col-md-9">{course?.course_time}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-3 courseDetailsTitle">
                      Yêu cầu riêng
                    </div>
                    <div className="col-md-9">{course?.course_requirement}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-3 courseDetailsTitle">Địa chỉ</div>
                    <div className="col-md-9">
                      {course?.account === user?._id ? `${course?.course_address?.home_number}, ${course?.course_address?.street}, ` : ''}
                      {`${course?.course_address?.ward}, ${course?.course_address?.district}, ${course?.course_address?.province}`}
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-3 courseDetailsTitle">
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
                    <div className="col-md-3 courseDetailsTitle">
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
                  publicCourseTutor !== null || privateCourseTutor !== null) ? (Object.keys(publicCourseTutor).length !== 0 ||
                Object.keys(privateCourseTutor).length !== 0) ? (
                  <div className="courseTutor">
                    <h4 className="courseMiniTitle">
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
                ): "" :"" : ""}
              

                {/* Course candidates */}
                {course?.course_candidates && candidates.length > 0 ? (
                  <div className="courseCandidates">
                    <h4 className="courseMiniTitle">Danh sách gia sư ứng cử</h4>
                    <div className="row">
                      <div className="mb-3">
                        {course?.course_candidates && candidates.length > 0
                          ? candidates.map((item, index) => (
                            <>
                              {item !== null ? (
                                <TutorPFC
                                option={item.account === user?._id ? 2 : 1}
                                handleChooseTutor={handleChooseTutor}
                                handleClickDetails={handleClickDetails}
                                item={item}
                                key={index}
                                status={course?.course_status === 2 ? 1 : 0}
                                type={user?.accountType}
                              />
                              ) : "Tài khoản của một gia sư trong danh sách ứng cử viên đã bị xóa."}
                              
                            </>
                            ))
                          : ""}
                      </div>
                      <hr />
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {/* Course options (button)*/}
                {course?.course_status === 2 ? (
                  <span>Khóa đã đóng vì đã chọn được gia sư</span>
                ) : (
                  <div className="courseOptions">
                    <div className="row">
                      <div className="col-md-12">
                        {/* Khóa đã có chọn được gia sư và là khóa public => không có options*/}
                        {course?.course_purpose === 1 &&
                          Object.keys(publicCourseTutor).length !== 0 && (
                            <span>Khóa public đã có ứng viên</span>
                          )}

                        {/* Khóa public chưa chọn được gia sư và là chủ của khóa học */}
                        {user?.accountType === "USER" &&
                          course?.account === user?._id &&
                          course?.course_purpose === 1 &&
                          Object.keys(publicCourseTutor).length === 0 && (
                            <>
                              <button
                              type="button"
                              className="btn btn-danger py-2 mx-2"
                              onClick={handleDeleteCourse}
                            >
                              Xóa khóa học
                            </button>
                            <button
                              type="button"
                              className="btn btn-warning py-2 mx-2"
                              onClick={handleEditCourse}
                            >
                              Sửa thông tin khóa học
                            </button>
                            </>
                          )}

                        {/* Khóa public chưa chọn được gia sư và chưa là ứng viên của khóa */}
                        {user?.accountType === "TUTOR" &&
                          course?.course_purpose === 1 &&
                          course?.course_candidates.includes(user?._id) ===
                            false &&
                          Object.keys(publicCourseTutor).length === 0 && (
                            <button
                              type="submit"
                              className="btn btn-primary py-2"
                              onClick={handleRegister}
                            >
                              Đăng ký khóa học
                            </button>
                          )}

                        {/* Khóa public chưa chọn được gia sư và là ứng viên trong danh sách ứng viên của khóa học */}
                        {user?.accountType === "TUTOR" &&
                          course?.course_purpose === 1 &&
                          course?.course_candidates.includes(user?._id) ===
                            true &&
                          Object.keys(publicCourseTutor).length === 0 && (
                            <button
                              type="submit"
                              className="btn btn-danger py-2"
                              onClick={handleUnregister}
                            >
                              Hủy đăng ký khóa học
                            </button>
                          )}

                        {/* Khóa private và là gia sư được chọn */}
                        {user?.accountType === "TUTOR" &&
                          course?.course_purpose === 2 && privateCourseTutor !== null &&
                          Object.keys(privateCourseTutor).length !== 0 && (
                            <>
                              <button
                                type="button"
                                className="btn btn-primary py-2 me-2"
                                onClick={handleAcceptPrivateCourse}
                              >
                                Đồng ý đăng ký
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger py-2"
                                onClick={handleRejectPrivateCourse}
                              >
                                Không đồng ý đăng ký
                              </button>
                            </>
                          )}

                        {/* Khóa private và là chủ khóa */}
                        {user?.accountType === "USER" &&
                          course?.account === user?._id &&
                          course?.course_purpose === 2 && privateCourseTutor !== null &&
                          Object.keys(privateCourseTutor).length !== 0 && (
                            <>
                              <button
                                type="button"
                                className="btn btn-warning py-2 me-2"
                                onClick={handleEditCourse}
                              >
                                Sửa thông tin khóa học
                              </button>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : 
              "Khóa học không tồn tại."
              : "Khóa học không tồn tại."
            }
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Course;
