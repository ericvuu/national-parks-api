import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Form from "../components/Form";
import Card from "../components/Card";
import notFoundImage from "../assets/images/banners/not-found.jpg";
import useGetCamps from "../hooks/useGetCamps";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CampFinder = () => {
  const [camps, setcamps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const campsPerPage = 25;
  const query = useQuery();
  const qStateCode = query.get("stateCode");
  const qSearchTerm = query.get("q");

  const { campData } = useGetCamps(qStateCode, qSearchTerm,campsPerPage,currentPage);

  useEffect(() => {
   if (campData && campData.data && campData.data.length > 0) {
        const allcamps = campData.data.map((camp) => ({
          campID: camp.id,
          name: camp.name,
          parkCode: camp.parkCode,
          image:
            camp.images && camp.images[0] ? camp.images[0].url : notFoundImage,
          url: camp.url,
        }));
        setcamps(allcamps);
        setTotalPages(Math.ceil(campData.total / campsPerPage));
    }
  }, [campData, currentPage]);

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
        {camps.length > 0 ? (
          <div className="gallery">
            {camps.map((camp, index) => (
              <Card
                id={camp.campID}
                key={index}
                title={camp.name}
                imageUrl={camp.image}
                parkUrl={`/camp?cID=${camp.campID}`}
              />
            ))}
          </div>
        ) : (
          <p className="no-camps">No Camps Available</p>
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
