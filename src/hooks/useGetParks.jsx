import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetParks(stateCode, searchTerm, startCount) {
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const [parkData, setParkData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getParks();
  }, [stateCode, searchTerm, startCount]);

  async function getParks() {
    try {
      const apiUrl = `https://developer.nps.gov/api/v1/parks?api_key=${npsAPIKeys}${stateCode ? `&stateCode=${stateCode}` : ''}${searchTerm ? `&q=${searchTerm}` : ''}${startCount ? `&start=${startCount}` : '&start=1'}&limit=10`;

      const res = await axios.get(apiUrl);
      if (res.status === 200) {
        setParkData(res.data);
        setError(null);
      } else {
        setError("Failed to fetch location");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    parkData,
    error,
  };
}
