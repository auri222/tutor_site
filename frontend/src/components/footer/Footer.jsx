import "./footer.css";

const Footer = () => {
  return (
    <div className="container-fluid footer">
      <div className="container">
        <div className="footerContainer">
          <div className="footerList">
            <h2 className="footerLogo">TutorSite</h2>
          </div>
          <div className="footerList">
            <h5 className="fListItem">Chính sách và quyền riêng tư</h5>
            <h5 className="fListItem">Quy định về đăng ký tài khoản</h5>
          </div>
          <div className="footerList">
            <h5 className="fListItem">Về chúng tôi</h5>
            <h5 className="fListItem">Liên hệ</h5>
          </div>
        </div>
        <div className="footerText">Copyright &copy; 2022</div>
      </div>
    </div>
  );
};

export default Footer;
