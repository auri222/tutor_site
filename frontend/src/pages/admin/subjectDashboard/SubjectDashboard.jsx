import './subjectDashboard.css';
import React from 'react'
import { useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import { useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";


const SubjectDashboard = () => {

  const [total, setTotal] = useState(0);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/subject");
        setSubjects(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClass();
  }, []);

  useEffect(() => {setTotal(subjects.length)}, [subjects])

  return (
    <div className="subjectsDB">
    <Sidebar />
    <div className="subjectsDBContainer">
      <DashboardNav />
      <div className="subjectsDBWrapper">
        <div className="subjectsDBTitle">Dữ liệu môn học</div>
        <hr />

        <div className="subjectsDBTotal">Tổng số: {total}</div>

        <table className="table table-bordered table-responsive">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên môn học</th>
              <th scope="col">Mã viết tắt</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0
              ? subjects.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index+1}</td>
                    <td>{item.name}</td>
                    <td>{item.code}</td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-info mx-2"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="CLick để sửa"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger mx-2"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="CLick để xóa"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default SubjectDashboard