import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Form from "../components/Form";
import Card from "../components/Card";
import notFoundImage from "../assets/images/banners/not-found.jpg";
import useGetParks from "../hooks/useGetParks";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Explore = () => {
  const [parks, setParks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const parksPerPage = 10;
  const query = useQuery();
  const qActivity = query.get("activity");
  const qStateCode = query.get("stateCode");
  const qSearchTerm = query.get("q");
  const formattedActivity = qActivity ? qActivity.replace(/-/g, " ") : null;

  const { parkData, error, loading } = useGetParks(
    qStateCode,
    qSearchTerm,
    currentPage
  );

  useEffect(() => {
    if (parkData && parkData.data && qActivity == null) {
      const fetchedParks = parkData.data;
      const allParks = fetchedParks.map((park) => ({
        name: park.fullName,
        parkCode: park.parkCode,
        image:
          park.images && park.images[0] ? park.images[0].url : notFoundImage,
        url: park.url,
      }));
      setParks(allParks);
      setTotalPages(Math.ceil(parkData.total / parksPerPage));
    } else if (parkData && parkData.data && qActivity) {
      const fetchedParks = parkData.data;
      let filteredParks = [];
      fetchedParks.forEach((park) => {
        const activities = park.activities;
        let parkAdded = false;
        if (activities.length) {
          activities.forEach((activity) => {
            const activityLC = activity.name.toLowerCase();
           if (activityLC.includes(formattedActivity)) {
             if (!parkAdded) {
               filteredParks.push({
                 name: park.fullName,
                 parkCode: park.parkCode,
                 image:
                   park.images && park.images[0]
                     ? park.images[0].url
                     : notFoundImage,
                 url: park.url,
               });
               parkAdded = true;
             }
           }
          });
        }
      });
      setParks(filteredParks);
    }
  }, [parkData, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

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
        {parks.length > 0 ? (
          <div className="gallery">
            {parks.map((park, index) => (
              <Card
                key={index}
                parkCode={park.parkCode}
                title={park.name}
                imageUrl={park.image}
              />
            ))}
          </div>
        ) : (
          <p className="no-parks">No parks available.</p>
        )}
        {

        }
        <div className="pagination-controls">
          <button className="prev" onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button className="next"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explore;
