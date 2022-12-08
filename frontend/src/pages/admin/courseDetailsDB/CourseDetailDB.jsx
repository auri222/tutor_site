import './courseDetailDB.css';
import React from 'react'
import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import CourseDetailsForDB from '../../../components/admin/courseDetailsForDB/CourseDetailsForDB';

const CourseDetailDB = () => {
  return (
    <div className='courseDetailsDB'>
      <Sidebar />
      <div className="courseDetailsContainerDB">
        <DashboardNav />
        <CourseDetailsForDB />
      </div>
    </div>
  )
}

export default CourseDetailDB