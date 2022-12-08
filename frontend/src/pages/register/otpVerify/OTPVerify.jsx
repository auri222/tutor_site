import {useState, useEffect} from "react";
import "./otp.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ScaleLoader from 'react-spinners/ScaleLoader';
import Swal from 'sweetalert2';

const OTPVerify = () => {
  const navigate = useNavigate();
  const {id} = useParams();

  const [data, setData] = useState({
    otp: ""
  });
  const [loading, setLoading] = useState(false);
  const [isUser, setIsUser] = useState(false);

  const handleChange = (e) => {
    setData({...data, [e.target.id]: e.target.value});
  }

  useEffect(() => {
    const verifyUser = async (id) => {
      try {
        const res = await axios.get(`http://localhost:8000/api/auth/user/${id}`);
        if(res.data.success){
          setIsUser(res.data.success);
          Swal.fire("Chúng tôi đã gửi mã OTP vào email mà bạn cung cấp. Hãy nhập mã vào ô để xác nhận.");
        }
        
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: `${error.response.data.message}`,
          confirmButtonText: "Thoát"
        }).then((result)=> {
          if(result.isConfirmed){
            navigate('/login');
          }
        })
      }
    }
    verifyUser(id);
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:8000/api/auth/otp/${id}`, data);
      if(res.data.success){
        setLoading(false);
        Swal.fire({
          title: "Hoàn thành",
          text: `${res.data.message}`,
          icon: "success",
          confirmButtonText: "Đi tới đăng nhập",
        }).then((result) => {
          if(result.isConfirmed){
            navigate(`/login`);
          }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: `${error.response.data.message}`,
      })
      setLoading(false);
    }
  }

  return (
    <div className="otp">
      {loading && <div className="loader">
        <ScaleLoader 
          color="rgba(126, 208, 240, 1)" 
          loading={loading}
          size={50}
          />
        <span>Đang xử lý. Hãy đợi một tí ...</span>
      </div>}
      <div className="otpContainer">
        <Link to="/home" style={{ color: "inherit", textDecoration: "none" }}>
          <div className="oLogo">TutorSite</div>
        </Link>
        <h2 className="oTitle">Xác minh tài khoản</h2>
        <form className="oForm">
          <div className="mb-3">
            <input
              type="text"
              id="otp"
              className="form-control"
              placeholder="Nhập mã OTP"
              value={data.otp}
              onChange={handleChange}
              required
            />
          </div>
          <button className="fButton" disabled={!isUser} onClick={handleSubmit}>Xác nhận</button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerify;
