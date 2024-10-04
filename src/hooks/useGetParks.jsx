import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetParks(stateCode, searchTerm, limit, currentPage = 1) {
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const [parkData, setParkData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getParks();
  }, [stateCode, searchTerm, limit, currentPage]);

  async function getParks() {
    const parksPerPage = limit;
    const startCount = (currentPage - 1) * parksPerPage + 1;

    setLoading(true);

    try {
      const apiUrl = `https://developer.nps.gov/api/v1/parks?api_key=${npsAPIKeys}${stateCode ? `&stateCode=${stateCode}` : ''}${searchTerm ? `&q=${searchTerm}` : ''}&start=${startCount}&limit=${parksPerPage}`;
      const res = await axios.get(apiUrl);

      if (res.status === 200) {
        setParkData(res.data);
        setError(null);
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
    parkData,
    error,
    loading,
  };
}
