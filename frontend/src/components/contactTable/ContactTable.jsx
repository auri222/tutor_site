import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './contactTable.css';

const ContactTable = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState([]);

  const loadContact = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/contact`, {withCredentials:true});
      if(res.data){
        setContact(res.data.contact);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadContact();
  }, [])

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

  const handleClick = async (id) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/contact/edit/${id}`, {}, {withCredentials: true});
      if(res.data.success){
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <table className="contactTable table table-bordered table-responsive">
    <thead>
      <tr>
        <th scope="col">STT</th>
        <th scope="col">Tên người liên hệ</th>
        <th scope="col">Nội dung</th>
        <th scope="col">Ngày tạo</th>
        <th scope="col">Trạng thái</th>
      </tr>
    </thead>
    <tbody>
      {contact.length > 0 ? contact.map((item, index) => (
        <tr key={index}>
        <th scope="row">{index+1}</th>
        <td>{item.sender}</td>
        <td>{item.content}</td>
        <td>{handleCreatedDate(item.createdAt)}</td>
        <td>{item.isCheck? (
          <span className="badge text-bg-success">Đã kiểm tra</span>
        ): (
          <span className="badge text-bg-secondary btnCheckContactStatus"  data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="CLick để cập nhật trạng thái" onClick={() => {handleClick(item._id)}}>Chưa kiểm tra</span>
        )}</td>
      </tr>
      )): (
        <tr>
          <td colSpan={4}>Chưa có thông tin liên hệ</td>
        </tr>
      )}
    </tbody>
  </table>
  )
}

export default ContactTable