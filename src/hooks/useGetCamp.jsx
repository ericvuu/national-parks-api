import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetCamp(campID) {
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const [campData, setCampData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (campID) {
      getCampInfo(campID);
    }
  }, [campID]);

  async function getCampInfo() {
    setLoading(true);

    try {
      const apiUrl = `https://developer.nps.gov/api/v1/campgrounds?api_key=${npsAPIKeys}&id=${campID}`;
      const res = await axios.get(apiUrl);
      if (res.status === 200) {
        setCampData(res.data);
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
    campData,
    error,
    loading,
  };
}
