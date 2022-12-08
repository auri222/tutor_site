import { useState } from "react";
import "./notificationItem.css";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const NotificationItem = ({ info }) => {
  const [show, setShow] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    if(isUpdate){
      navigate(0);
    }
  }
  const handleShow = async () => {
    setShow(true);
    try {
      if(!info.isRead){
        const res = await axios.put(`http://localhost:8000/api/notification/update/${info._id}`, {withCredentials:true});
        if(res.data.success){
          console.log('Update notification successfully');
          setIsUpdate(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreatedDate = (date) => {
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
    <>
      <div
        className="notificationWrapper mb-3"
        onClick={handleShow}
      >
        <div className="notificationDate">
          {handleCreatedDate(info.createdAt)} 
          {!info.isRead ? (
            <span className="badge rounded-pill text-bg-primary ms-2 notificationStatus">Thông báo mới</span>
          ) : (
            <span className="badge rounded-pill text-bg-secondary ms-2 notificationStatus">Đã xem</span>
          )}
        </div>
        <div className="notificationContent">{info.message}</div>
        <div className="notificationLink">
          {info.type === "SYSTEM" ? (
            ""
          ) : info.type === "COURSE" ? (
            <Link to={`/courses/details/${info.typeID}`}>
              Click để chuyển đến khóa học
            </Link>
          ) : info.type === "COMMENT" ? (
            <Link to={``} />
          ) : (
            ""
          )}
          {/* <Link to={info.type === 'C'} /> */}
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {info.message} <br />
          {info.type === "SYSTEM" ? (
            ""
          ) : info.type === "COURSE" ? (
            <Link to={`/courses/details/${info.typeID}`}>
              Click để chuyển đến khóa học
            </Link>
          ) : info.type === "COMMENT" ? (
            <Link to={``} />
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NotificationItem;
