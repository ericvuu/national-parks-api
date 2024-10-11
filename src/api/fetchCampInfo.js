import axios from "axios";

export const fetchCampInfo = async (qCampID) => {
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const apiUrl = `https://developer.nps.gov/api/v1/campgrounds?api_key=${npsAPIKeys}&id=${qCampID}`;
  const res = await axios.get(apiUrl);
  if (res.status === 200 && res.data.data.length > 0) {
    return res.data.data[0];
  }
  throw new Error("Failed to fetch location");
};
