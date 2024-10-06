import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import defaultBanner from "../assets/images/camp-banner.jpg";
import LeafletMap from "../components/LeafletMap";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const formatCampValues = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not Available";
  }
  return value ? value : "Not Available";
};

const Camp = () => {
  const query = useQuery();
  const qCampID = query.get("cID");
  const [campData, setCampData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [weather, setWeather] = useState("");
  const [directionsUrl, setDirectionsUrl] = useState("");
  const [cords, setCords] = useState([]);
  const [emails, setEmails] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [campsites, setCampSites] = useState([]);
  const [operatingHours, setOperatingHours] = useState([]);
  const [images, setImages] = useState([]);
  const [bannerImage, setBannerImage] = useState(defaultBanner);

  useEffect(() => {
    const getCampInfo = async () => {
      if (!qCampID) return;

      setLoading(true);
      const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;

      try {
        const apiUrl = `https://developer.nps.gov/api/v1/campgrounds?api_key=${npsAPIKeys}&id=${qCampID}`;
        const res = await axios.get(apiUrl);

        if (res.status === 200 && res.data.data.length > 0) {
          setCampData(res.data);
        } else {
          setError("Failed to fetch location");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCampInfo();
  }, [qCampID]);

  useEffect(() => {
    if (campData && campData.data) {
      const fetchedcamp = campData.data[0];
      setBannerImage(fetchedcamp.images[0]?.url || defaultBanner);
      setFullName(fetchedcamp.name);
      setDescription(fetchedcamp.description);
      setDirectionsUrl(fetchedcamp.directionsUrl);
      setWeather(fetchedcamp.weatherOverview);
      setEmails(fetchedcamp.contacts.emailAddresses);
      setPhoneNumbers(fetchedcamp.contacts.phoneNumbers);
      setAmenities(fetchedcamp.amenities);
      setCampSites(fetchedcamp.campsites);
      setOperatingHours(fetchedcamp.operatingHours);
      setImages(fetchedcamp.images.slice(1));
      setCords([fetchedcamp.latitude, fetchedcamp.longitude]);
    }
  }, [campData]);

  return (
    <div className="camp-page page">
      <div
        className="camp-banner"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="banner-content">
          <h1 className="banner-heading">{fullName}</h1>
        </div>
      </div>
      <div className="single-camp-overview">
        <div className="overview-container">
          <div className="info-block">
            <div className="text-wrap">
              <h3>{fullName}</h3>
              <p className="description">{description}</p>
              <p className="weather-info">{weather}</p>
              <div className="get-directions">
                <div className="content">
                  {cords.length === 2 && (
                    <p className="coordinates">
                      {cords[0]}, {cords[1]}
                    </p>
                  )}
                  {directionsUrl && (
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="map">
            {cords.length === 2 ? (
              <LeafletMap position={cords} camp={fullName} />
            ) : (
              <div>Coordinates not available.</div>
            )}
          </div>
        </div>
        <div className="amenities-container">
          <div className="image-container">
            {images[0] && (
              <img src={images[0].url} alt={images[0].altText} />
            )}
          </div>
          <div className="amenities-content">
            <h3>Amenities</h3>
            <p className="subheading">What the park offers</p>
            <div className="content">
              {Object.entries(amenities).map(([key, value]) => (
                <p key={key}>
                  <strong>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                  </strong> {formatCampValues(value)}
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="campsites-container">
          <div className="campsites-content">
            <h3>Campsites</h3>
            <p className="subheading">By the numbers</p>
            <div className="content">
              {Object.entries(campsites).map(([key, value]) => (
                <p key={key}>
                  <strong>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                  </strong> {formatCampValues(value)}
                </p>
              ))}
            </div>
          </div>
          <div className="image-container">
            {images[1] && (
              <img src={images[1].url} alt={images[1].altText} />
            )}
          </div>
        </div>
        <div className="contact-section">
          <div className="card-container">
            <h3>Contact</h3>
            <div className="text-content">
              <div className="left-block">
                <div className="email-block">
                  <h4>Email</h4>
                  {emails.map((email, index) => (
                    <div key={index} className="email-info">
                      {email.description && (
                        <p className="email-description">{email.description}</p>
                      )}
                      <p className="email">
                        <a href={`mailto:${email.emailAddress}`}>
                          {email.emailAddress}
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
                <div className="phone-block">
                  <h4>Phone</h4>
                  {phoneNumbers.map((phone, index) => (
                    <div key={index} className="phone-info">
                      <p>
                        {phone.type}:{" "}
                        <a href={`tel:${phone.phoneNumber}`}>
                          {phone.phoneNumber.length === 10
                            ? `(${phone.phoneNumber.slice(0, 3)}) ${phone.phoneNumber.slice(3, 6)}-${phone.phoneNumber.slice(6)}`
                            : phone.phoneNumber}
                          {phone.extension ? ` ext: ${phone.extension}` : ""}
                        </a>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="right-block">
                {operatingHours.map((camp, index) => (
                  <div key={index} className="camp-info">
                    <h4 className="camp-name">{camp.name}</h4>
                    {camp.description && (
                      <p className="camp-description">{camp.description}</p>
                    )}
                    <div className="operating-hours">
                      <div className="hours-row">
                        {Object.entries(camp.standardHours).map(([day, hours], dayIndex) => (
                          <span key={dayIndex} className="hours-day">
                            <span className="day">{`${day.charAt(0).toUpperCase() + day.slice(1)}`}</span>: {`${hours}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camp;
