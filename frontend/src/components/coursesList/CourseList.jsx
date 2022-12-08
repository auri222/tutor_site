import "./courseList.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const loadCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/course/random");
      if (res.data) {
        setCourses(res.data.courses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleClick = (id) => {
    console.log("Click " + id);
    navigate(`/courses/details/${id}`);
  };

  const handleClickMore = () => {
    navigate(`/courses`);
  };


  return (
    <div className="container my-5">
      <h2 className="cListTitle">Các khóa học cần tìm gia sư</h2>
      <div className="cListContainer">
        {courses && courses.length > 0
          ? courses.map((item) => (
              <div className="cListItem">
                <div className="cListTitleWrapper">
                  <h4 className="cListItemTitle">{item.course_name}</h4>
                </div>
                <h5 className="cListItemTime">Môn học:  {item.course_subjects
                    ? item.course_subjects.map((subjectElem, index) => (
                        <span key={index}>
                          {index === item.course_subjects.length - 1
                            ? `${subjectElem}`
                            : `${subjectElem}, `}
                        </span>
                      ))
                    : "Không có"}</h5>
                <h5 className="cListItemSchedule">
                  Thời gian biểu: {item.course_schedule
                    ? item.course_schedule.map((scheduleElem, index) => (
                        <span key={index}>
                          {index === item.course_schedule.length - 1
                            ? `${scheduleElem}`
                            : `${scheduleElem}, `}
                        </span>
                      ))
                    : "Không có"}
                </h5>
                <h5 className="cListItemTime">Thời lượng: {item.course_time}</h5>
                <h5 className="cListItemLocation">
                  Tại: {`${item.course_address.street}, ${item.course_address.ward}, ${item.course_address.district}, ${item.course_address.province}`}
                </h5>
                <button onClick={() => {handleClick(item._id)}}>Xem chi tiết</button>
              </div>
            ))
          : "Chưa có khóa mới"}
      </div>
      <button className="cListButton" onClick={handleClickMore}>Xem thêm khóa học</button>
    </div>
  );
};

export default CourseList;
