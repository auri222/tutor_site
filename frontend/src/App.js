import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import Register from './pages/register/register_screen/Register';
import RegisterTutor from './pages/register/register_tutor/RegisterTutor';
import RegisterUser from './pages/register/register_user/RegisterUser';
import OTPVerify from './pages/register/otpVerify/OTPVerify';
import TutorsList from './pages/tutors/tutorsList/TutorsList';
import Courses from './pages/courses/coursesList/Courses';
import CreateCourse from './pages/courses/createCourse/CreateCourse';
import Course from './pages/courses/course/Course';
import EditCourse from './pages/courses/editCourse/EditCourse';
import Tutor from './pages/tutors/tutor/Tutor';
import Profile from './pages/profiles/profile/Profile';
import EditProfile from './pages/profiles/editProfile/EditProfile';
import EditPassword from './pages/profiles/editPassword/EditPassword';
import RegisterTutorCourse from './pages/tutors/registerTutor/RegisterTutorCourse';
import ListCourse from './pages/courses/listCourse/ListCourse';
import EditProfileTutor from './pages/profiles/editTutorProfile/EditProfileTutor';
import CreateAchievement from './pages/profiles/createAchievement/CreateAchievement';
import EditTutorAchievement from './pages/profiles/editTutorAchievement/EditTutorAchievement';
import Notification from './pages/notify/Notification';
import Dashboard from './pages/admin/dashboard/Dashboard';
import ListAccount from './pages/admin/listAccount/ListAccount';
import ProfileAdmin from './pages/admin/profileAdmin/ProfileAdmin';
import CoursesDashboard from './pages/admin/coursesDashboard/CoursesDashboard';
import ClassDashboard from './pages/admin/classDashboard/ClassDashboard';
import SubjectDashboard from './pages/admin/subjectDashboard/SubjectDashboard';
import CreateClassDashboard from './pages/admin/createClassDashboard/CreateClassDashboard';
import AccountDetailsDB from './pages/admin/accountDetailsDB/AccountDetailsDB';
import CourseDetailDB from './pages/admin/courseDetailsDB/CourseDetailDB';
import ContactPage from './pages/contactPage/ContactPage';
import NotificationDB from './pages/admin/notificationDB/NotificationDB';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path='/register' exact element={<Register />} />
        <Route path='/register_user' exact element={<RegisterUser />} />
        <Route path='/register_tutor' exact element={<RegisterTutor />} />
        <Route path='/otp/:id' exact element={<OTPVerify />} />
        <Route path='/login' exact element={<Login />} />
        <Route path='/contact' exact element={<ContactPage />}/>
        <Route path='notification'>
          <Route index element={<Notification />} />
        </Route>
        <Route path='dashboard'>
          <Route index element={<Dashboard />} />
          <Route path='profile'>
            <Route index path=':id' element={<ProfileAdmin />}/>
          </Route>
          <Route path='account'>
            <Route index element={<ListAccount />} />
            <Route path='details/:id' element={<AccountDetailsDB />} />
            {/* Xem */}
          </Route>
          <Route path='course'>
            <Route index element={<CoursesDashboard />}/>
            <Route path='details/:id' element={<CourseDetailDB />}/>
            
            {/* Xem */}
          </Route>
          <Route path='class'>
            <Route index element={<ClassDashboard />} />
            <Route path='create' element={<CreateClassDashboard />} />
            {/* Xem */}
          </Route>
          <Route path='subject'>
            <Route index element={<SubjectDashboard />} />
            {/* Xem */}
          </Route>
          <Route path='notification'>
            <Route index element={<NotificationDB />}/>
            {/* Xem */}
          </Route>
        </Route>
        <Route path='tutors'>
          <Route index element={<TutorsList />} />
          <Route path=':id' element={<Tutor />} />
          <Route path='register_tutor/:id' element={<RegisterTutorCourse />} />
        </Route>
        <Route path='courses'>
          <Route path='details/:id' element={<Course />} />
          <Route path='list/:id' element={<ListCourse />} />
          <Route path='create' element={<CreateCourse />} />
          <Route path='edit/:id' element={<EditCourse />} />
          <Route index element={<Courses />} />
          
        </Route>
        <Route path='profile'>
          <Route index path=':id' element={<Profile />}/>
          <Route path='achievement'>
            <Route path='create' element={<CreateAchievement />} />
            <Route path='edit/:id' element={<EditTutorAchievement />}/>
          </Route>
          <Route path='edit'>
            <Route path='account/:id' element={<EditProfile />}/>
            <Route path='tutor/:id' element={<EditProfileTutor />}/>
            <Route path='password/:id' element={<EditPassword />}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
