import './notificationDB.css';
import { useState, useContext } from "react";
import { AuthContext } from '../../../context/AuthContext';
import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import { useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const NotificationDB = () => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [notification, setNotification] = useState([]);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [skip, setSkip] = useState(0);
  const limit = 5;
  const [isLoadMore, setIsLoadMore] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const loadNotification = async (user, skip, limit, isLoadMore) => {
    try {
      if (user !== null) {
        const res = await axios.get(
          `http://localhost:8000/api/notification?accountID=${user}&skip=${skip}&limit=${limit}`,
          { withCredentials: true }
        );
        if (res.data) {
          setIsLoadMore(res.data.isLoadMore);
          setSkip(res.data.skip);
          setTotal(res.data.total);
          if(isLoadMore){
            setNotification([...notification, ...res.data.notification]);
          }
          else{
            setNotification(res.data.notification);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadNotification( user?._id,skip, limit, false);

  }, []);

  const handleLoadMore = () => {
    let newSkip = skip + limit;
    loadNotification(user?._id, newSkip, limit, true);
  };

  const handleClick = async (id) => {
    try {
        const res = await axios.put(`http://localhost:8000/api/notification/update/${id}`, {withCredentials:true});
        if(res.data.success){
          console.log('Update notification successfully');
          navigate(0);
        }

    } catch (error) {
      console.log(error);
    }
  };

  const showCreatedDate = (date) => {
    let d = new Date(date);
    return `${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:${
      d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
    }:${d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds()} ${
      d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()
    }/${
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    }/${d.getFullYear()}`;
  };

  return (
    <div className="notificationsDB">
      <Sidebar />
      <div className="notificationsDBContainer">
        <DashboardNav />
        <div className="notificationsDBWrapper">
          <div className="notificationsDBTitle">Thông báo</div>
          <hr />
          <div className="notificationsDBSearch">
            <div className="notificationsDBTotal">Tổng số: {total}</div>
          </div>
          <table className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Nội dung thông báo</th>
                <th scope="col">Lúc</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {notification.length > 0
                ? notification.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index +1}</td>
                      <td>{item.message}</td>
                      <td>{showCreatedDate(item.createdAt)}</td>
                      
                      <td>
                        {item.isRead ? (
                          <span className='badge text-bg-success'>Đã xem</span>
                        ) : (
                          <span className='badge text-bg-secondary'>Chưa xem</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-info mx-auto d-block"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="CLick để cập nhật trạng thái"
                          disabled={item.isRead}
                          onClick={() => {
                            handleClick(item._id);
                          }}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </table>
          <div className="notificationsDBLoadMore">
            { isLoadMore && (
                  <button className="btnLoadMore" onClick={handleLoadMore}>
                    Tải thêm ...
                  </button>
                )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationDB