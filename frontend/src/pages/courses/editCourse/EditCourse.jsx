import "./editCourse.css";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

const EditCourse = () => {
  const { id } = useParams(); //courseID
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  //Register tutor
  const [oldCourse, setOldCourse] = useState([]);
  const [course, setCourse] = useState({
    course_name: "",
    course_requirement: "",
    course_time: "",
  });
  const [address, setAddress] = useState({
    home_number: "",
    street: "",
    ward: "",
    district: "",
    province: "",
  });

  const [addrOption, setAddrOption] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [error, setError] = useState({});

  //Load
  const [subjects, setSubjects] = useState([]); //load
  const [schedules, setSchedules] = useState([]); //load
  const [classes, setClasses] = useState([]); //Load data classes
  const [provinces, setProvinces] = useState([]); //load
  const [districts, setDistricts] = useState([]); //load
  const [wards, setWards] = useState([]); //load

  // Load data when page load
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/course/${id}`);

        if (res.data) {
          setOldCourse(res.data.course);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProvinces = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/location/provinces"
        );
        setProvinces(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProvinces();

    const fetchClass = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/class");
        setClasses(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSubject = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/subject");
        setSubjects(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSchedule = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/schedule");
        setSchedules(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourse();
    fetchClass();
    fetchSubject();
    fetchSchedule();
  }, [id]);

  useEffect(() => {
    setCourse((prev) => ({
      ...prev,
      course_name: oldCourse?.course_name,
      course_time: oldCourse?.course_time,
      course_requirement: oldCourse?.course_requirement,
    }));
    setAddress((prev) => ({
      ...prev,
      home_number: oldCourse?.course_address?.home_number,
      street: oldCourse?.course_address?.street,
      ward: oldCourse?.course_address?.ward,
      district: oldCourse?.course_address?.district,
      province: oldCourse?.course_address?.province,
    }));
    setSelectedClasses(oldCourse?.course_classes || []);
    setSelectedSchedules(oldCourse?.course_schedule || []);
    setSelectedSubjects(oldCourse?.course_subjects || []);
    // console.log(oldCourse.course_schedule);
  }, [oldCourse]);

  const handleCourseChange = (e) => {
    setCourse({ ...course, [e.target.id]: e.target.value });
  };

  const handleAddrOptionChange = (e) => {
    setAddrOption(!addrOption);
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.id]: e.target.value });
  };

  const handleProvinceChange = (e) => {
    setAddress({
      ...address,
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text,
    });
    const code = e.target.value;

    const fetchDistrict = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/location/districts?parent_code=${code}`
        );
        setDistricts(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDistrict();
  };

  const handleDistrictChange = (e) => {
    setAddress({
      ...address,
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text,
    });
    const code = e.target.value;

    const fetchWard = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/location/wards?parent_code=${code}`
        );
        setWards(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWard();
  };

  const handleWardChange = (e) => {
    setAddress({
      ...address,
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text,
    });
  };

  const handleSelectClasses = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedClasses(
      checked
        ? [...selectedClasses, value]
        : selectedClasses.filter((item) => item !== value)
    );
  };

  const handleSelectSubjects = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedSubjects(
      checked
        ? [...selectedSubjects, value]
        : selectedSubjects.filter((item) => item !== value)
    );
  };

  const handleSelectSchedules = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedSchedules(
      checked
        ? [...selectedSchedules, value]
        : selectedSchedules.filter((item) => item !== value)
    );
  };

  const validateForm = () => {
    let err = {};
    let isValidate = true;

    //Check course name, course time
    if (course.course_name === "") {
      isValidate = false;
      err["course_name"] = "Hãy nhập tên lớp học.";
    }

    if (course.course_time === "") {
      isValidate = false;
      err["course_time"] = "Hãy nhập giờ học.";
    }

    //Check course schedule, class, subject
    if (selectedClasses.length === 0) {
      isValidate = false;
      err["course_classes"] = "Hãy chọn lớp học.";
    }
    if (selectedSubjects.length === 0) {
      isValidate = false;
      err["course_subjects"] = "Hãy chọn môn học.";
    }
    if (selectedSchedules.length === 0) {
      isValidate = false;
      err["course_schedules"] = "Hãy chọn lịch học.";
    }

    //Check address, addrOption
    if (addrOption) {
      if (
        address.home_number === "" ||
        address.street === "" ||
        address.ward === "" ||
        address.district === "" ||
        address.province === ""
      ) {
        isValidate = false;
        err["address"] =
          "Hãy nhập đầy đủ địa chỉ hoặc tick vào ô giữ nguyên địa chỉ";
      }
    }

    setError(err);

    return isValidate;
  };

  const errorArr = Object.keys(error).map((k, i) => (
    <li key={i}>{error[k]}</li>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        const updatedCourse = {
          course_name: course.course_name,
          course_time: course.course_time,
          course_requirement: course.course_requirement,
          course_classes: selectedClasses,
          course_schedules: selectedSchedules,
          course_subjects: selectedSubjects,
          home_number: address.home_number,
          street: address.street,
          ward: address.ward,
          district: address.district,
          province: address.province,
        };
        const res = await axios.put(
          `http://localhost:8000/api/course/edit/${id}`,
          {
            PHHS_id: user._id,
            updatedCourse: updatedCourse,
            addrOption: addrOption,
          },
          { withCredentials: true }
        );
        if (res.data.success) {
          Swal.fire({
            title: "Hoàn thành",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Xong",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/courses/details/${id}`, {
                replace: true,
              }); //replace: true => cannot going back to this page
            }
          });
        }
      }
    } catch (error) {
      if (!error.response.data.success) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "" + error.response.data.message,
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <section className="cCContainer">
        <div className="container">
          <div className="cCWrapper">
            <h2 className="cCTitle">Sửa thông tin khóa học</h2>
            <hr />
            {user?._id ? (
              <form className="cCForm">
                {/* Lien he */}
                <div className="row">
                  <div className="col-md-3">
                    <h4 className="cCFPartTitle">Chi tiết khóa học</h4>
                  </div>
                  <div className="col-md-9">
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-8">
                          <label htmlFor="course_name">Tên khóa học</label>
                          <input
                            type="text"
                            id="course_name"
                            className="form-control"
                            placeholder="Lớp môn toán cho lớp 10 ..."
                            value={course?.course_name || ""}
                            required
                            onChange={handleCourseChange}
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="course_time">Thời gian học</label>
                          <input
                            type="text"
                            id="course_time"
                            className="form-control"
                            value={course?.course_time || ""}
                            placeholder="2h/1 buổi"
                            required
                            onChange={handleCourseChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="course_requirement">
                        Yêu cầu cho gia sư
                      </label>
                      <textarea
                        id="course_requirement"
                        className="form-control"
                        placeholder="Điền yêu cầu cho gia sư"
                        required
                        value={course?.course_requirement || ""}
                        onChange={handleCourseChange}
                        rows="3"
                      ></textarea>
                    </div>

                    {/* Lớp học */}
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="classes">Lớp học</label> <br />
                          {classes ? (
                            <>
                              {classes.map((item) => (
                                <div
                                  id="classes"
                                  key={item._id}
                                  className="form-check form-check-inline"
                                >
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={handleSelectClasses}
                                    checked={
                                      selectedClasses.includes(item.name)
                                        ? true
                                        : false
                                    }
                                    value={item.name}
                                  />
                                  <label className="form-check-label">
                                    {item.name}
                                  </label>
                                </div>
                              ))}
                            </>
                          ) : (
                            "Không có dữ liệu"
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Môn học*/}
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="subjects">Môn học</label> <br />
                          {subjects ? (
                            <>
                              {subjects.map((item) => (
                                <div
                                  id="subjects"
                                  key={item._id}
                                  className="form-check form-check-inline"
                                >
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={handleSelectSubjects}
                                    checked={
                                      selectedSubjects.includes(item.name)
                                        ? true
                                        : false
                                    }
                                    value={item.name}
                                  />
                                  <label className="form-check-label">
                                    {item.name}
                                  </label>
                                </div>
                              ))}
                            </>
                          ) : (
                            "Không có dữ liệu"
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Lịch học*/}
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="schedules">Lịch học</label> <br />
                          {schedules ? (
                            <>
                              {schedules.map((item) => (
                                <div
                                  id="schedules"
                                  key={item._id}
                                  className="form-check form-check-inline"
                                >
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={handleSelectSchedules}
                                    checked={
                                      selectedSchedules.includes(item.name)
                                        ? true
                                        : false
                                    }
                                    value={item.name}
                                  />
                                  <label className="form-check-label">
                                    {item.name}
                                  </label>
                                </div>
                              ))}
                            </>
                          ) : (
                            "Không có dữ liệu"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>

                {/* Thong tin ca nhan */}
                <div className="row">
                  <div className="col-md-3">
                    <h4 className="cCFPartTitle">Địa chỉ khóa học</h4>
                  </div>
                  <div className="col-md-9">
                    <div className="row mb-2">
                      <div className="col-md-12">
                        <div
                          id="addrOpt"
                          className="form-check form-check-inline"
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            onChange={handleAddrOptionChange}
                            value={addrOption ? "checked" : "uncheck"}
                          />
                          <label className="form-check-label">
                            Thay đổi địa chỉ
                          </label>
                        </div>
                        <div>
                          <small>
                            Hãy chọn tùy chọn này khi bạn muốn thay đổi địa chỉ.
                          </small>
                        </div>
                      </div>
                    </div>
                    {addrOption && (
                      <>
                        <div className="mb-3">
                          <div className="row">
                            <div className="col-md-6">
                              <label htmlFor="home_number">Số nhà</label>
                              <input
                                type="text"
                                id="home_number"
                                className="form-control"
                                placeholder="Số 123/H2"
                                onChange={handleAddressChange}
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Số nhà chỉ hiển thị cho gia sư được chọn thông qua email"

                              />
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="street">Tên đường</label>
                              <input
                                type="text"
                                id="street"
                                className="form-control"
                                placeholder="Đường 3/2"
                                onChange={handleAddressChange}

                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="row mb-3">
                            <div className="col-md-4">
                              <label htmlFor="province">Tỉnh thành</label>
                              <select
                                id="province"
                                className="form-control"
                                onChange={handleProvinceChange}
                                defaultValue={"DEFAULT"}
                              >
                                <option value={"DEFAULT"} disabled>
                                  --Chọn tỉnh thành--
                                </option>
                                {provinces ? (
                                  provinces.map((province) => (
                                    <option
                                      key={province.code}
                                      value={province.code}
                                    >
                                      {province.name_with_type}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>--Chọn tỉnh thành--</option>
                                )}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label htmlFor="district">Quận huyện</label>
                              <select
                                id="district"
                                className="form-control"
                                onChange={handleDistrictChange}
                                defaultValue={"DEFAULT"}
                              >
                                <option value={"DEFAULT"} disabled>
                                  --Chọn quận huyện--
                                </option>
                                {districts ? (
                                  districts.map((district) => (
                                    <option
                                      key={district.code}
                                      value={district.code}
                                    >
                                      {district.name_with_type}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>--Chọn quận huyện--</option>
                                )}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label htmlFor="ward">Phường xã</label>
                              <select
                                id="ward"
                                className="form-control"
                                onChange={handleWardChange}
                                defaultValue={"DEFAULT"}
                              >
                                <option value={"DEFAULT"} disabled>
                                  --Chọn phường xã--
                                </option>
                                {wards ? (
                                  wards.map((ward) => (
                                    <option key={ward.code} value={ward.code}>
                                      {ward.name_with_type}
                                    </option>
                                  ))
                                ) : (
                                  <option disabled>--Chọn phường xã--</option>
                                )}
                              </select>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <hr />
                </div>

                {Object.keys(error).length !== 0 ? (
                  <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-9">
                      <div className="mb-3">
                        <div className="alert alert-warning mb-3" role="alert">
                          {errorArr}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <button
                  className="fButton"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Đăng ký khóa học
                </button>
              </form>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default EditCourse;
