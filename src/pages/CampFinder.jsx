import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Form from "../components/Form";
import Card from "../components/Card";
import notFoundImage from "../assets/images/banners/not-found.jpg";

const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

const fetchCamps = async ({ queryKey }) => {
  const [_, stateCode, searchTerm, page, campsPerPage] = queryKey;
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const startCount = (page - 1) * campsPerPage + 1;

  const apiUrl = `https://developer.nps.gov/api/v1/campgrounds?api_key=${npsAPIKeys}${stateCode ? `&stateCode=${stateCode}` : ""}${searchTerm ? `&q=${searchTerm}` : ""}&start=${startCount}&limit=${campsPerPage}`;

  const res = await axios.get(apiUrl);
  if (res.status !== 200) {
    throw new Error("Failed to fetch camps");
  }

  return res.data;
};

const CampFinder = () => {
  const campsPerPage = 25;
  const query = useQueryParams();
  const qStateCode = query.get("stateCode");
  const qSearchTerm = query.get("q");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading } = useQuery({
    queryKey: ['camps', qStateCode, qSearchTerm, currentPage, campsPerPage],
    queryFn: fetchCamps,
    keepPreviousData: true,
  });

  const totalPages = data ? Math.ceil(data.total / campsPerPage) : 1;

  const handleSearch = () => {
    setCurrentPage(1);
  };

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
          <Form uPath={`campgrounds`} uState={qStateCode} uSearch={qSearchTerm} onSearch={handleSearch}/>
        </div>
      </div>
      <div className="content-container container">
        {isLoading ? (
          <p className="status">Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : data && data.data.length > 0 ? (
          <div className="gallery">
            {data.data.map((camp) => (
              <Card
                id={camp.id}
                key={camp.id}
                title={camp.name}
                imageUrl={camp.images && camp.images[0] ? camp.images[0].url : notFoundImage}
                parkUrl={`/camp?cID=${camp.id}`}
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
