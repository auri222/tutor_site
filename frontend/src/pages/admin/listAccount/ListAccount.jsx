import "./listAccount.css";
import { useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import AccountTable from "../../../components/admin/accountTable/AccountTable";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ScaleLoader from "react-spinners/ScaleLoader";

const ListAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClickDetails = (id) => {
    navigate(`/dashboard/account/details/${id}`);
  };

  const handleLock = async (id) => {
    console.log("Lock " + id);
    try {
      const confirm = await Swal.fire({
        title: "Cảnh báo",
        text: `Bạn có muốn khóa tài khoản này?`,
        icon: "warning",
        confirmButtonText: "Chắc chắn",
        cancelButtonText: "Đóng",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });

      if (confirm && confirm.isConfirmed) {
        const res = await axios.put(
          `http://localhost:8000/api/account/lock/${id}`,
          {},
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
              navigate(0);
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

  const handleUnlock = async (id) => {
    console.log("Unlock " + id);
    try {
      const confirm = await Swal.fire({
        title: "Cảnh báo",
        text: `Bạn có muốn mở khóa tài khoản này?`,
        icon: "warning",
        confirmButtonText: "Chắc chắn",
        cancelButtonText: "Đóng",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (confirm && confirm.isConfirmed) {
        const res = await axios.put(
          `http://localhost:8000/api/account/unlock/${id}`,
          {},
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
              navigate(0);
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

  const handleDelete = async (id) => {
    console.log("Delete " + id);
    try {
      const confirm = await Swal.fire({
        title: "Cảnh báo",
        text: `Bạn có chắc muốn xóa tài khoản này?`,
        icon: "warning",
        confirmButtonText: "Chắc chắn",
        cancelButtonText: "Đóng",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });
      if (confirm && confirm.isConfirmed) {
        setLoading(true);
        const res = await axios.delete(
          `http://localhost:8000/api/account/delete/${id}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setLoading(false);
          Swal.fire({
            title: "Hoàn thành",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Xong",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(0);
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
        setLoading(false);
      }
    }
  };

  return (
    <div className="listAccount">
      <Sidebar />
      <div className="listAccountContainer">
        <DashboardNav />
        <AccountTable
          handleLock={handleLock}
          handleUnlock={handleUnlock}
          handleDelete={handleDelete}
          handleClickDetails={handleClickDetails}
        />
      </div>
      {loading && (
        <div className="loader">
          <ScaleLoader
            color="rgba(126, 208, 240, 1)"
            loading={loading}
            size={50}
          />
          <span>Đang xử lý. Hãy đợi một tí ...</span>
        </div>
      )}
    </div>
  );
};

export default ListAccount;
