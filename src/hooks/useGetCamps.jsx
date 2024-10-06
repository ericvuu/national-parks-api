import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetCamps(
  stateCode,
  searchTerm,
  limit,
  currentPage = 1
) {
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const [campData, setcampData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getcamps();
  }, [stateCode, searchTerm, limit, currentPage]);

  async function getcamps() {
    const campsPerPage = limit;
    const startCount = (currentPage - 1) * campsPerPage + 1;

    setLoading(true);

    try {
      const apiUrl = `https://developer.nps.gov/api/v1/campgrounds?api_key=${npsAPIKeys}${
        stateCode ? `&stateCode=${stateCode}` : ""
      }${
        searchTerm ? `&q=${searchTerm}` : ""
      }&start=${startCount}&limit=${campsPerPage}`;
      const res = await axios.get(apiUrl);

      if (res.status === 200) {
        setcampData(res.data);
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
    campData,
    error,
    loading,
  };
}
