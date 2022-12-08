import './dropdown.css';
import {useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';

const Dropdown = ({data, type,closeMobileMenu}) => {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const handleClick = () => setClick(!click);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/auth/logOut/${data}`);
      if(res.data.success){
        dispatch({type: "LOGOUT"});
        localStorage.setItem("user", null);
        navigate('/', { replace: true });
      }

    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <ul onClick={handleClick} 
          className={click ? 'dropdown-list clicked': 'dropdown-list'}
      >
        <li>
          <Link to={`/profile/${data}`} className='dropdown-link' onClick={() => {
            setClick(false);
            closeMobileMenu();
          }}>
            Tài khoản của bạn
          </Link>
        </li>
        <li>

            <Link to={`/courses/list/${data}`} className='dropdown-link' onClick={() => {
              setClick(false);
              closeMobileMenu();
            }}>
              Khóa học của bạn
            </Link>

        </li>
        <li>
          <Link to='#' className='dropdown-link' onClick={() => 
            handleLogout()}>
            Đăng xuất
          </Link>
        </li>
      </ul>
    </>
  )
}

export default Dropdown