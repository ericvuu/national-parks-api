import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import defaultBanner from "../assets/images/park-banner.jpg";

import useGetPark from "../hooks/useGetPark";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Park = () => {
  const [park, setPark] = useState(null);
  const query = useQuery();
  const qPCode = query.get("pCode");
  const [fullName, setfullName] = useState("");
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
      setAddresses(fetchedPark.addresses);
      setContacts(fetchedPark.contacts);
      setActivites(fetchedPark.activities);
      setOperatingHours(fetchedPark.operatingHours);
      setImages(fetchedPark.images.shift());

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
    </div>
  );
};

export default Park;
