import "./introReason.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseCircleCheck,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const IntroReason = () => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);

  const goToCourseList = () => {
    navigate('/courses');
  }

  const goToTutorList = () => {
    navigate('/tutors');
  }

  const clickCreateCourse = () => {
    if(user !== null){
      navigate('/courses/create');
    }
    else{
      Swal.fire({
        title: 'Cảnh báo nhẹ',
        text: "Bạn cần đăng nhập để tạo khóa học!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đăng nhập ngay',
        cancelButtonText: 'Đóng'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      })
    }
  }

  return (
    <div className="container my-5 py-5">
      <div className="ir-container">
        <div className="ir-left">
          <div className="ir-left-bg"></div>
          <h2 className="ir-left-title">Tại sao chọn chúng tôi?</h2>
        </div>
        <div className="ir-right">
          <div className="ir-1">
            <div className="ir-title-container">
              <FontAwesomeIcon icon={faHouseCircleCheck} className="ir-icon" />
              <span className="ir-title">Phụ huynh học sinh</span>
            </div>

            <p className="ir-content">
              Bạn có thể <span className="ir-highlight">tạo ra khóa học</span> phù hợp với yêu cầu của mình, <span className="ir-highlight">tự do lựa chọn giờ học và số
              buổi trong tuần</span>. Ngoài ra, bạn cũng có thể <span className="ir-highlight">tìm kiếm gia sư</span> gần nơi mình sống, với lịch trình phù hợp với bản thân.
            </p>
            <div className="ir-button-container">
              <button className="ir-button" onClick={clickCreateCourse} data-bs-toggle="tooltip" data-bs-placement="top" title="Hãy đăng nhập để TẠO KHÓA HỌC">Tạo khóa học</button>
              <button className="ir-button" onClick={goToTutorList}>Tìm gia sư</button>
            </div>
          </div>
          <div className="ir-2">
            <div className="ir-title-container">
              <FontAwesomeIcon
                icon={faBriefcase}
                className="ir-icon"
                size="2xl"
              />
              <span className="ir-title">Gia sư</span>
            </div>

            <p className="ir-content">
              Là gia sư, bạn có thể <span className="ir-highlight" data-bs-toggle="tooltip" data-bs-placement="top" title="Sau khi đăng ký, bạn có thể thêm thông tin thành tích ở trang tài khoản của bạn">đăng thông tin giảng dạy, thành tích và lịch
              trình</span> theo ý của bạn. Ngoài ra, bạn có thể <span className="ir-highlight">ghi danh</span> vào các lớp
              đang tìm gia sư được đăng trên hệ thống.
            </p>
            <div className="ir-button-container">
              <button className="ir-button" onClick={goToCourseList}>Tìm khóa học</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroReason;
