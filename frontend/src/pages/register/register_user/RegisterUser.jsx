import { useState, useEffect } from "react";
import "./register_user.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";
import Swal from "sweetalert2";

const Register_user = () => {
  const [data, setData] = useState({
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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) =>
    setData({ ...data, [event.target.id]: event.target.value });

  // Fetch province data
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
  }, []);

  const handleProvinceChange = (e) => {
    setData({
      ...data,
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
    setData({
      ...data,
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
    setData({
      ...data,
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text,
    });
  };

  const validateForm = () => {
    let isValidate = true;
    let err = {};

    if (data.username === "") {
      isValidate = false;
      err["username"] = "Hãy nhập tên đăng nhập!";
    }
    if (data.birthday === "") {
      isValidate = false;
      err["birthday"] = "Hãy chọn ngày sinh!";
    }
    if (data.CCCD === "") {
      isValidate = false;
      err["CCCD"] = "Hãy nhập số CCCD!";
    }
    if (data.email === "") {
      isValidate = false;
      err["email"] = "Hãy nhập địa chỉ email!";
    }
    if (
      !data.email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      )
    ) {
      isValidate = false;
      err["email"] = "Hãy nhập địa chỉ email hợp lệ!";
    }
    if (data.phone_number === "") {
      isValidate = false;
      err["phone_number"] = "Hãy nhập số điện thoại!";
    }
    if (data.phone_number.length <= 0 || data.phone_number.length > 10) {
      isValidate = false;
      err["phone_number"] = "Hãy nhập số điện thoại hợp lệ!";
    }
    if (data.home_number === "") {
      isValidate = false;
      err["home_number"] = "Hãy nhập số nhà!";
    }
    if (data.street === "") {
      isValidate = false;
      err["street"] = "Hãy nhập tên đường!";
    }
    if (data.ward === "") {
      isValidate = false;
      err["ward"] = "Hãy chọn phường xã!";
    }
    if (data.district === "") {
      isValidate = false;
      err["district"] = "Hãy chọn quận huyện!";
    }
    if (data.province === "") {
      isValidate = false;
      err["province"] = "Hãy chọn tỉnh thành!";
    }

    setError(err);
    return isValidate;
  };
  //Show list errors
  const errorArr = Object.keys(error).map((k, i) => (
    <li key={i}>{error[k]}</li>
  ));

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (validateForm()) {
        setLoading(true);
        const url = "http://localhost:8000/api/auth/register-user";
        const res = await axios.post(url, data);
        if (res.data.success) {
          setLoading(false);
          Swal.fire({
            title: "Hoàn thành",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Đi tới xác thực tài khoản",
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
      }
    }
  };

  return (
    <div className="rUser">
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
      <div className="rUContainer">
        <Link to="/home" style={{ color: "inherit", textDecoration: "none" }}>
          <div className="rULogo">TutorSite</div>
        </Link>
        <h2 className="rUTitle">Đăng ký tài khoản cho phụ huynh học sinh</h2>
        <form className="rUForm">
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
                  value={data.username}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="birthday">Ngày sinh</label>
                <input
                  type="date"
                  id="birthday"
                  className="form-control"
                  value={data.birthday}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  value={data.password}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirm_password">Nhập lại mật khẩu</label>
                <input
                  type="password"
                  id="confirm_password"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  value={data.confirm_password}
                  required
                  onChange={handleChange}
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
                  value={data.email}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone_number">Số điện thoại</label>
                <input
                  type="text"
                  id="phone_number"
                  className="form-control"
                  placeholder="0834759xxx"
                  value={data.phone_number}
                  onChange={handleChange}
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
                <label htmlFor="CCCD">Số CCCD</label>
                <input
                  type="text"
                  id="CCCD"
                  className="form-control"
                  placeholder="0834759xxx"
                  value={data.CCCD}
                  required
                  onChange={handleChange}
                />
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
                      value={data.home_number}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="street">Tên đường</label>
                    <input
                      type="text"
                      id="street"
                      className="form-control"
                      placeholder="Đường 3/2"
                      value={data.street}
                      onChange={handleChange}
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
            <hr />
          </div>

          <button className="fButton" type="submit" onClick={handleSubmit}>
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register_user;
