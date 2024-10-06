import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Form from "../components/Form";
import Card from "../components/Card";
import notFoundImage from "../assets/images/banners/not-found.jpg";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CampFinder = () => {
  const [camps, setCamps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const campsPerPage = 25;
  const query = useQuery();
  const qStateCode = query.get("stateCode");
  const qSearchTerm = query.get("q");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCamps = async () => {
      const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
      const startCount = (currentPage - 1) * campsPerPage + 1;

      setLoading(true);

      try {
        const apiUrl = `https://developer.nps.gov/api/v1/campgrounds?api_key=${npsAPIKeys}${
          qStateCode ? `&stateCode=${qStateCode}` : ""
        }${qSearchTerm ? `&q=${qSearchTerm}` : ""}&start=${startCount}&limit=${campsPerPage}`;

        const res = await axios.get(apiUrl);

        if (res.status === 200) {
          const allCamps = res.data.data.map((camp) => ({
            campID: camp.id,
            name: camp.name,
            parkCode: camp.parkCode,
            image: camp.images && camp.images[0] ? camp.images[0].url : notFoundImage,
            url: camp.url,
          }));
          setCamps(allCamps);
          setTotalPages(Math.ceil(res.data.total / campsPerPage));
          setError(null);
        } else {
          setError("Failed to fetch location");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, [qStateCode, qSearchTerm, currentPage]);

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
    <div className="campgrounds-page page">
      <div className="campgrounds-banner">
        <div className="banner-content">
          <h1 className="banner-heading">Find your Campground</h1>
          <p>
            Escape to the outdoors and discover the ideal campground for your
            next adventure. Whether you're seeking serene forests, lakeside
            retreats, or mountainous vistas, our easy-to-use campground finder
            helps you locate the best spots to unwind and reconnect with nature.
          </p>
        </div>
      </div>
      <div className="campgrounds-form">
        <div className="campgrounds-form-container">
          <Form uPath={`campgrounds`} uState={qStateCode} uSearch={qSearchTerm} />
        </div>
      </div>
      <div className="content-container container">
        {loading ? (
          <p className="status">Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : camps.length > 0 ? (
          <div className="gallery">
            {camps.map((camp) => (
              <Card
                id={camp.campID}
                key={camp.campID}
                title={camp.name}
                imageUrl={camp.image}
                parkUrl={`/camp?cID=${camp.campID}`}
              />
            ))}
          </div>
        ) : (
          <p className="status">No Camps Available</p>
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

export default CampFinder;
