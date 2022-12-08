import "./profileAchievement.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPenToSquare,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const ProfileAchievement = ({ info, show, handleEditAchievement, handleDeleteAchievement }) => {
  const [open, setOpen] = useState(false);
  const handleDate = (date) => {
    let d = new Date(date);
    let result = `${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}/${
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    }/${d.getFullYear()} `;
    return result;
  };

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

  return (
    <>
      {open ? (
        <div className="slider">
          <FontAwesomeIcon
            icon={faCircleXmark}
            className="close"
            onClick={() => setOpen(!open)}
            data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Đóng"
          />
          <div className="sliderWrapper">
            <img
              src={info.achievement_image}
              alt={`Ảnh ${info.achievement_name}`}
              className="sliderImg"
            />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="pACHContainer">
        <div className="pACHDetailsContainer">
          <div className="card mb-3 border-0">
            <div className="row g-0 p-2">
              <div className="col-md-6">
                <div className="imgWrapper" onClick={() => setOpen(true)}>
                  <img
                    src={info.achievement_image}
                    className="rounded-start img-fluid achievementImg"
                    alt={`Ảnh ${info.achievement_name}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Click để xem ảnh"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="card-header bg-transparent ">
                  <h5 className="card-title pb-0">{info.achievement_name}</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">Ngày đạt được:</div>
                    <div className="col-md-8">
                      {handleDate(info.achievement_accomplished_date)}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">Từ tổ chức:</div>
                    <div className="col-md-8">{info.achievement_from}</div>
                  </div>
                  <p className="card-text">
                    <small className="text-muted">
                      Đăng lúc {handleCreatedDate(info.createdAt)}
                    </small>
                  </p>
                </div>
                <div className="card-footer bg-transparent text-end">
                  {show === 1 ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-warning mx-2 px-3 py-2"
                        onClick={() => {
                          handleEditAchievement(info._id)
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="me-2"
                        />
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger px-3 py-2"
                        onClick={() => {
                          handleDeleteAchievement(info._id)
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="me-2" />
                        Xóa
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileAchievement;
