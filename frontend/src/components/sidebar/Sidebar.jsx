import "./sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Sidebar = () => {
  const {user, dispatch} = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/auth/logOut/${user?._id}`);
      if(res.data.success){
        dispatch({type: "LOGOUT"});
        localStorage.setItem("user", null);
        navigate('/', { replace: true });
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="sidebarContainer">
      <div className="top">
        <span className="logo">TutorSite</span>
      </div>

      <div className="center">
        <ul>
          <p className="title">Trang tổng hợp</p>
          <Link to={'/dashboard'}>
            <li>
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="title">Quản lý</p>
          <Link to={'/dashboard/account'}>
            <li>
              <span>Quản lý tài khoản</span>
            </li>
          </Link>
          <Link to={'/dashboard/course'}>
            <li>
              <span>Danh sách khóa học</span>
            </li>
          </Link>
          <Link to={'/dashboard/class'}>
            <li>
              <span>Quản lý lớp học</span>
            </li>
          </Link>
          <Link to={'/dashboard/subject'}>
            <li>
              <span>Quản lý môn học</span>
            </li>
          </Link>
          <Link to={`/dashboard/notification`}>
            <li>
              <span>Thông báo</span>
            </li>
          </Link>
          <p className="title">Tài khoản</p>
          <Link to={`/dashboard/profile/${user?._id}`}>
            <li>
              <span>Thông tin cá nhân</span>
            </li>
          </Link>
          <li>
            <span onClick={handleLogout}>Đăng xuất</span>
          </li>
        </ul>
      </div>
      {/* <div className="bottom">
        <div className="colorOption"></div>
        <div className="colorOption"></div>
      </div> */}
    </div>
  );
};

export default Sidebar;
