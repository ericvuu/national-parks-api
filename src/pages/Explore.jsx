import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Form from "../components/Form";

import useGetParks from "../hooks/useGetParks";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};


const Explore = ({ stateCode, searchTerm }) => {
  const [parks, setParks] = useState(null);
  const { parkData, error, loading } = useGetParks(stateCode, searchTerm);
  const query = useQuery();
  const activity = query.get("activity");
  const formattedActivity = activity ? activity.replace(/-/g, " ") : null;

  useEffect(() => {
    if (parkData) {
      setParks(parkData);
    }
  }, [parkData]);

  console.log(parkData);

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
