import axios from "axios";
import { useEffect, useState } from "react";

export default function useGeoLocation() {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  async function getLocation() {
    try {
      const res = await axios.get("http://ip-api.com/json");
      if (res.status === 200) {
        setLocationData(res.data);
      } else {
        setError("Failed to fetch location");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    city: locationData?.city,
    country: locationData?.country,
    countryCode: locationData?.countryCode,
    lat: locationData?.lat,
    lon: locationData?.lon,
    region: locationData?.regionName,
    regionCode: locationData?.region,
    timezone: locationData?.timezone,
    zip: locationData?.zip,
    loading,
    error,
  };
}
