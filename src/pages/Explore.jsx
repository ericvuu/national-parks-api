import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Form from "../components/Form";
import Card from "../components/Card";

import {fetchParks} from "../api/fetchParks";
import useQueryParams from "../utilities/useQueryParams";

const Explore = () => {
  const parksPerPage = 25;
  const [currentPage, setCurrentPage] = useState(1);
  const { qActivity, qStateCode, qSearchTerm } = useQueryParams();

  const formattedActivity = qActivity ? qActivity.replace(/-/g, " ") : null;

  const { data, error, isLoading } = useQuery({
    queryKey: ['parks', qStateCode, qSearchTerm, currentPage, parksPerPage, formattedActivity],
    queryFn: fetchParks,
    keepPreviousData: true,
  });

  const totalPages = data ? Math.ceil(data.total / parksPerPage) : 1;

  const handleSearch = () => {
    setCurrentPage(1);
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
          <Form uPath={`explore`} uState={qStateCode} uSearch={qSearchTerm} onSearch={handleSearch}/>
        </div>
      </div>
      <div className="content-container container">
        {isLoading ? (
          <p className="status">Loading parks...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : data.parks.length > 0 ? (
          <div className="gallery">
            {data.parks.map((park) => (
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
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            className="next"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explore;
