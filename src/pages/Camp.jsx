import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import defaultBanner from "../assets/images/camp-banner.jpg";
import LeafletMap from "../components/LeafletMap";
import { fetchCampInfo } from "../api/fetchCampInfo";
import { fetchWeather } from "../api/fetchWeather";

import Weather from "../components/Weather";

const useURLQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const formatCampValues = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not Available";
  }
  return value || "Not Available";
};

const Camp = () => {
  const query = useURLQuery();
  const qCampID = query.get("cID");

  const {
    data: campData = {},
    error,
    isLoading,
  } = useQuery({
    queryKey: ["campground", qCampID],
    queryFn: () => fetchCampInfo(qCampID),
    enabled: !!qCampID,
  });

  const {
    name: fullName,
    description,
    weatherOverview: weather,
    directionsUrl,
    latitude,
    longitude,
    contacts = {},
    amenities = [],
    campsites = [],
    operatingHours = [],
    images = [],
  } = campData;

  const qLatitude = latitude || 0;
  const qLongitude = longitude || 0;

  const {
    data: weatherForecast = {},
    error: wError,
    isLoading: wIsLoading,
  } = useQuery({
    queryKey: ["weatherForecast", qLatitude, qLongitude],
    queryFn: fetchWeather,
    enabled: !!qLatitude && !!qLongitude,
  });

  if (!weatherForecast || !weatherForecast.daily) {
    return null;
  }

  const {
    daily: {
      temperature_2m_max: maxTemps,
      temperature_2m_min: minTemps,
      time: days,
      weathercode: weatherCodes,
    },
  } = weatherForecast;

  const forecasts = days.map((day, index) => {
    return {
      day: day,
      maxTemp: maxTemps[index],
      minTemp: minTemps[index],
      weatherCode: weatherCodes[index],
    };
  });

  if (isLoading) return <div className="status">Loading...</div>;
  if (error) return <div className="status">Error: {error.message}</div>;

  const bannerImage = images[0]?.url || defaultBanner;
  const cords = [latitude, longitude];
  const emails = contacts.emailAddresses || [];
  const phoneNumbers = contacts.phoneNumbers || [];

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
              <div className="plan-trip-info">
                <div className="forecast-section">
                  <div className="forecast">
                    {forecasts.map((forecast, index) => {
                      return (
                        <Weather
                          key={index}
                          day={forecast.day}
                          code={forecast.weatherCode}
                          min={forecast.minTemp}
                          max={forecast.maxTemp}
                        />
                      );
                    })}
                  </div>
                </div>
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
            {images[1] ? (
              <img src={images[1].url} alt={images[1].altText} />
            ) : (
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
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </strong>{" "}
                  {formatCampValues(value)}
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
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </strong>{" "}
                  {formatCampValues(value)}
                </p>
              ))}
            </div>
          </div>
          <div className="image-container">
            {images[2] ? (
              <img src={images[2].url} alt={images[2].altText} />
            ) : (
              <img src={images[0].url} alt={images[0].altText} />
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
                            ? `(${phone.phoneNumber.slice(
                                0,
                                3
                              )}) ${phone.phoneNumber.slice(
                                3,
                                6
                              )}-${phone.phoneNumber.slice(6)}`
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
                        {Object.entries(camp.standardHours).map(
                          ([day, hours], dayIndex) => (
                            <span key={dayIndex} className="hours-day">
                              <span className="day">{`${
                                day.charAt(0).toUpperCase() + day.slice(1)
                              }`}</span>
                              : {`${hours}`}
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

export default Camp;
