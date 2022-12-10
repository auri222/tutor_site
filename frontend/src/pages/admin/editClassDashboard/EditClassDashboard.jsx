import './editClassDashboard.css';
import { useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from 'react';

const EditClassDashboard = () => {
  const [loadData, setLoadData] = useState([]);
  const [data, setData] = useState({
    name: "",
    code: "",
  });
  const {id} = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState({});

  useEffect(() => {
    const loadClass = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/class/${id}`,
          { withCredentials: true }
        );
        if(res.data){
          setLoadData(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadClass();

  }, [id]);

  useEffect(() => {
    if(loadData){
      setData((prev) => ({
        ...prev,
        name: loadData?.name || "",
        code: loadData?.code || ""
      }))
    }
  }, [loadData])

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let isValidate = true;
    let err = {};

    if (data.name === "") {
      isValidate = false;
      err["name"] = "Hãy nhập tên lớp!";
    }

    if (data.name.startsWith("Lớp") === false) {
      isValidate = false;
      err["name"] = "Hãy nhập tên lớp bắt đầu bằng từ Lớp!";
    }

    if (data.code === "") {
      isValidate = false;
      err["code"] = "Hãy nhập mã lớp!";
    }

    if (data.code.startsWith("L") === false) {
      isValidate = false;
      err["code"] = "Hãy nhập mã lớp bắt đầu bằng từ L!";
    }

    setError(err);
    return isValidate;
  };

  //Show list errors
  const errorArr = Object.keys(error).map((k, i) => (
    <li key={i}>{error[k]}</li>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        const res = await axios.put(
          `http://localhost:8000/api/class/edit/${id}`,
          { data: data },
          { withCredentials: true }
        );
        if (res.data.success) {
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
  };

  return (
    <div className="editClassesDB">
      <Sidebar />
      <div className="editClassesDBContainer">
        <DashboardNav />
        <div className="editClassesDBWrapper">
          <div className="editClassesDBTitle">Sửa dữ liệu lớp học</div>

          <div className="editClassesDBForm">
            <form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="name">Tên lớp học</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Lớp toán"
                    value={data.name || ""}
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
                    value={data.code || ""}
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  {Object.keys(error).length !== 0 ? (
                      <div className="alert alert-warning mb-3" role="alert">
                        {errorArr}
                      </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <button
                className="btnEditClassDB"
                type="submit"
                onClick={handleSubmit}
              >
                Sửa dữ liệu
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditClassDashboard