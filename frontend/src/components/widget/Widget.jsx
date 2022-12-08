import './widget.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUsersBetweenLines, faListCheck, faAddressBook} from '@fortawesome/free-solid-svg-icons';
import React from 'react'

const Widget = ({type, total}) => {

  return (
    <div className='widget'>
      <div className="left">
        <span className="widgetTitle">
        {type === "user" && "TỔNG SỐ PHHS"}
          {type === "tutor" && "TỔNG GIA SƯ"}
          {type === "course" && "TỔNG SỐ KHÓA HỌC"}
          {type === "contact" && "TỔNG SỐ LIÊN HỆ"}
        </span>
        <span className="widgetCounter">{total}</span>
      </div>
      <div className="right">
        <div className="widgetIcon">
          {type === "user" && <FontAwesomeIcon  icon={faUsers} style={{color: "crimson", backgroundColor: "rgba(255,0,0,0.2)"}}/>}
          {type === "tutor" && <FontAwesomeIcon  icon={faUsersBetweenLines} style={{color: "goldenrod", backgroundColor: "rgba(218,165,32,0.2)"}}/>}
          {type === "course" && <FontAwesomeIcon icon={faListCheck} style={{color: "green", backgroundColor: "rgba(0,128,0,0.2)"}} />}
          {type === "contact" && <FontAwesomeIcon icon={faAddressBook} style={{color: "purple", backgroundColor: "rgba(128,0,128,0.2)"}} />}
        </div>
      </div>
    </div>
  )
}

export default Widget