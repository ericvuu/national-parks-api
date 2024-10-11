import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import defaultBanner from "../assets/images/park-banner.jpg";
import LeafletMap from "../components/LeafletMap";

import { fetchParkInfo } from "../api/fetchParkInfo";

const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

const Park = () => {
  const query = useQueryParams();
  const qPCode = query.get("pCode");

  const { data: parkData, error, isLoading } = useQuery({
    queryKey: ["parks", qPCode],
    queryFn: () => fetchParkInfo(qPCode),
    enabled: !!qPCode,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const {
    fullName,
    description,
    weatherInfo: weather,
    directionsUrl,
    latitude,
    longitude,
    contacts = {},
    activities = [],
    topics = [],
    operatingHours = [],
    images = [],
  } = parkData;

  const bannerImage = images[0]?.url || defaultBanner;
  const cords = [latitude, longitude];
  const emails = contacts.emailAddresses || [];
  const phoneNumbers = contacts.phoneNumbers || [];

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
              <LeafletMap position={cords} park={fullName} />
            ) : (
              <div>Coordinates not available.</div>
            )}
          </div>
        </div>
        <div className="activities-container">
          <div className="image-container">
            {images[0] && <img src={images[0].url} alt={images[0].altText} />}
          </div>
          <div className="activities-content">
            <h3>Activities</h3>
            <p className="subheading">Things To Do</p>
            <div className="content">
              <p>
                {activities.length > 0
                  ? activities.map(activity => activity.name).join(", ")
                  : "Information not available"}
              </p>
            </div>
          </div>
        </div>
        <div className="topics-container">
          <div className="topics-content">
            <h3>Topics</h3>
            <p className="subheading">Things To Explore</p>
            <div className="content">
              <p>
                {topics.length > 0
                  ? topics.map(topic => topic.name).join(", ")
                  : "Information not available"}
              </p>
            </div>
          </div>
          <div className="image-container">
            {images[1] && <img src={images[1].url} alt={images[1].altText} />}
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
                {operatingHours.map((park, index) => (
                  <div key={index} className="park-info">
                    <h4 className="park-name">{park.name}</h4>
                    {park.description && (
                      <p className="park-description">{park.description}</p>
                    )}
                    <div className="operating-hours">
                      <div className="hours-row">
                        {Object.entries(park.standardHours).map(
                          ([day, hours], dayIndex) => (
                            <span key={dayIndex} className="hours-day">
                              <span className="day">{`${day.charAt(0).toUpperCase() + day.slice(1)}`}</span>: {`${hours}`}
                            </span>
                          )
                        )}
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

export default Park;
