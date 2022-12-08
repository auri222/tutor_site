import "./accountTable.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faLock,
  faLockOpen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const AccountTable = ({handleLock, handleUnlock, handleDelete, handleClickDetails}) => {
  const [search, setSearch] = useState("");
  const [record, setRecord] = useState(0); //Số record hiển thị
  const [total, setTotal] = useState(0); //Tổng số account
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);
  const [data, setData] = useState([]);
  const [isLoadMore, setIsLoadMore] = useState(false);

  const [loading, setLoading] = useState(false);

  const loadData = async (skip, limit, search, isLoadMore) => {
    try {
      const url = `http://localhost:8000/api/account/all?username=${search}&skip=${skip}&limit=${limit}`;
      const res = await axios.get(url, { withCredentials: true });
      if (res.data) {
        setTotal(res.data.total);
        setSkip(res.data.skip);
        setIsLoadMore(res.data.isLoadMore);
        if (isLoadMore) {
          setData([...data, ...res.data.list]);
        } else {
          setData(res.data.list);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData(skip, limit, search, false);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setRecord(data.length);
    }
    // console.log(data.length);
    // console.log(isLoadMore);
  }, [data]);

  const handleLoadMore = () => {
    let newSkip = skip + limit;
    loadData(newSkip, limit, search, true);
  };

  const handleSearch = (e) => {
    loadData(0, 8, search, false);
  };


  return (
    <div className="accountTable">
      <div className="accountTableTitle">Danh sách tài khoản</div>
      <div className="accountTableSearch">
        <div className="accountTableTotal">Tổng số: {record}</div>
        <div className="searchOption">
          <input
            type="text"
            id="search"
            className="searchUsernameInput"
            placeholder="Tìm kiếm tên tài khoản"
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={handleSearch}
            
          />
          {/* <button className="btnSearchUsername" onClick={handleSearch}>Tìm kiếm</button> */}
        </div>
      </div>

      <table className="table table-bordered table-responsive">
        <thead>
          <tr>
            <th scope="col">Tên tài khoản</th>
            <th scope="col">Email</th>
            <th scope="col">Loại tài khoản</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Xác minh</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 &&
            data.map((item) => (
              <tr key={item._id}>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>
                  {item.accountType === "TUTOR"
                    ? "Gia sư"
                    : item.accountType === "USER"
                    ? "PHHS"
                    : "Admin"}
                </td>
                <td>
                  {item.isActive ? (
                    <span className="badge text-bg-success">
                      Đang hoạt động
                    </span>
                  ) : (
                    <span className="badge text-bg-secondary">Đã nghỉ</span>
                  )}
                </td>
                <td>
                  {item.isVerify ? (
                    <span className="badge text-bg-success me-2">
                      Đã xác minh
                    </span>
                  ) : (
                    <span className="badge text-bg-secondary me-2">
                      Chưa xác minh
                    </span>
                  )}
                  {item.isLock && (
                    <span className="badge text-bg-danger">Đã bị khóa</span>
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-info me-2"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="CLick để xem chi tiết"
                    onClick={() => {handleClickDetails(item._id)}}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  {item.isLock ? (
                    <button
                      type="button"
                      className="btn btn-warning me-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Click để mở khóa tài khoản"
                      onClick={() => {handleUnlock(item._id)}}
                    >
                      <FontAwesomeIcon icon={faLock} />
                      
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-warning me-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Click để khóa tài khoản"
                      onClick={() => {handleLock(item._id)}}
                    >
                      <FontAwesomeIcon icon={faLockOpen} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Click để xóa tài khoản"
                    onClick={() => {handleDelete(item._id)}}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="accountTableLoadMore">
        { isLoadMore && (
              <button className="btnLoadMore" onClick={handleLoadMore}>
                Tải thêm ...
              </button>
            )}
      </div>
    </div>
  );
};

export default AccountTable;
