import React from "react";
import Form from "./Form";

const HomeForm = ({ city, country, state, stateCode }) => {
  return (
    <div className="home-form-section">
      <div className="card-container">
        <div className="text-content">
          <h2 className="section-title">Find Your Park</h2>
        </div>
        <Form />
      </div>
    </div>
  );
};

export default HomeForm;
