import "./tutorsList.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const TutorsList = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);

  const loadTutors = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/tutors/random");
      if (res.data) {
        setTutors(res.data.tutors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTutors();
  }, []);

  const handleClick = (id) => {
    console.log("Click " + id);
    navigate(`/profile/${id}`);
  };

  return (
    <div className="container my-5">
      <h2 className="tListTitle">Danh sách giảng viên</h2>
      <div className="tList-container">
        {tutors && tutors.length > 0
          ? tutors.map((item) => (
              <div className="tList-item" key={item._id} onClick={() => {
                handleClick(item?.account);
              }}>
                <img
                  src={item?.tutor_profile_image}
                  alt={`Ảnh profile ${item?.tutor_name}`}
                  className="tListImg"
                />
                <div className="tListTitles">
                  <h4>{item?.tutor_name}</h4>
                  <h5>Đang là {item?.tutor_occupation}</h5>
                  <h5>Làm việc tại/học tập {item?.tutor_workplace_name}</h5>
                  <button
                    type="button"
                    className="buttonTlist"
                    onClick={() => {
                      handleClick(item?.account);
                    }}
                  >
                    Xem thêm
                  </button>
                </div>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default TutorsList;
