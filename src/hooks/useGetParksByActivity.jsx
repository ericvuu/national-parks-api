import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetParksByActivity(activity, currentPage = 1) {
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const [activityParkData, setActivityParkData] = useState([]);
  const [activityParkDataTotal, setActivityParkDataTotal] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getParks();
  }, [activity, currentPage]);

  async function getParks() {
    const parksPerPage = 25;
    const startCount = (currentPage - 1) * parksPerPage + 1;

    try {
      const apiUrl = `https://developer.nps.gov/api/v1/parks?api_key=${npsAPIKeys}&start=${startCount}&limit=${parksPerPage}`;
      const res = await axios.get(apiUrl);

       setLoading(true);

      if (res.status === 200) {
        const filteredParks = res.data.data.filter((park) =>
          park.activities.some((act) => {
            return act.name.toLowerCase() === activity.toLowerCase();
          })
        );

        setActivityParkData(filteredParks);
        setActivityParkDataTotal(res.data.total);
        setError(null);
      } else {
        setError("Failed to fetch parks");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    activityParkData,
    activityParkDataTotal,
    error,
    loading
  };
}
