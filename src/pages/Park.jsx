import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import defaultBanner from "../assets/images/park-banner.jpg";
import LeafletMap from "../components/LeafletMap";

import useGetPark from "../hooks/useGetPark";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Park = () => {
  const [park, setPark] = useState(null);
  const query = useQuery();
  const qPCode = query.get("pCode");
  const [fullName, setfullName] = useState("");
  const [description, setDescription] = useState("");
  const [weather, setWeather] = useState("");
  const [directionsUrl, setDirectionsUrl] = useState("");
  const [cords, setCords] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivites] = useState([]);
  const [operatingHours, setOperatingHours] = useState([]);
  const [images, setImages] = useState([]);
  const [bannerImage, setBannerImage] = useState(defaultBanner);


  const { parkData, error, loading } = useGetPark(qPCode);

  useEffect(() => {
    if (parkData && parkData.data) {
      const fetchedPark = parkData.data[0];
      setPark(fetchedPark);
      setBannerImage(fetchedPark.images[0].url);
      setfullName(fetchedPark.fullName);
      setDescription(fetchedPark.description);
      setDirectionsUrl(fetchedPark.directionsUrl);
      setWeather(fetchedPark.weatherInfo);
      setAddresses(fetchedPark.addresses);
      setContacts(fetchedPark.contacts);
      setActivites(fetchedPark.activities);
      setOperatingHours(fetchedPark.operatingHours);
      setImages(fetchedPark.images.shift());
      setCords([fetchedPark.latitude, fetchedPark.longitude]);

      console.log(fetchedPark)
    }
  }, [parkData]);

  return (
    <div className="park-page page">
      <div
        className="park-banner"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="banner-content">
          <h1 className="banner-heading">{fullName}</h1>
        </div>
      </div>
      <div className="single-park-overview">
        <div className="overview-container">
          <div className="info-block">
            <div className="text-wrap">
              <h3>{fullName}</h3>
              <p className="description">{description}</p>
              <p className="weather-info">{weather}</p>
              <div className="get-directions">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">Get Directions</a>
              </div>
            </div>
          </div>
          <div className="map">
            {cords.length === 2 ? (
              <LeafletMap position={cords} park={fullName} />
            ) : (
              <div>Coordinates not available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Park;
