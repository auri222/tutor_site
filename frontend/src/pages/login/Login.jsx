import {useState, useContext} from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import ScaleLoader from "react-spinners/ScaleLoader";
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [data, setData] = useState({
    username: "",
    password: ""
  })

  const { loading, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();
  const [loadingPage, setLoadingPage] = useState(false);

  const handleChange = (event) =>
    setData({ ...data, [event.target.id]: event.target.value });

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({type: "LOGIN_START"});
    try {
      setLoadingPage(true);
      const url = "http://localhost:8000/api/auth/login";
      const response = await axios.post(url, {data: data},{
        withCredentials: true, 
        credentials: 'include',
        
      });

      if(response.data.success){
        dispatch({type: "LOGIN_SUCCESS", payload: response.data.details});
        setLoadingPage(false);
        Swal.fire({
          title: "Hoàn thành",
          text: `${response.data.message}`,
          icon: "success",
          timer: 1000
        }).then(() => {
          if(response.data.details.accountType === 'ADMIN'){
            navigate('/dashboard');
          }
          else{
            navigate('/');
          }

        });
      }
      
    } catch (error) {
      console.log(error);
      if(error.response.status === 403){
        Swal.fire({
          title: "Cảnh báo",
          text: `${error.response.data.message}`,
          icon: "warning",
          confirmButtonText: "Đi đến xác minh tài khoản",
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch({type: "LOGIN_FAILURE", payload: error.response.data});
            setLoadingPage(false);
            navigate(`/otp/${error.response.data.user}`);
          }
        });

      }else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: `${error.response.data.message}`,
        });
        dispatch({type: "LOGIN_FAILURE", payload: error.response.data});
        setLoadingPage(false);
      }
    }
  };

  return (
    <div className="login">
      {loadingPage && <div className="loader">
        <ScaleLoader 
          color="rgba(126, 208, 240, 1)" 
          loading={loadingPage}
          size={50}
          />
        <span>Đang xử lý. Hãy đợi một tí ...</span>
      </div>}
      <div className="lContainer">
        <Link to="/home" style={{ color: "inherit", textDecoration: "none" }}>
          <div className="lLogo">TutorSite</div>
        </Link>
        <h2 className="lTitle">Đăng nhập</h2>
        <form className="lForm">
          <div className="mb-3">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Nhập tên đăng nhập"
              value={data.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={data.password}
              onChange={handleChange}
              required
            />
          </div>
          {/* <div className="mb-3 text-end">
            <Link to={''}>Quên mật khẩu?</Link>
          </div> */}

          <button className="fButton" disabled={loading} type='submit' onClick={handleSubmit} >Đăng nhập</button>
          <div className="mb-3 text-center">
            Chưa có tài khoản <Link to={'/register'}>đăng ký ngay</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login