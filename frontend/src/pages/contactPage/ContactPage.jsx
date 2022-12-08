import "./contactPage.css";
import axios from "axios";
import ScrollTop from "../../components/scrollTop/ScrollTop";
import { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import ScaleLoader from "react-spinners/ScaleLoader";

const ContactPage = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    content: "",
    sender: "",
    email: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let isValid = true;
    let err = {};
    //old pw
    if (contact["sender"] === "") {
      isValid = false;
      err["sender"] = "Hãy họ tên hoặc tên tài khoản (nếu có).";
    }
    //new pw
    if (contact["content"] === "") {
      isValid = false;
      err["content"] = "Hãy nhập nội dung liên hệ.";
    }

    if (contact["email"] === "") {
      isValid = false;
      err["email"] =
        "Hãy nhập địa chỉ email. Chúng tôi sẽ nhận được nội dung liên hệ của bạn thông qua email!";
    }

    if (
      !contact["email"].match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      )
    ) {
      isValid = false;
      err["email"] =
        "Hãy nhập địa chỉ email hợp lệ. Chúng tôi sẽ nhận được nội dung liên hệ của bạn thông qua email!";
    }

    setError(err);

    return isValid;
  };

  const errorArr = Object.keys(error).map((k, i) => (
    <li key={i}>{error[k]}</li>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        setLoading(true);
        const res = await axios.post(`http://localhost:8000/api/contact/create`, { contact: contact });
        if (res.data.success) {
          setLoading(false);
          Swal.fire({
            title: "Hoàn thành",
            text: `${res.data.message}.`,
            icon: "success",
            confirmButtonText: "Xong",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/', {replace: true});
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
    <>
      <Navbar />
      <ScrollTop />
      <section className="contactPageContainer">
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
        <div className="container">
          <div className="contactPageWrapper">
            <h2 className="contactPageTitle">Liên hệ</h2>
            <hr />

            <form className="contactPageForm">
              <div className="row">
                <div className="col-md-4">
                  <h4 className="fPartTitle">Thông tin cá nhân</h4>
                </div>
                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="sender">
                      Họ tên hoặc tên đăng nhập (nếu có)
                    </label>
                    <input
                      type="text"
                      id="sender"
                      className="form-control"
                      placeholder="Nhập họ tên hoặc tên đăng nhập (nếu có)"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email">Email</label>
                    <input
                      type="text"
                      id="email"
                      className="form-control"
                      placeholder="Nhập địa chỉ email"
                      onChange={handleChange}
                      required
                    />
                    <small>Chúng tôi sẽ nhận nội dung liên hệ trực tiếp từ email của bạn nên hãy nhập email chính xác.</small>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <h4 className="fPartTitle">Thông tin liên hệ</h4>
                </div>
                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="newPassword">Nội dung liên hệ</label>
                    <textarea
                      id="content"
                      className="form-control"
                      placeholder="Nhập nội dung liên hệ"
                      onChange={handleChange}
                      required
                      rows={4}
                    ></textarea>
                  </div>
                </div>
              </div>
              {Object.keys(error).length !== 0 ? (
                <div className="row">
                  <div className="col-md-4"></div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <div className="alert alert-warning mb-3" role="alert">
                        {errorArr}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              <button className="fButton" type="submit" onClick={handleSubmit}>
                Gửi thông tin liên hệ
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactPage;
