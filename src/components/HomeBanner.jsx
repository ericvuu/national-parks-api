import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import yosemiteImage from "../assets/images/banners/yosemite.jpg";
import archesImage from "../assets/images/banners/arches.jpg";
import glacierBayImage from "../assets/images/banners/glacier-bay.jpg";
import notFoundImage from "../assets/images/banners/not-found.jpg";

import useGetParks from "../hooks/useGetParks";

const HomeBanner = ({ city, country, state, stateCode }) => {
  const parksPerPage = 3;
  const defaultParks = [
    { name: "Yosemite", image: yosemiteImage, id: "yose" },
    { name: "Arches National Park", image: archesImage, id: "arch" },
    {
      name: "Glacier Bay National Park & Preserve",
      image: glacierBayImage,
      id: "glba",
    },
  ];

  const [parks, setParks] = useState([]);
  const { parkData, error, loading } = useGetParks(
    stateCode,
    null,
    parksPerPage
  );

  useEffect(() => {
    const storedParks = localStorage.getItem("parks");
    if (storedParks) {
      setParks(JSON.parse(storedParks));
    } else {
      setParks(defaultParks);
    }
  }, []);

  useEffect(() => {
    if (!stateCode) {
      setParks(defaultParks);
      localStorage.setItem("parks", JSON.stringify(defaultParks));
      return;
    }

    if (!loading) {
      if (
        error ||
        (parkData && (!parkData.data || parkData.data.length === 0))
      ) {
        setParks(defaultParks);
        localStorage.setItem("parks", JSON.stringify(defaultParks));
      } else if (parkData && parkData.data.length > 0) {
        const fetchedParks = parkData.data.slice(0, 3).map((park) => ({
          id: park.parkCode,
          name: park.fullName,
          image:
            park.images && park.images[0] ? park.images[0].url : notFoundImage,
          url: park.url,
        }));
        setParks(fetchedParks);
        localStorage.setItem("parks", JSON.stringify(fetchedParks));
      }
    }
  }, [parkData, loading, error, stateCode]);

  return (
    <div className="home-banner">
      <div className="banner-image"></div>
      <div className="banner-content-container">
        <div className="banner-row">
          <div className="banner-left">
            <p className="banner-subheading">Embrace the beauty</p>
            <h1 className="banner-heading">
              {loading
                ? `Fetching Parks in your State...`
                : state && country === "United States"
                ? `Explore the National Parks in ${state}`
                : "Explore America's National Parks"}
            </h1>
            <Link to="/explore" className="btn btn-lg np-explore-btn">
              Explore Parks
            </Link>
          </div>
          {loading ? (
            ""
          ) : (
            <div className="banner-right">
              {parks.map((park, index) => (
                <Link
                  to={`/park?pCode=${park.id}`}
                  key={index}
                  className={`park-image park-image-${index + 1}`}
                  id={park.id}
                >
                  <img src={park.image} alt={`${park.name} National Park`} />
                  <div className="park-name">{park.name}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
