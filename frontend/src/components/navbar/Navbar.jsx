import "./navbar.css";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faCaretDown,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import Dropdown from "../dropdown/Dropdown";
import { useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false); //dropdown
  const [dropdownMobile, setDropdownMobile] = useState(false);
  // const [notifyMobile, setNotifyMobile] = useState(false);

  const [countNotify, setCountNotify] = useState(0);
  const handleClick = () => setClick(!click);

  const closeMobileMenu = () => setClick(false);

  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
      setDropdownMobile(true);
    } else {
      setDropdown(true);
      setDropdownMobile(false);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
      setDropdownMobile(false);
    } else {
      setDropdown(false);
      setDropdownMobile(false);
    }
  };

  useEffect(() => {
    const loadNotificationTotal = async () => {
      try {
        if (user !== null) {
          const res = await axios.get(
            `http://localhost:8000/api/notification/total/${user?._id}`,
            { withCredentials: true }
          );
          if (res.data) {
            // console.log(res.data);
            setCountNotify(res.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadNotificationTotal();
  }, [user]);

  const handleClickBell = () => {
    navigate('/notification');
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          TutorSite
        </Link>
        <div className="menu-icon " onClick={handleClick}>
          {user !== null && (
            <>
            <FontAwesomeIcon icon={faBell} onClick={handleClickBell}/>
            {countNotify > 0? (
              <span className="badge rounded-pill bg-danger mobileNotification border border-light rounded-circle">
                {countNotify}
              </span>
            ): ""}
            </>
          )}
          <FontAwesomeIcon icon={click ? faXmark : faBars} style={{ marginLeft: "1.5rem" }}  />
        </div>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-items" onClick={closeMobileMenu}>
            <Link to="/" className="nav-links">
              Trang chủ
            </Link>
          </li>
          <li className="nav-items">
            <Link to="/tutors" className="nav-links" onClick={closeMobileMenu}>
              Gia sư
            </Link>
          </li>
          <li className="nav-items">
            <Link to="/courses" className="nav-links" onClick={closeMobileMenu}>
              Khóa học
            </Link>
          </li>
          <li className="nav-items">
            <Link to="/contact" className="nav-links" onClick={closeMobileMenu}>
              Liên hệ
            </Link>
          </li>
          {user !== null && (
            <>
              <li className="nav-items bellWrapper ">
                <FontAwesomeIcon
                  icon={faBell}
                  className="bellIcon"
                  onClick={handleClickBell}
                />
                <span className="badge rounded-pill bg-danger notificationCount">
                  {countNotify > 0? countNotify : ""}
                </span>
              </li>
              <li
                className="nav-items nav-subItems"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                <Link to="#" className="nav-links" onClick={closeMobileMenu}>
                  {user?.username}{" "}
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    onClick={closeMobileMenu}
                  />
                </Link>
                {dropdown && (
                  <Dropdown data={user?._id} type={user?.accountType} />
                )}
                {dropdownMobile && (
                  <Dropdown
                    data={user?._id}
                    type={user?.accountType}
                    closeMobileMenu={closeMobileMenu}
                  />
                )}
              </li>
            </>
          )}
          {user === null && (
            <>
              <li className="nav-items" onClick={closeMobileMenu}>
                <Link to="/login" className="nav-links-mobile">
                  Đăng nhập
                </Link>
              </li>
              <li className="nav-items" onClick={closeMobileMenu}>
                <Link to="/register" className="nav-links-mobile">
                  Đăng ký
                </Link>
              </li>
            </>
          )}
        </ul>
        {user === null && (
          <div className="navBtn">
            <Link to="/login" onClick={closeMobileMenu}>
              <button
                className="btn btn-bright"
                style={{ marginRight: "10px" }}
              >
                Đăng nhập
              </button>
            </Link>
            <Link to="/register" onClick={closeMobileMenu}>
              <button className="btn btn-bright">Đăng ký</button>
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
