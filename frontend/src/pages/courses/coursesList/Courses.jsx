import "./courses.css";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import CourseItem from "../../../components/courseItem/CourseItem";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Load course list theo course_purpose = 1 AND course_status = 0
import { useContext, useState, useEffect } from "react";
import ScrollTop from "../../../components/scrollTop/ScrollTop";

const Courses = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  //Search data
  const [courseCode, setCourseCode] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
  });

  // Load initial
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [subjects, setSubjects] = useState([]); //load
  const [classes, setClasses] = useState([]); //Load data classes
  const [provinces, setProvinces] = useState([]); //load
  const [districts, setDistricts] = useState([]); //load
  const [wards, setWards] = useState([]); //load

  useEffect(() => {
    const fetchCoursesList = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/course/");
        if (res.data) {
          setTotal(res.data.total);
          setList(res.data.coursesList);
        }
      } catch (error) {
        console.log(error.data);
      }
    };

    fetchCoursesList();

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

    fetchClass();
    fetchSubject();
  }, []);

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

  const handleProvinceChange = (e) => {
    setAddress({
      ...address,
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text.replace(
        /[\s]/g,
        "%20"
      ),
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
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text.replace(
        /[\s]/g,
        "%20"
      ),
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
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text.replace(
        /[\s]/g,
        "%20"
      ),
    });
  };

  const handleSearch = async () => {
    try {
      let stringClass = "";
      selectedClasses?.forEach((item, index) => {
        stringClass += (index === selectedClasses.length-1) ? `${item}`: `${item},`;
      })

      let stringSubject = "";
      selectedSubjects?.forEach((item, index) => {
        stringSubject += (index === selectedSubjects.length-1)? `${item}`: `${item},`;
      })
      console.log(stringClass);
      console.log(stringSubject);
      const url = `http://localhost:8000/api/course?course_code=${courseCode}&classes=${stringClass}&subjects=${stringSubject}&province=${address.province}&district=${address.district}&ward=${address.ward}`;
      const res = await axios.get(url);
      if(res.data){
        setTotal(res.data.total);
        setList(res.data.coursesList);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClickDetails = (id) => {
    navigate(`/courses/details/${id}`);
  };

  const handleClickRegister = async (id) => {
    try {
      if(user !== null){
        if(user?.accountType === "TUTOR"){
          const res = await axios.put(`http://localhost:8000/api/course/register/${id}`, {
            tutor_id: user?._id
          }, {withCredentials:true});
          if(res.data.success){
            Swal.fire({
              title: "Hoàn thành",
              text: `${res.data.message}!`,
              icon: "success",
              confirmButtonText: "Đi đến trang chi tiết khóa học",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate(`/courses/details/${id}`);
              }
            });
          }
        }
        else{
          Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo',
            text: 'Đăng ký khóa học chỉ dành cho gia sư!',
          })
        }
      }
      else {
        Swal.fire({
          icon: 'warning',
          title: 'Cảnh báo',
          text: 'Bạn cần đăng nhập để thực hiện đăng ký!',
        })
      }
    } catch (error) {
      if(!error.response.data.success){
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: ''+error.response.data.message,
        })
      }
    }
  }


  return (
    <>
      <Navbar />
      <ScrollTop />
      <section className="clSearch py-4">
        <div className="container">
          <div className="clSearchOptionsContainer">
            <h4 className="clSOTitle">Tìm kiếm khóa học</h4>
            <hr />
            <div className="clSOItems my-3">
              {/* Search tutor name */}
              <div className="row mt-3">
                <div className="col-md-3">
                  <h4 className="clSearchPartTitle">Mã khóa học</h4>
                </div>
                <div className="col-md-9">
                  <input
                    type="text"
                    id="course_code"
                    className="form-control"
                    value={courseCode}
                    placeholder="Nhập tên khóa học để tìm kiếm..."
                    onChange={(e) => setCourseCode(e.target.value)}
                  />
                </div>
              </div>
              {/* Search address */}
              <div className="row mt-3">
                <div className="col-md-3">
                  <h4 className="clSearchPartTitle">Khu vực</h4>
                </div>
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <select
                        id="province"
                        defaultValue={"default"}
                        className="form-control"
                        onChange={handleProvinceChange}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Chọn tỉnh thành"
                      >
                        <option
                          disabled
                          value="default"
                          className="text-center"
                        >
                          --Chọn tỉnh thành --
                        </option>
                        {provinces ? (
                          provinces.map((province) => (
                            <option key={province.code} value={province.code}>
                              {province.name_with_type}
                            </option>
                          ))
                        ) : (
                          <option disabled>--Chọn tỉnh thành--</option>
                        )}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <select
                        id="district"
                        defaultValue={"default"}
                        className="form-control"
                        onChange={handleDistrictChange}
                      >
                        <option
                          disabled
                          value="default"
                          className="text-center"
                        >
                          --Chọn quận huyện--
                        </option>
                        {districts ? (
                          districts.map((district) => (
                            <option key={district.code} value={district.code}>
                              {district.name_with_type}
                            </option>
                          ))
                        ) : (
                          <option disabled selected>
                            --Chọn quận huyện--
                          </option>
                        )}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <select
                        id="ward"
                        defaultValue={"default"}
                        className="form-control"
                        onChange={handleWardChange}
                      >
                        <option
                          disabled
                          value="default"
                          className="text-center"
                        >
                          --Chọn phường xã--
                        </option>
                        {wards ? (
                          wards.map((ward) => (
                            <option key={ward.code} value={ward.code}>
                              {ward.name_with_type}
                            </option>
                          ))
                        ) : (
                          <option disabled selected>
                            --Chọn phường xã--
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* Search classes */}
              <div className="row mt-3">
                <div className="col-md-3">
                  <h4 className="clSearchPartTitle">Lớp</h4>
                </div>
                <div className="col-md-9">
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
                            value={item.code}
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
              {/* Search subjects */}
              <div className="row my-3">
                <div className="col-md-3">
                  <h4 className="clSearchPartTitle">Môn</h4>
                </div>
                <div className="col-md-9">
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
                            value={item.code}
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
              <hr />
              <div className="row mt-3">
                <div className="col-md-9"></div>
                <div className="col-12 col-md-3">
                  <button className="searchButton" onClick={handleSearch}>
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="clSearchResult pb-4">
        <div className="container">
          <div className="clSRContainer">
            <div className="clSRTitleContainer">
              <h4 className="clSRTitle">Kết quả tìm kiếm</h4>
              <h4 className="clSRTitleTotal">Tổng cộng: {total ? total : 0}</h4>
            </div>
            <hr />
            <div className="row mt-3">
              {list ? (
                list.map((item, index) => (
                  <div className="col-md-12" key={index}>
                    <CourseItem show={1} option={item?.course_candidates.length === 0 ? 1 : item.course_candidates.includes(user?._id) ? 2 : 1} item={item} handleClickDetails={handleClickDetails} handleClickRegister={handleClickRegister} />
                  </div>
                ))
              ) : (
                <div className="col-md-12">
                  <span className="clSRText">Không tìm thấy</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Courses;
