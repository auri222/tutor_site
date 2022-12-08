import "./listCourse.css";
import { useContext, useState, useEffect } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import CourseItem from "../../../components/courseItem/CourseItem";
import axios from "axios";
import ScrollTop from "../../../components/scrollTop/ScrollTop";

//List courses of User
const ListCourse = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const option = user !== null && user?.accountType === "USER" ? 1 : 2;

  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [unregistedCourses, setUnregisteredCourses] = useState([]);
  const [registedCourses, setRegisteredCourses] = useState([]);
  const [unregistedCoursesTotal, setUnregistedCoursesTotal] = useState(0);
  const [registedCoursesTotal, setRegistedCoursesTotal] = useState(0);
  const [showUnregistedCourses, setShowUnregistedCourses] = useState(true);
  const [showRegistedCourses, setShowRegistedCourses] = useState(false);
  //Load list course
  useEffect(() => {
    const fetchListCourse = async () => {
      try {
        if (option !== "" || option !== null) {
          if (option === 1) {
            const res = await axios.get(
              `http://localhost:8000/api/course/user/${id}`, {withCredentials: true}
            );
            if (res.data) {
              setList(res.data.courses);
              setTotal(res.data.total);
            }
          }

          if (option === 2) {
            const res1 = await axios.get(
              `http://localhost:8000/api/course/tutor/unregistered/${id}`, {withCredentials: true}
            );
            const res2 = await axios.get(
              `http://localhost:8000/api/course/tutor/registered/${id}`, {withCredentials: true}
            );
            if (res1.data && res2.data) {
              setRegisteredCourses(res1.data.courses);
              setRegistedCoursesTotal(res1.data.total);
              setUnregisteredCourses(res2.data.courses);
              setUnregistedCoursesTotal(res2.data.total);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchListCourse();
    console.log(`Option: ${option}`);
    console.log(`ID: ${id}`);
  }, [id, option]);

  useEffect(()=> {
    console.log(`List ${total}`);
    console.log(`Registered total ${registedCoursesTotal}`);
    console.log(`Unregistered total ${unregistedCoursesTotal}`);
  }, [total, registedCoursesTotal, unregistedCoursesTotal])

  const handleShowUnregisteredCourse = (e) => {
    setShowUnregistedCourses(!showUnregistedCourses);
    setShowRegistedCourses(!showRegistedCourses);
  };

  const handleShowRegisteredCourse = (e) => {
    setShowRegistedCourses(!showRegistedCourses);
    setShowUnregistedCourses(!showUnregistedCourses);
  };

  //Handle click "Xem chi tiet khoa hoc"
  const handleClickDetails = (id) => {
    navigate(`/courses/details/${id}`);
  };

  //Handle click "Tao khoa hoc"
  const handleClickCreatePublicCourse = () => {
    navigate("/courses/create");
    // console.log('CLick create new course');
  };

  return (
    <>
      <Navbar />
      <ScrollTop />
      <section className="listCourseUserContainer">
        <div className="container">
          <div className="listCourseUserWrapper">
            <h2 className="lCUTitle">Danh sách khóa học của bạn</h2>
            <div className="row d-flex align-items-center mb-2">
              <div className="col-md-6 text-start">
                <h4 className="lCUTitleTotal mb-2">
                  Tổng cộng:
                  { option === 1
                    ? ` ${total}`
                    : ""}
                  { option === 2 && showRegistedCourses
                    ? ` ${registedCoursesTotal}`
                    : ""}
                  { option === 2 && showUnregistedCourses
                    ? ` ${unregistedCoursesTotal}`
                    : ""}
                </h4>
              </div>
              <div className="col-md-6 text-end">
                {option !== "" && option === 1 ? (
                  <button
                    className="buttonCreatePublicCourse"
                    onClick={handleClickCreatePublicCourse}
                  >
                    Tạo khóa học
                  </button>
                ) : (
                  <>
                    <div
                      id="coursesOption"
                      className="form-check form-check-inline"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        onChange={handleShowUnregisteredCourse}
                        checked={showRegistedCourses}
                      />
                      <label className="form-check-label">
                        Khóa đã đăng ký
                      </label>
                    </div>
                    <div
                      id="coursesOption"
                      className="form-check form-check-inline"
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        onChange={handleShowRegisteredCourse}
                        checked={showUnregistedCourses}
                      />
                      <label className="form-check-label">
                        Khóa đã được chọn
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {user !== null && user?._id === id ? (
              <>
                {option !== "" && option === 1
                  ? list.length > 0
                    ? list.map((item, index) => (
                        <CourseItem
                          item={item}
                          handleClickDetails={handleClickDetails}
                          key={index}
                          show={1}
                        />
                      ))
                    : ""
                  : ""}
              </>
            ) : (
              "Bạn không có quyền vào trang này"
            )}

            {user !== null && user?._id === id ? (
              option !== "" && option === 2 ? (
                <>
                  {showRegistedCourses
                    ? registedCourses.length > 0
                      ? registedCourses.map((item, index) => (
                          <CourseItem
                            key={index}
                            item={item}
                            handleClickDetails={handleClickDetails}
                            show={1}
                          />
                        ))
                      : "Không có khóa được chọn."
                    : ""}
                  {showUnregistedCourses
                    ? unregistedCourses.length > 0
                      ? unregistedCourses.map((item, index) => (
                          <CourseItem
                            key={index}
                            item={item}
                            handleClickDetails={handleClickDetails}
                            show={1}
                          />
                        ))
                      : "Không có khóa được chọn."
                    : ""}
                </>
              ) : (
                ""
              )
            ) : (
              "Bạn không được phép vào trang này."
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ListCourse;
