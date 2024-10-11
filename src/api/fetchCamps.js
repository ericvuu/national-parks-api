import axios from "axios";

export const fetchCamps = async ({ queryKey }) => {
  const [_, stateCode, searchTerm, page, campsPerPage] = queryKey;
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const startCount = (page - 1) * campsPerPage + 1;

  const apiUrl = `https://developer.nps.gov/api/v1/campgrounds?api_key=${npsAPIKeys}${stateCode ? `&stateCode=${stateCode}` : ""}${searchTerm ? `&q=${searchTerm}` : ""}&start=${startCount}&limit=${campsPerPage}`;

  const res = await axios.get(apiUrl);
  if (res.status !== 200) {
    throw new Error("Failed to fetch camps");
  }

  return res.data;
};
