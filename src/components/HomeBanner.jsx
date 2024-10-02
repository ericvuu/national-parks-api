import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import yosemiteImage from "../assets/images/banners/yosemite.jpg";
import canyonlandsImage from "../assets/images/banners/canyonlands.jpg";
import westglacierImage from "../assets/images/banners/west-glacier.jpg";
import notFoundImage from "../assets/images/banners/not-found.jpg";

import useGetParks from "../hooks/useGetParks";

const HomeBanner = ({ city, country, state, stateCode }) => {
  const defaultParks = [
     { name: "Yosemite", image: yosemiteImage, url: "" },
     { name: "Canyonlands", image: canyonlandsImage, url: "" },
     { name: "West Glacier", image: westglacierImage, url: "" },
   ];

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const [parks, setParks] = useState(defaultParks);
  const { parkData, error, loading } = useGetParks(stateCode);

   useEffect(() => {
      if (parkData && parkData.data) {
        let fetchedParks = parkData.data;

        if (fetchedParks.length > 3) {
          const shuffledParks = shuffleArray(fetchedParks);

          const newParks = shuffledParks.slice(0, 3).map((park) => ({
            id: park.parkCode,
            name: park.fullName,
            image: park.images && park.images[0] ? park.images[0].url : notFoundImage,
            url: park.url,
          }
        ));
          setParks(newParks);
        }
      }
  }, [parkData]);


  const viewPark = (park) => {
    let parkCode = park.id;
    console.log(parkCode)
  };

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
                  onClick={() => viewPark(park)}
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
