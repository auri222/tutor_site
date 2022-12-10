import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
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
import CreateSubjectDB from './pages/admin/createSubjectDB/CreateSubjectDB';
import EditSubjectDB from './pages/admin/editSubjectDB/EditSubjectDB';
import CreateClassDashboard from './pages/admin/createClassDashboard/CreateClassDashboard';
import EditClassDashboard from './pages/admin/editClassDashboard/EditClassDashboard';
import AccountDetailsDB from './pages/admin/accountDetailsDB/AccountDetailsDB';
import CourseDetailDB from './pages/admin/courseDetailsDB/CourseDetailDB';
import ContactPage from './pages/contactPage/ContactPage';
import NotificationDB from './pages/admin/notificationDB/NotificationDB';
import Page404Client from './pages/notFound/404Client/Page404Client';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const ProtectedRoute = ({children}) => {
    const {user} = useContext(AuthContext);

    if(!user){
      return <Navigate to="/login" />
    }

    else if(user?.isAdmin === false){
      return <Navigate to="/login" />
    }

    return children;
  }
  
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
          <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='profile'>
            <Route index path=':id' element={<ProtectedRoute><ProfileAdmin /></ProtectedRoute>}/>
          </Route>
          <Route path='account'>
            <Route index element={<ProtectedRoute><ListAccount /></ProtectedRoute>} />
            <Route path='details/:id' element={<ProtectedRoute><AccountDetailsDB /></ProtectedRoute>} />
            {/* Xem */}
          </Route>
          <Route path='course'>
            <Route index element={<ProtectedRoute><CoursesDashboard /></ProtectedRoute>}/>
            <Route path='details/:id' element={<ProtectedRoute><CourseDetailDB /></ProtectedRoute>}/>
            
            {/* Xem */}
          </Route>
          <Route path='class'>
            <Route index element={<ProtectedRoute><ClassDashboard /></ProtectedRoute>} />
            <Route path='create' element={<ProtectedRoute><CreateClassDashboard /></ProtectedRoute>} />
            <Route path='edit/:id' element={<ProtectedRoute><EditClassDashboard /></ProtectedRoute>} />
            {/* Xem */}
          </Route>
          <Route path='subject'>
            <Route index element={<ProtectedRoute><SubjectDashboard /></ProtectedRoute>} />
            <Route path='create' element={<ProtectedRoute><CreateSubjectDB /></ProtectedRoute>} />
            <Route path='edit/:id' element={<ProtectedRoute><EditSubjectDB /></ProtectedRoute>} />
            {/* Xem */}
          </Route>
          <Route path='notification'>
            <Route index element={<ProtectedRoute><NotificationDB /></ProtectedRoute>}/>
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
        <Route path='/notfound' element={<Page404Client />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
