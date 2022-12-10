import { useState, useEffect } from "react";
import "./register_tutor.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";
import Swal from "sweetalert2";

const Register_tutor = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    username: "",
    birthday: new Date(),
    password: "",
    confirm_password: "",
    email: "",
    phone_number: "",
    CCCD: "",
    home_number: "",
    street: "",
    province: "",
    district: "",
    ward: "",
  });
  const [tutor, setTutor] = useState({
    tutor_name: "",
    tutor_title: "",
    tutor_occupation: "",
    tutor_workplace_name: "",
    tutor_workplace_address: "",
  });
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);

  const [schedule, setSchedule] = useState([]);
  const [subjects, setSubjects] = useState([]); //load
  const [classes, setClasses] = useState([]); //Load data classes
  const [provinces, setProvinces] = useState([]); //load
  const [districts, setDistricts] = useState([]); //load
  const [wards, setWards] = useState([]); //load
  // const [error, setError] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [CCCDImg, setCCCDImg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  // Load data when page load
  useEffect(() => {
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
        setSchedule(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClass();
    fetchSubject();
    fetchSchedule();
  }, []);

  const handleProvinceChange = (e) => {
    setAccount({
      ...account,
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
    setAccount({
      ...account,
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
    setAccount({
      ...account,
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

  const handleSelectSchedule = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedSchedule(
      checked
        ? [...selectedSchedule, value]
        : selectedSchedule.filter((item) => item !== value)
    );
  };

  const handleChangeAccount = (e) => {
    setAccount({ ...account, [e.target.id]: e.target.value });
  };

  const handleChangeTutor = (e) => {
    setTutor({ ...tutor, [e.target.id]: e.target.value });
  };

  const handleChangeProfileImg = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeCCCDImg = (e) => {
    if (e.target.files.length !== 0) {
      const files = Array.from(e.target.files || []);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setCCCDImg((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const validateForm = () => {
    let isValidate = true;
    let err = {};

    if (account.username === "") {
      isValidate = false;
      err["username"] = "Hãy nhập tên đăng nhập!";
    }
    if (account.birthday === "") {
      isValidate = false;
      err["birthday"] = "Hãy chọn ngày sinh!";
    }
    if (account.password === "") {
      isValidate = false;
      err["password"] = "Hãy nhập mật khẩu!";
    }
    if (account.password.length < 8) {
      isValidate = false;
      err["password"] = "Mật khẩu phải nhiều hơn 8 ký tự!";
    }
    if (!account.password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([\W]*).{8,}/)) {
      isValidate = false;
      err["password"] =
        "Mật khẩu phải nhiều hơn 8 ký tự, bao gồm ký tự in hoa, in thường, số, có hoặc không có ký tự đặc biệt: !@#$%^* ...!";
    }
    if (account.confirm_password === "") {
      isValidate = false;
      err["confirm_password"] = "Hãy nhập xác nhận mật khẩu!";
    }
    if (account.confirm_password !== account.password) {
      isValidate = false;
      err["confirm_password"] = "Mật khẩu và xác nhận mật khẩu không khớp!";
    }
    if (account.CCCD === "") {
      isValidate = false;
      err["CCCD"] = "Hãy nhập số CCCD!";
    }
    if (account.email === "") {
      isValidate = false;
      err["email"] = "Hãy nhập địa chỉ email!";
    }
    if (
      !account.email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      )
    ) {
      isValidate = false;
      err["email"] = "Hãy nhập địa chỉ email hợp lệ!";
    }
    if (account.phone_number === "") {
      isValidate = false;
      err["phone_number"] = "Hãy nhập số điện thoại!";
    }
    if (account.phone_number.length <= 0 || account.phone_number.length > 10) {
      isValidate = false;
      err["phone_number"] = "Hãy nhập số điện thoại hợp lệ!";
    }
    if (account.home_number === "") {
      isValidate = false;
      err["home_number"] = "Hãy nhập số nhà!";
    }
    if (account.street === "") {
      isValidate = false;
      err["street"] = "Hãy nhập tên đường!";
    }
    if (account.ward === "") {
      isValidate = false;
      err["ward"] = "Hãy chọn phường xã!";
    }
    if (account.district === "") {
      isValidate = false;
      err["district"] = "Hãy chọn quận huyện!";
    }
    if (account.province === "") {
      isValidate = false;
      err["province"] = "Hãy chọn tỉnh thành!";
    }
    if (tutor.tutor_name === "") {
      isValidate = false;
      err["name"] = "Hãy nhập họ tên!";
    }
    if (tutor.tutor_occupation === "") {
      isValidate = false;
      err["occupation"] = "Hãy nhập nghề nghiệp hiện tại!";
    }
    if (selectedClasses.length < 0) {
      isValidate = false;
      err["classes"] = "Hãy chọn lớp giảng dạy!";
    }
    if (selectedSubjects.length < 0) {
      isValidate = false;
      err["subjects"] = "Hãy chọn môn giảng dạy!";
    }
    if (selectedSchedule.length < 0) {
      isValidate = false;
      err["schedules"] = "Hãy chọn lịch giảng dạy!";
    }
    if (profileImg === "") {
      isValidate = false;
      err["profileImg"] = "Hãy chọn ảnh profile!";
    }
    if (CCCDImg.length <= 0 || CCCDImg.length <= 1) {
      isValidate = false;
      err["CCCDImg"] = "Hãy chọn 2 ảnh CCCD mặt trước và sau";
    }

    setError(err);
    return isValidate;
  };
  //Show list errors
  const errorArr = Object.keys(error).map((k, i) => (
    <li key={i}>{error[k]}</li>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        setLoading(true);
        const res = await axios.post(
          `http://localhost:8000/api/auth/register-tutor`,
          {
            account: account,
            tutor: tutor,
            classes: selectedClasses,
            subjects: selectedSubjects,
            schedule: selectedSchedule,
            profileImg: profileImg,
            CCCDImg: CCCDImg,
          }
        );
        if (res.data.success) {
          setLoading(false);
          Swal.fire({
            title: "Hoàn thành",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Đi tới xác minh tài khoản",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/otp/${res.data.account}`);
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
        setLoading(false);
      }
    }
  };

  return (
    <div className="rTutor">
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
      {/* START Bootstrạp container */}
      <div className="rContainer">
        <Link to="/home" style={{ color: "inherit", textDecoration: "none" }}>
          <div className="rTLogo">TutorSite</div>
        </Link>
        <h2 className="rTitle">Đăng ký tài khoản cho gia sư</h2>
        <form className="rTForm">
          {/* Tai khoan */}
          <div className="row ">
            <hr />
            <div className="col-md-4">
              <h4 className="fPartTitle">Tài khoản</h4>
            </div>
            <div className="col-md-8">
              <div className="mb-3">
                <label htmlFor="username">Tên đăng nhập</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  placeholder="Nhập tên đăng nhập"
                  onChange={handleChangeAccount}
                  value={account.username}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="birthday">Ngày sinh</label>
                <input
                  type="date"
                  id="birthday"
                  className="form-control"
                  required
                  value={account.birthday}
                  onChange={handleChangeAccount}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  onChange={handleChangeAccount}
                  value={account.password}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirm_password">Nhập lại mật khẩu</label>
                <input
                  type="password"
                  id="confirm_password"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  value={account.confirm_password}
                  onChange={handleChangeAccount}
                  required
                />
              </div>
            </div>
            <hr />
          </div>

          {/* Lien he */}
          <div className="row">
            <div className="col-md-4">
              <h4 className="fPartTitle">Liên hệ</h4>
            </div>
            <div className="col-md-8">
              <div className="mb-3">
                <label htmlFor="email">Địa chỉ email</label>
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  placeholder="vidu@gmail.com"
                  required
                  value={account.email}
                  onChange={handleChangeAccount}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone_number">Số điện thoại</label>
                <input
                  type="text"
                  id="phone_number"
                  className="form-control"
                  placeholder="0834759xxx"
                  required
                  value={account.phone_number}
                  onChange={handleChangeAccount}
                />
              </div>
            </div>
            <hr />
          </div>

          {/* Thong tin ca nhan */}
          <div className="row">
            <div className="col-md-4">
              <h4 className="fPartTitle">Thông tin cá nhân</h4>
            </div>
            <div className="col-md-8">
              <div className="mb-3">
                <label htmlFor="tutor_name">Họ tên</label>
                <input
                  type="text"
                  id="tutor_name"
                  className="form-control"
                  placeholder="Nhập họ tên"
                  value={tutor.tutor_name}
                  onChange={handleChangeTutor}
                  required
                />
              </div>

              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="CCCD">Số CCCD</label>
                    <input
                      type="text"
                      id="CCCD"
                      className="form-control"
                      placeholder="0834759xxx"
                      required
                      value={account.CCCD}
                      onChange={handleChangeAccount}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label htmlFor="tutor_CCCD_image">
                          Hình CCCD (2 mặt)
                        </label>
                        <input
                          type="file"
                          id="tutor_CCCD_image"
                          className="form-control"
                          required
                          multiple
                          onChange={handleChangeCCCDImg}
                        />
                      </div>
                      <div className="col-md-12">
                        {CCCDImg.length > 0 && (
                          <div className="previewCCCDImg">
                            {CCCDImg.map((item, index) => (
                              <img
                                src={item}
                                key={index}
                                alt="Ảnh CCCD"
                                className="prevItemCCCDImg"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="home_number">Số nhà</label>
                    <input
                      type="text"
                      id="home_number"
                      className="form-control"
                      placeholder="Số 123/H2"
                      value={account.home_number}
                      onChange={handleChangeAccount}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="street">Tên đường</label>
                    <input
                      type="text"
                      id="street"
                      className="form-control"
                      placeholder="Đường 3/2"
                      value={account.street}
                      onChange={handleChangeAccount}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="row">
                  <div className="col-md-4">
                    <label htmlFor="province">Tỉnh thành</label>
                    <select
                      id="province"
                      className="form-control"
                      onChange={handleProvinceChange}
                    >
                      <option selected disabled>
                        --Chọn tỉnh thành--
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
                  <div className="col-md-4">
                    <label htmlFor="district">Quận huyện</label>
                    <select
                      id="district"
                      className="form-control"
                      onChange={handleDistrictChange}
                    >
                      <option selected disabled>
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
                  <div className="col-md-4">
                    <label htmlFor="ward">Phường xã</label>
                    <select
                      id="ward"
                      className="form-control"
                      onChange={handleWardChange}
                    >
                      <option selected disabled>
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
            <hr />
          </div>

          {/* Thông tin nghề nghiệp */}
          <div className="row">
            <div className="col-md-4">
              <h4 className="fPartTitle">Thông tin về nghề nghiệp</h4>
            </div>
            <div className="col-md-8">
              {/* Ảnh profile */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="tutor_profile_image">Ảnh đại diện</label>
                    <input
                      type="file"
                      id="tutor_profile_image"
                      className="form-control"
                      onChange={handleChangeProfileImg}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    {profileImg && (
                      <div className="previewPImg">
                        <div className="prevItemPImg">
                          <img src={profileImg} alt="Ảnh hồ sơ" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Công việc và chức danh */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="tutor_occupation">Công việc hiện tại</label>
                    <input
                      type="text"
                      id="tutor_occupation"
                      className="form-control"
                      placeholder="Giáo viên/sinh viên ..."
                      value={tutor.tutor_occupation}
                      onChange={handleChangeTutor}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="tutor_title">Chức danh (nếu có)</label>
                    <input
                      type="text"
                      id="tutor_title"
                      className="form-control"
                      placeholder="Ghi hoặc bỏ trống"
                      value={tutor.tutor_title}
                      onChange={handleChangeTutor}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Nơi làm việc và địa chỉ */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="tutor_workplace_name">
                      Tên nơi làm việc
                    </label>
                    <input
                      type="text"
                      id="tutor_workplace_name"
                      className="form-control"
                      placeholder="Nhập tên nơi làm việc hiện tại"
                      onChange={handleChangeTutor}
                      value={tutor.tutor_workplace_name}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="tutor_workplace_address">
                      Địa chỉ nơi làm việc
                    </label>
                    <input
                      type="text"
                      id="tutor_workplace_address"
                      className="form-control"
                      placeholder="Nhập địa chỉ nơi làm việc hiện tại"
                      onChange={handleChangeTutor}
                      value={tutor.tutor_workplace_address}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Lớp giảng dạy */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-12">
                    <label htmlFor="classes">Lớp giảng dạy</label> <br />
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

              {/* Môn giảng dạy */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-12">
                    <label htmlFor="subjects">Môn giảng dạy</label> <br />
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
                              onChange={handleSelectSchedule}
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

              {/* Lịch giảng dạy */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-12">
                    <label htmlFor="schedule">Lịch giảng dạy</label> <br />
                    {schedule ? (
                      <>
                        {schedule.map((item) => (
                          <div
                            id="schedule"
                            key={item._id}
                            className="form-check form-check-inline"
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={handleSelectSubjects}
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
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-8">
              <div className="mb-3">
                {Object.keys(error).length !== 0 ? (
                  <div className="mb-3">
                    <div className="alert alert-warning mb-3" role="alert">
                      {errorArr}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <button className="fButton" type="submit" onClick={handleSubmit}>
            Đăng ký
          </button>
        </form>
      </div>
      {/* END Bootstrạp container */}
    </div>
  );
};

export default Register_tutor;
