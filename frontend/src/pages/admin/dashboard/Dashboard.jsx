import "./dashboard.css";
import React from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import Widget from "../../../components/widget/Widget";
import Contact from "../../../components/contact/Contact";
import Chart from "../../../components/chart/Chart";
import { useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";
import axios from "axios";

const Dashboard = () => {
  const {user} = useContext(AuthContext);
  const [totalTutor, setTotalTutor] = useState(0);
  const [totaluser, setTotaluser] = useState(0);
  const [totalCourse, setTotalCourse] = useState(0);
  const [totalContact, setTotalContact] = useState(0);

  useEffect(()=>{
    const loadTotalTutor = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/account/tutor`, {withCredentials: true});
        if(res.data){
          setTotalTutor(res.data);
        }

      } catch (error) {
        console.log(error);
      }
    }
    const loadTotalCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/account/course`, {withCredentials: true});
        if(res.data){
          setTotalCourse(res.data);
        }

      } catch (error) {
        console.log(error);
      }
    }
    const loadTotalUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/account/user`, {withCredentials: true});
        if(res.data){
          setTotaluser(res.data);
        }

      } catch (error) {
        console.log(error);
      }
    }
    const loadTotalContact = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/contact`, {withCredentials: true});
        if(res.data){
          setTotalContact(res.data.total);
        }

      } catch (error) {
        console.log(error);
      }
    }

    loadTotalCourse();
    loadTotalTutor();
    loadTotalUser();
    loadTotalContact();

  }, [])

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <DashboardNav />
        <div className="widgets">
          <Widget type="user" total={totaluser} />
          <Widget type="tutor" total={totalTutor} />
          <Widget type="course" total={totalCourse} />
          <Widget type="contact" total={totalContact} />
        </div>
        <div className="featureContainer">
          <Contact />
          <Chart tutor={totalTutor} user={totaluser} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
