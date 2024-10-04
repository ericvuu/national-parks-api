import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import yosemiteImage from "../assets/images/banners/yosemite.jpg";
import archesImage from "../assets/images/banners/arches.jpg";
import glacierBayImage from "../assets/images/banners/glacier-bay.jpg";
import notFoundImage from "../assets/images/banners/not-found.jpg";

import useGetParks from "../hooks/useGetParks";

const HomeBanner = ({ city, country, state, stateCode }) => {
  const defaultParks = [
    { name: "Yosemite", image: yosemiteImage, id: "yose" },
    { name: "Arches National Park", image: archesImage, id: "arch" },
    { name: "Glacier Bay National Park & Preserve", image: glacierBayImage, id: "glba" },
  ];

  const [parks, setParks] = useState(defaultParks);
  const { parkData, error, loading } = useGetParks(stateCode);
    useEffect(() => {
      if (parkData && parkData.data) {
        const fetchedParks = parkData.data.map((park, index) => {
            if (index < 3) {
              return {
                id: park.parkCode,
                name: park.fullName,
                image: park.images && park.images[0] ? park.images[0].url : notFoundImage,
                url: park.url,
              };
            }
            return null;
          })
          .filter(Boolean);

        setParks(fetchedParks);
      }
    }, [parkData]);


  return (
    <>
      <div className="home-banner">
        <div className="banner-container">
          <div className="banner-row">
            <div className="banner-left">
              <p className="banner-subheading">Embrace the beauty</p>
              <h1 className="banner-heading">
                {state && country == "United States"
                  ? `Explore the National Parks in ${state}`
                  : "Explore America's National Parks"}
              </h1>
              <Link to="/explore" className="btn btn-lg np-explore-btn">
                Explore Parks
              </Link>
            </div>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeBanner;
