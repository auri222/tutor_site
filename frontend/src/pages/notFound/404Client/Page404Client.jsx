import './page404Client.css';
import React from 'react';
import Navbar from '../../../components/navbar/Navbar';
import Footer from '../../../components/footer/Footer';
import { Link } from 'react-router-dom';

const Page404Client = () => {
  return (
    <>
    <Navbar />
    <section className='page404ClientContainer'>
      <div className="container">
        <div className="page404ClientWrapper">
          <h2 className="page404ClientTitle">404 Không tìm thấy dữ liệu</h2>
          <Link to={'/'} className='homeLink'>
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </div>
    </section>
    <Footer />
    </>
  )
}

export default Page404Client