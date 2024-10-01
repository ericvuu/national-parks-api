import React from "react";
import Form from "../components/Form";

const Explore = () => {
  return (
    <div className="explore-page page">
      <div className="explore-banner">
        <div className="banner-content">
          <h1 className="banner-heading">Explore</h1>
          <p>
            Welcome to National Parks, your ultimate guide to exploring
            America's most beautiful natural treasures. We believe in the power
            of nature to inspire and connect us all.
          </p>
        </div>
      </div>
      <div className="explore-form">
        <div className="explore-form-container">
          <Form />
        </div>
      </div>
      <div className="content-container container">
        <p>placeholder</p>
      </div>
    </div>
  );
};

export default Explore;
