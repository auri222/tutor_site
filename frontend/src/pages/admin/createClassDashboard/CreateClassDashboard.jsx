import "./createClassDashboard.css";
import React from "react";
import { useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CreateClassDashboard = () => {
  const [data, setData] = useState({
    name: "",
    code: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({...data, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(data.name !== "" && data.code !== ""){
        const res = await axios.post('http://localhost:8000/api/class/create', {data: data}, {withCredentials:true});
        if(res.data.success){
          Swal.fire({
            title: "Hoàn thành",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Xong",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/dashboard/class`, {
                replace: true,
              }); //replace: true => cannot going back to this page
            }
          });
        }
      }
      
    } catch (error) {
      if (!error.response.data.success) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "" + error.response.data.message,
        });
      }
    }
  }
  

  return (
    <div className="classesDB">
      <Sidebar />
      <div className="classesDBContainer">
        <DashboardNav />
        <div className="classesDBWrapper">
          <div className="classesDBTitle">Thêm dữ liệu lớp học</div>
          <hr />
          <div className="classesDBForm">
            <form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="name">Tên lớp học</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Lớp toán"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                <label htmlFor="code">Mã lớp học</label>
                  <input
                    type="text"
                    id="code"
                    className="form-control"
                    placeholder="Lớp 1 - L1"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
              
                <button className="btnCreateClassDB" type="submit" onClick={handleSubmit}>Thêm dữ liệu</button>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClassDashboard;
