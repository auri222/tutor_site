import "./dashboardNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashboardNav = () => {
  const {user} = useContext(AuthContext);
  const [countNotify, setCountNotify] = useState(0);
  const navigate = useNavigate();
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
    navigate('/dashboard/notification');
  }

  return (
    <div className="dashboardNav">
      <div className="wrapper">
        <div className="items">
          <div className="item" onClick={handleClickBell}>
            <FontAwesomeIcon icon={faBell} />
            {countNotify !== 0 ? (
              <div className="counter">{countNotify}</div>
            ) : ""}
            
          </div>
          <div className="item">
            <span className="dbNavTitle">Xin chào {user?.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;
