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
  const [emails, setEmails] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [topics, setTopics] = useState([]);
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
      setEmails(fetchedPark.contacts.emailAddresses);
      setPhoneNumbers(fetchedPark.contacts.phoneNumbers);
      setActivities(fetchedPark.activities);
      setTopics(fetchedPark.topics);
      setOperatingHours(fetchedPark.operatingHours);
      setImages(fetchedPark.images.slice(1));
      setCords([fetchedPark.latitude, fetchedPark.longitude]);
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
                <div className="content">
                  {cords.length === 2 ? (
                    <p className="coordinates">
                      {cords[0]}, {cords[1]}
                    </p>
                  ) : (
                    ""
                  )}
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
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
            {images[0] ? (
              <img src={images[0].url} alt={images[0].altText} />
            ) : (
              ""
            )}
          </div>
          <div className="activities-content">
            <h3>Activities</h3>
            <p className="subheading">Things To Do</p>
            <div className="content">
              <p>
                {activities
                  ? activities.map((activity) => activity.name).join(", ")
                  : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="topics-container">
          <div className="topics-content">
            <h3>Topics</h3>
            <p className="subheading">Things To Do</p>
            <div className="content">
              <p>
                {topics ? topics.map((topic) => topic.name).join(", ") : ""}
              </p>
            </div>
          </div>
          <div className="image-container">
            {images[1] ? (
              <img src={images[1].url} alt={images[1].altText} />
            ) : (
              ""
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
                 {emails
                  ? emails.map((email, index) => (
                      <div key={index} className="email-info">
                        {email.description ? (
                          <p className="email-description">{email.description}</p>
                        ): ""}
                        <p className="email"><a href={`mailto:${email.emailAddress}`}>{email.emailAddress}</a></p>
                      </div>
                    ))
                  : ""}
               </div>
               <div className="phone-block">
                <h4>Phone</h4>
                 {phoneNumbers
                  ? phoneNumbers.map((phone, index) => (
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
                  ))
                  : ""}
               </div>
              </div>
              <div className="right-block">
                  {operatingHours
                  ? operatingHours.map((park, index) => (
                      <div key={index} className="park-info">
                        <h4 className="park-name">{park.name}</h4>
                         {park.description ? (
                          <p className="park-description">{park.description}</p>
                        ): ""}
                        <div className="operating-hours">
                          <div className="hours-row">
                            {Object.entries(park.standardHours).map(([day, hours], dayIndex) => (
                              <span key={dayIndex} className="hours-day">
                                <span className="day">{`${day.charAt(0).toUpperCase() + day.slice(1)}`}</span>: {`${hours}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Park;
