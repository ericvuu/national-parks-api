import axios from "axios";

export const fetchCamps = async ({ queryKey, pageParam = 1 }) => {
  const [_, stateCode, searchTerm, campsPerPage] = queryKey;
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const startCount = pageParam;

  const apiUrl = `https://developer.nps.gov/api/v1/campgrounds?api_key=${npsAPIKeys}${stateCode ? `&stateCode=${stateCode}` : ""}${searchTerm ? `&q=${searchTerm}` : ""}${startCount ? `&start=${startCount}` : ""}${campsPerPage? `&limit=${campsPerPage}` : ""}`;

  const res = await axios.get(apiUrl);
  if (res.status !== 200) {
    throw new Error("Failed to fetch camps");
  }

  return res.data;
};
