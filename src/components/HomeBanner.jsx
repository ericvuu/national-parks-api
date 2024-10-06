import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import yosemiteImage from "../assets/images/banners/yosemite.jpg";
import archesImage from "../assets/images/banners/arches.jpg";
import glacierBayImage from "../assets/images/banners/glacier-bay.jpg";
import notFoundImage from "../assets/images/banners/not-found.jpg";

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

  const [parks, setParks] = useState(defaultParks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParks = async () => {
      if (!stateCode) {
        setParks(defaultParks);
        setLoading(false);
        return;
      }

      setLoading(true);
      const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;

      try {
        const apiUrl = `https://developer.nps.gov/api/v1/parks?api_key=${npsAPIKeys}&stateCode=${stateCode}&limit=${parksPerPage}`;
        const res = await axios.get(apiUrl);

        if (res.status === 200) {
          const fetchedParks = res.data.data.slice(0, parksPerPage).map((park) => ({
            id: park.parkCode,
            name: park.fullName,
            image: park.images && park.images[0] ? park.images[0].url : notFoundImage,
          }));
          setParks(fetchedParks);
        } else {
          setParks(defaultParks);
        }
      } catch (err) {
        setError(err.message);
        setParks(defaultParks);
      } finally {
        setLoading(false);
      }
    };

    fetchParks();
  }, [stateCode]);

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
          <div className="banner-right">
            {loading ? (
              <p>Loading parks...</p>
            ) : (
              parks.map((park, index) => (
                <Link
                  to={`/park?pCode=${park.id}`}
                  key={index}
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
