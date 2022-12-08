import './home.css';
import Navbar from '../../components/navbar/Navbar';
import Intro from '../../components/intro/Intro';
import IntroReason from '../../components/introReason/IntroReason';
import TutorsList from '../../components/tutorsList/TutorsList';
import CourseList from '../../components/coursesList/CourseList';
import Footer from '../../components/footer/Footer';
const Home = ({info}) => {
  return (
    <>
      <Navbar />
      <Intro />
      <IntroReason />
      <TutorsList />
      <CourseList />
      <Footer />
    </>
  )
}

export default Home