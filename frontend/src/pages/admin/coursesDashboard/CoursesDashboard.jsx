import "./coursesDashboard.css";
import { useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import { useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


const CoursesDashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [courses, setCourses] = useState([]);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const limit = 8;

  const loadCourses = async (skip, limit, search, isLoadMore) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/course/all?course_code=${search}&skip=${skip}&limit=${limit}`
      );
      if (res.data) {
        setTotal(res.data.total);
        setSkip(res.data.skip);
        setIsLoadMore(res.data.isLoadMore);
        if (isLoadMore) {
          setCourses([...courses, ...res.data.coursesList]);
        } else {
          setCourses(res.data.coursesList);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCourses(skip, limit, search, false);
  }, []);

  const handleSearch = () => {
    loadCourses(skip, limit, search, false);
  };

  const handleLoadMore = () => {
    let newSkip = skip + limit;
    loadCourses(newSkip, limit, search, true);
  };

  const handleClick = (id) => {
    console.log("Xem " + id);
    navigate(`/dashboard/course/details/${id}`);
  };

  return (
    <div className="coursesDB">
      <Sidebar />
      <div className="coursesDBContainer">
        <DashboardNav />
        <div className="coursesDBWrapper">
          <div className="coursesDBTitle">Danh sách khóa học</div>
          <hr />
          <div className="coursesDBSearch">
            <div className="coursesDBTotal">Tổng số: {total}</div>
            <div className="coursesDBSearchOption">
              <input
                type="text"
                id="search"
                className="coursesDBSearchUsernameInput"
                placeholder="Tìm kiếm tên mã khóa học"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
          <table className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th scope="col">Mã khóa</th>
                <th scope="col">Chủ khóa học</th>
                <th scope="col">Tên khóa học</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Loại khóa học</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0
                ? courses.map((item) => (
                    <tr key={item._id}>
                      <td>{item.course_code}</td>
                      <td>{item.account.username}</td>
                      <td>{item.course_name}</td>
                      <td>
                        {item.course_status === 0 ? (
                          <span className="badge text-bg-success">
                            Chưa tìm được gia sư
                          </span>
                        ) : item.course_status === 2 ? (
                          <span className="badge text-bg-secondary">
                            Khóa đã đóng (tìm được gia sư)
                          </span>
                        ) : (
                          <span className="badge text-bg-warning">
                            Đợi gia sư đồng ý
                          </span>
                        )}
                      </td>
                      <td>
                        {item.course_purpose === 1 ? (
                          <span>Công khai</span>
                        ) : (
                          <span>Không công khai</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-info mx-auto d-block"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="CLick để xem chi tiết"
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
          <div className="coursesDBLoadMore">
            { isLoadMore && (
                  <button className="btnLoadMore" onClick={handleLoadMore}>
                    Tải thêm ...
                  </button>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesDashboard;
