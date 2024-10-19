import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import yosemiteImage from "../assets/images/banners/yosemite.jpg";
import archesImage from "../assets/images/banners/arches.jpg";
import glacierBayImage from "../assets/images/banners/glacier-bay.jpg";

import { fetchParks } from "../api/fetchParks";

const defaultParks = [
  { name: "Yosemite", image: yosemiteImage, id: "yose" },
  { name: "Arches National Park", image: archesImage, id: "arch" },
  {name: "Glacier Bay National Park & Preserve", image: glacierBayImage,id: "glba",},
];

const HomeBanner = ({ city, country, state, stateCode }) => {
  const parksPerPage = 3;
  const searchTerm = null;

  const { data, error, isLoading } = useQuery({
    queryKey: ["parks", stateCode, searchTerm, parksPerPage],
    queryFn: ({ queryKey }) => {
      const startCount = 1;
      return fetchParks({ queryKey: queryKey, pageParam: startCount });
    },
    keepPreviousData: true,
    enabled: !!state
  });

  const parks = (data?.parks && data.parks.length > 2) ? data.parks : defaultParks;

  return (
    <div className="home-banner">
      <div className="banner-image"></div>
      <div className="banner-content-container">
        <div className="banner-row">
          <div className="banner-left">
            <p className="banner-subheading">Embrace the beauty</p>
            <h1 className="banner-heading">
              {isLoading
                ? `Fetching Parks in your State...`
                : state && country === "United States"
                ? `Explore the National Parks in ${state}`
                : "Explore America's National Parks"}
            </h1>
            <Link to={`/explore?stateCode=${stateCode}`} className="btn btn-lg np-explore-btn">
              Explore Parks
            </Link>
          </div>
          <div className="banner-right">
            {isLoading ? (
              <p>Loading parks...</p>
            ) : error ? (
              <p>Error fetching parks: {error.message}</p>
            ) : (
              parks.map((park, index) => (
                <Link
                  to={`/park?pCode=${park.parkCode}`}
                  key={park.parkCode}
                  className={`park-image park-image-${index + 1}`}
                  id={park.parkCode}
                >
                  <img src={park.image} alt={`${park.name} National Park`} />
                  <div className="park-name">{park.name}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
