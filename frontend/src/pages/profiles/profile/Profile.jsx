import "./profile.css";
import { useContext } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import ScrollTop from "../../../components/scrollTop/ScrollTop";
import ProfileAccount from "../../../components/profileAccount/ProfileAccount";
import ProfileTutor from "../../../components/profileTutor/ProfileTutor";
import ProfileAchievement from "../../../components/profileAchievement/ProfileAchievement";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import CommentForm from "../../../components/commentForm/CommentForm";
import Comment from "../../../components/comment/Comment";

const Profile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [account, setAccount] = useState([]);
  const [tutorProfile, settutorProfile] = useState([]);
  const [achievements, setAchivements] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);
  const [activeComment, setActiveComment] = useState(null);

  const styleUser = {
    minHeight: "calc(100vh - 80px - 163.6px)",
  };

  // console.log(id);
  useEffect(() => {
    const loadAccount = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/account/${id}`, {
          withCredentials: true,
        });
        if (res.data) {
          setAccount(res.data);
        }
      } catch (error) {
        console.log(error.data);
      }
    };
    loadAccount();

    const loadTutorProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/tutors/${id}`, {
          withCredentials: true,
        });
        if (res.data) {
          settutorProfile(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadTutorProfile();

    const loadTutorAchievements = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/tutor_achievement/achievements/${id}`,
          { withCredentials: true }
        );
        if (res.data) {
          setAchivements(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadTutorAchievements();

    const loadComments = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/comment/${id}`);
        if (res.data) {
          setComments(res.data.comments);
          setTotalComments(res.data.total);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadComments();
  }, [id]);

  const parentComments = comments.filter((comment) => comment.parentID === null);

  const getChildComments = (commentID) => {
    return comments.filter(comment => comment.parentID === commentID).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  const handleEditAchievement = (id) => {
    console.log(`Edit: ${id}`);
    navigate(`/profile/achievement/edit/${id}`);
  };

  const handleDeleteAchievement = async (id) => {
    console.log(`Delete: ${id}`);
    try {
      const confirm = await Swal.fire({
        title: "Cảnh bác",
        text: `Bạn có chắc sẽ xóa thành tựu này?`,
        icon: "warning",
        confirmButtonText: "Chắc chắn",
        cancelButtonText: "Đóng",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });
      if (confirm && confirm.isConfirmed) {
        const res = await axios.delete(
          `http://localhost:8000/api/tutor_achievement/delete/${id}&${user._id}`,
          {
            withCredentials: true,
          }
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

  const addComment = async (text, parentID) => {
    console.log(`Add comment: ${text}`);
    try {
      if(text !== ""){
        if(user !== null){
          if(user?._id !== id){
              const res = await axios.post(`http://localhost:8000/api/comment/create`, {comment: {
                content: text,
                reviewer: user?.username
              }, tutor: id, parentID: null}, {withCredentials:true});
              if(res.data.success){
                //Fetch comments again
                const res1 = await axios.get(`http://localhost:8000/api/comment/${id}`);
                if(res1.data){
                  setComments(res1.data.comments);
                  setTotalComments(res1.data.total);
                }
              }
          } else {
            const res = await axios.post(`http://localhost:8000/api/comment/create`, {comment: {
                content: text,
                reviewer: user?.username
              }, tutor: id, parentID: parentID}, {withCredentials:true});
              if(res.data.success){
                setActiveComment(null);
                //Fetch comments again
                const res1 = await axios.get(`http://localhost:8000/api/comment/${id}`);
                if(res1.data){
                  setComments(res1.data.comments);
                  setTotalComments(res1.data.total);
                  
                }
              }
          }
        }
        else {
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Bạn cần đăng nhập để bình luận!",
          });
        }
      }
      else {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Hãy nhập để bình luận!",
        });
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

  const handleDeleteComment = async (commentID) => {
    console.log("Delete comment: "+commentID);
    try {
      const confirm = await Swal.fire({
        title: "Cảnh bác",
        text: `Bạn có chắc sẽ xóa bình luận này?`,
        icon: "warning",
        confirmButtonText: "Chắc chắn",
        cancelButtonText: "Đóng",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      });
      if (confirm && confirm.isConfirmed) {
        const res = await axios.delete(
          `http://localhost:8000/api/comment/delete/${commentID}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          //Fetch comments again
          const res1 = await axios.get(`http://localhost:8000/api/comment/${id}`);
          if(res1.data){
            setComments(res1.data.comments);
            setTotalComments(res1.data.total);
          }
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

  const updateComment = async (text, commentID) => {
    console.log('Edit comment: '+commentID);
    try {
      if(text !== ""){
        const res = await axios.put(`http://localhost:8000/api/comment/edit/${commentID}`, {comment: {
          content: text
        }}, {withCredentials:true});
        if(res.data.success){
          setActiveComment(null);
          //Fetch comments again
          const res1 = await axios.get(`http://localhost:8000/api/comment/${id}`);
          if(res1.data){
            setComments(res1.data.comments);
            setTotalComments(res1.data.total);
          }
        }
      }
      else {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Hãy nhập bình luận!",
        });
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
    <>
      <Navbar />
      {/* <div className="sidebar">
        <li>
          TK
        </li>
        <li>
          GS
        </li>
        <li>
          TT
        </li>
      </div> */}
      <ScrollTop />
      <section
        className="profileContainer"
        style={user?.accountType === "USER" ? styleUser : {}}
      >
        <div className="container">
          <div className="contentWrapper">
            <div className="row">
              <div className="col-md-9 px-0">
                <ProfileAccount
                  info={account.length !== 0 ? account : null}
                  show={id !== user?._id ? 0 : 1}
                />
                
                {tutorProfile !== null ? Object.keys(tutorProfile).length > 0 ? (
                  <ProfileTutor
                    info={
                      Object.keys(tutorProfile).length > 0 ? tutorProfile : null
                    }
                  />
                ) : (
                  ""
                ) : ""}
              </div>
              {id === user?._id ? (
                <div className="col-md-3 ps-3 pe-0">
                  <div className="settingContainer">
                    <h2 className="settingTitle">
                      <FontAwesomeIcon icon={faScrewdriverWrench} />
                      Thiết lập
                    </h2>
                    <hr className="settingLine" />

                    <div className="settingItem">
                      <Link to={`/profile/edit/account/${id}`}>
                        <span>Chỉnh sửa tài khoản</span>
                      </Link>
                    </div>
                    <div className="settingItem">
                      <Link to={`/profile/edit/password/${id}`}>
                        <span>Thay đổi mật khẩu</span>
                      </Link>
                    </div>

                    {user?.accountType === "TUTOR" ? (
                      <>
                        <div className="settingItem">
                          <Link to={`/profile/edit/tutor/${user?._id}`}>
                            <span>Chỉnh sửa thông tin giảng dạy</span>
                          </Link>
                        </div>
                        <div className="settingItem">
                          <Link to={`/profile/achievement/create`}>
                            <span>Thêm thành tựu</span>
                          </Link>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </section>

      {achievements.length > 0 ? (
        <section className="achievementsContainer">
          <div className="container">
            <div className="achievementsWrapper">
              <div className="row">
                <div className="col-md-9 px-0">
                  {/* Only tutor can edit achievement => option -> 1 : can edit
                                                        option -> 0 : cannot edit
                  */}
                  {achievements.length > 0
                    ? achievements.map((item, index) => (
                        <div
                          className={
                            index === achievements.length - 1 ? "" : "mb-3"
                          }
                          key={index}
                        >
                          <ProfileAchievement
                            info={item}
                            show={id === user?._id ? 1 : 0}
                            handleEditAchievement={handleEditAchievement}
                            handleDeleteAchievement={handleDeleteAchievement}
                          />
                        </div>
                      ))
                    : ""}
                </div>
                <div className="col-md-3 ps-3 pe-0">
                  <h2 className="achievementTitle">Thành tích</h2>
                  <h2 className="achievementTitle">cá nhân</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        ""
      )}

      {tutorProfile !== null ? Object.keys(tutorProfile).length > 0 ? (
        <section className="commentsContainer">
        <div className="container">
          <div className="commentsWrapper">
            <h2 className="commentsTitle">Bình luận {`(${totalComments})`}</h2>
            <div className="row">
              <div className="col-md-9 px-0">
                <CommentForm submitLabel="Bình luận" handleSubmit={addComment} />
                {parentComments.length !== 0 ? 
                  parentComments.map((item) => (
                    <Comment item={item} key={item._id} handleDeleteComment={handleDeleteComment} activeComment={activeComment} setActiveComment={setActiveComment} addComment={addComment} updateComment={updateComment} 
                    replies={getChildComments(item._id)}
                    />
                  ))
                : ""}
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : "" : ""}
      

      <Footer />
    </>
  );
};

export default Profile;
