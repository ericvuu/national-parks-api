import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetPark(parkCode) {
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const [parkData, setParkData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (parkCode) {
      getParkInfo(parkCode);
    }
  }, [parkCode]);

  async function getParkInfo() {
    try {
      const res = await axios.get(
        `https://developer.nps.gov/api/v1/parks?&api_key=${npsAPIKeys}&parkCode=${parkCode}`
      );
      if (res.status === 200) {
        setParkData(res.data);
      } else {
        setError("Failed to fetch location");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    parkData,
  };
}
