import React from 'react';
import './register.css';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className='register'>
      <div className="registerContainer">
        <Link to="/home" style={{ color: "inherit", textDecoration: "none" }}>
            <div className="rLogo">TutorSite</div>
        </Link>
        <div className="rTitleContainer">
          <h2 className="rTitle">Đăng ký tài khoản</h2>
          <h3 className="rText">Xin chào, bạn là</h3>
        </div>
        <div className="rItem">
          <Link to="/register_tutor" style={{ color: "inherit", textDecoration: "none" }}>
              <button className='rButton'>Gia sư</button>
          </Link>
          <Link to="/register_user" style={{ color: "inherit", textDecoration: "none" }}>
              <button className='rButton'>Phụ huynh - học sinh</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register