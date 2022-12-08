import "./intro.css";
import Background from "../../assets/imgs/pexels-katie-goertzen-4491550.jpg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="intro-container">
      <img src={Background} alt="" />
      <div className="intro-wrapper">
        <h2 className="i-intro">Học tập ngay tại nhà với</h2>
        <h2 className="i-name">TutorSite</h2>
        <div className="i-desc">
          Chúng tôi cung cấp dịch vụ tìm và thuê gia sư. Ngoài ra, chúng tôi còn
          cung cấp dịch vụ cho gia sư cần tìm việc làm trên hệ thống của
          TutorSite.
        </div>
        <button className="i-btn">
          <Link to="/register" style={{color: "inherit", textDecoration: "none"}}>
            Đăng ký ngay
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Header;
