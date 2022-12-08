import "./contact.css";
import React from "react";
import ContactTable from "../contactTable/ContactTable";

const Contact = () => {

  return (
    <div className="contactContainer">
      <div className="contactTitle">Liên hệ gần đây</div>
      <ContactTable />
    </div>
  );
};

export default Contact;
