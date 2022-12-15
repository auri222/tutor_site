import "./editPassword.css";
import { useContext, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditPassword = () => {
  const { id } = useParams();
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState({});

  const handleChange = (e) => {

    setData({
      ...data, 
      [e.target.id]: e.target.value
    });
  }

  const validateForm = () => {
    let isValid = true;
    let err = {};
    //old pw
    if(data['oldPassword'] === ""){
      isValid = false;
      err['oldPassword'] = "Hãy nhập mật khẩu cũ.";
    }
    //new pw
    if(data['newPassword'] === ""){
      isValid = false;
      err['newPassword'] = "Hãy nhập mật khẩu mới.";
    }

    if(data['newPassword'].length < 8){
      isValid = false;
      err['newPassword'] = "Mật khẩu phải nhiều hơn 8 ký tự";
    }

    if(!data['newPassword'].match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([\W]*).{8,}/)){
      isValid = false;
      err['newPassword'] = "Mật khẩu phải nhiều hơn 8 ký tự, bao gồm ký tự in hoa, in thường, số, có hoặc không có ký tự đặc biệt: !@#$%^* ...";
    }

    //confirm pw
    if(data['confirmPassword'] === ""){
      isValid = false;
      err['confirmPassword'] = "Hãy nhập xác nhận mật khẩu.";
    }
    if(data['confirmPassword'] !== data['newPassword']){
      isValid = false;
      err['confirmPassword'] = "Mật khẩu mới và xác nhận mật khẩu không khớp.";
    }
    setError(err);

    return isValid;

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(validateForm()){
        const res = await axios.put(`http://localhost:8000/api/account/edit/password/${user._id}`, {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        }, {withCredentials:true});

        if(res.data.success){
          Swal.fire({
            title: "Hoàn thành",
            text: `${res.data.message}. Hãy đăng nhập lại để kiểm tra!`,
            icon: "success",
            confirmButtonText: "Đăng nhập lại",
          }).then((result) => {
            if (result.isConfirmed) {
              axios.get(`http://localhost:8000/api/auth/logOut/${user._id}`).then((res) => {
                if(res.data){
                  dispatch({type: "LOGOUT"});
                  localStorage.setItem("user", null);
                  navigate('/login', { replace: true });
                }
              })
            }
          });
        }
      }

    } catch (error) {
      console.log(error)
      if(!error.response.data.success){
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: ''+error.response.data.message,
        })
      }
    }
  }

  const errorArr = Object.keys(error).map((k, i) => (
    <li key={i}>
      {error[k]}
    </li>
  ))

  return (
    <>
      <Navbar />
      <section className="editPWContainer">
        <div className="container">
          <div className="editPWWrapper">
            <h2 className="editPWTitle">Sửa mật khẩu</h2>
            <hr />
            {id === user._id ? (
              <form className="editPWForm">
                <div className="row">
                  <div className="col-md-4">
                    <h4 className="fPartTitle">Mật khẩu cũ</h4>
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="username">Mật khẩu cũ</label>
                      <input
                        type="password"
                        id="oldPassword"
                        className="form-control"
                        placeholder="Nhập mật khẩu cũ"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <h4 className="fPartTitle">Mật khẩu mới</h4>
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="newPassword">Mật khẩu mới</label>
                      <input
                        type="password"
                        id="newPassword"
                        className="form-control"
                        placeholder="Nhập mật khẩu mới"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        placeholder="Nhập lại mật khẩu mới để xác nhận"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                {Object.keys(error).length !== 0? (
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-8">
                      <div className="mb-3">

                      <div className="alert alert-warning mb-3" role="alert">
                        {errorArr}
                      </div>
                      </div>
                    </div>
                  </div>
                ) : ""}
                <button
                  className="fButton"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Sửa mật khẩu
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

export default EditPassword;
