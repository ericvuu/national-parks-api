import axios from "axios";

export const fetchParkInfo = async (parkCode) => {
  if (!parkCode) throw new Error("Park code is required");
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const res = await axios.get(
    `https://developer.nps.gov/api/v1/parks?&api_key=${npsAPIKeys}&parkCode=${parkCode}`
  );

  if (res.status === 200 && res.data.data.length > 0) {
    return res.data.data[0];
  }
  throw new Error("Failed to fetch park data");
};
