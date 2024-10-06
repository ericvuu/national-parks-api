import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Form from "../components/Form";
import Card from "../components/Card";
import notFoundImage from "../assets/images/banners/not-found.jpg";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Explore = () => {
  const [parks, setParks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const parksPerPage = 25;
  const query = useQuery();
  const qActivity = query.get("activity");
  const qStateCode = query.get("stateCode");
  const qSearchTerm = query.get("q");
  const formattedActivity = qActivity ? qActivity.replace(/-/g, " ") : null;

  useEffect(() => {
    const fetchParks = async () => {
      setLoading(true);
      setError(null);

      const startCount = (currentPage - 1) * parksPerPage + 1;
      const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;

      try {
        const apiUrl = `https://developer.nps.gov/api/v1/parks?api_key=${npsAPIKeys}${qStateCode ? `&stateCode=${qStateCode}` : ''}${qSearchTerm ? `&q=${qSearchTerm}` : ''}&start=${startCount}&limit=${parksPerPage}`;
        const res = await axios.get(apiUrl);

        if (res.status === 200) {
          let parksData = res.data.data;

          if (qActivity) {
            parksData = parksData.filter((park) =>
              park.activities.some((act) => act.name.toLowerCase() === formattedActivity.toLowerCase())
            );
          }

          setParks(parksData.map((park) => ({
            parkID: park.id,
            name: park.fullName,
            parkCode: park.parkCode,
            image: park.images && park.images[0] ? park.images[0].url : notFoundImage,
            url: park.url,
          })));

          setTotalPages(Math.ceil(res.data.total / parksPerPage));
        } else {
          setError("Failed to fetch parks");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParks();
  }, [qStateCode, qSearchTerm, currentPage, formattedActivity]);

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
          <Form uPath={`explore`} uState={qStateCode} uSearch={qSearchTerm} />
        </div>
      </div>
      <div className="content-container container">
        {loading ? (
          <p className="status">Loading parks...</p>
        ) : parks.length > 0 ? (
          <div className="gallery">
            {parks.map((park) => (
              <Card
                key={park.parkID}
                parkCode={park.parkCode}
                title={park.name}
                imageUrl={park.image}
                parkUrl={`/park?pCode=${park.parkCode}`}
              />
            ))}
          </div>
        ) : (
          <p className="status">No parks available.</p>
        )}
        <div className="pagination-controls">
          <button
            className="prev"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            className="next"
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
