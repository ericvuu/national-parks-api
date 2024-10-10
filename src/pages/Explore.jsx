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

const fetchParks = async ({ queryKey }) => {
  const [_, qStateCode, qSearchTerm, currentPage, parksPerPage, formattedActivity] = queryKey;
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const startCount = (currentPage - 1) * parksPerPage + 1;

  const apiUrl = `https://developer.nps.gov/api/v1/parks?api_key=${npsAPIKeys}${qStateCode ? `&stateCode=${qStateCode}` : ''}${qSearchTerm ? `&q=${qSearchTerm}` : ''}&start=${startCount}&limit=${parksPerPage}`;

  const res = await axios.get(apiUrl);

  if (res.status !== 200) {
    throw new Error("Failed to fetch parks");
  }

  let parksData = res.data.data;

  if (formattedActivity) {
    parksData = parksData.filter((park) =>
      park.activities.some((act) => act.name.toLowerCase() === formattedActivity.toLowerCase())
    );
  }

  return {
    parks: parksData.map((park) => ({
      parkID: park.id,
      name: park.fullName,
      parkCode: park.parkCode,
      image: park.images && park.images[0] ? park.images[0].url : notFoundImage,
      url: park.url,
    })),
    total: res.data.total,
  };
};

const Explore = () => {
  const parksPerPage = 25;
  const [currentPage, setCurrentPage] = useState(1);
  const query = useQueryParams();
  const qActivity = query.get("activity");
  const qStateCode = query.get("stateCode");
  const qSearchTerm = query.get("q");
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
