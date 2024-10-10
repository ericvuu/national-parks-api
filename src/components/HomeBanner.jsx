import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import yosemiteImage from "../assets/images/banners/yosemite.jpg";
import archesImage from "../assets/images/banners/arches.jpg";
import glacierBayImage from "../assets/images/banners/glacier-bay.jpg";
import notFoundImage from "../assets/images/banners/not-found.jpg";

const defaultParks = [
  { name: "Yosemite", image: yosemiteImage, id: "yose" },
  { name: "Arches National Park", image: archesImage, id: "arch" },
  {name: "Glacier Bay National Park & Preserve", image: glacierBayImage,id: "glba",},
];

const fetchParks = async (stateCode, parksPerPage, apiKey) => {
  const apiUrl = `https://developer.nps.gov/api/v1/parks?api_key=${apiKey}&stateCode=${stateCode}&limit=${parksPerPage}`;
  const res = await axios.get(apiUrl);

  if (!res.data.data) {
    throw new Error("Parks not found");
  }

  return res.data.data.slice(0, parksPerPage).map((park) => ({
    id: park.parkCode,
    name: park.fullName,
    image: park.images && park.images[0] ? park.images[0].url : notFoundImage,
  }));
};

const HomeBanner = ({ city, country, state, stateCode }) => {
  const parksPerPage = 3;
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;

  const {
    data: parks = defaultParks,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["parks", stateCode],
    queryFn: () => {
      if (!stateCode) {
        return Promise.resolve(defaultParks);
      }
      return fetchParks(stateCode, parksPerPage, npsAPIKeys);
    },
    enabled: !!stateCode,
  });

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
            <Link to="/explore" className="btn btn-lg np-explore-btn">
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
                  to={`/park?pCode=${park.id}`}
                  key={park.id}
                  className={`park-image park-image-${index + 1}`}
                  id={park.id}
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
