import { useContext, useState, useEffect } from "react";
import './notification.css';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import NotificationItem from "../../components/notificationItem/NotificationItem";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Notification = () => {
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


  return (
    <>
      <Navbar />
      <section className="notificationContainer">
        <div className="container">
          <div className="nWrapper">
            <h2 className="nTitle">Thông báo ({total})</h2>
            <hr />
            <div className="row mb-3">
              <div className="col-md-12">
                {notification.length > 0 ? (
                  notification.map((item) => (
                    <NotificationItem key={item._id} info={item} setShow={setShow} show={show} handleClose={handleClose} handleShow={handleShow}/>
                  ))
                ) : "Không có thông báo mới nào"}
              </div>
            </div>
            <div className="row mb-3">
            { isLoadMore && (
              <button className="btnLoadMore" onClick={handleLoadMore}>
                Tải thêm ...
              </button>
            )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Notification
