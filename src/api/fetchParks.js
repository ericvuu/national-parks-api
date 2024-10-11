import axios from "axios";
import notFoundImage from "../assets/images/banners/not-found.jpg";

export const fetchParks = async ({ queryKey }) => {
  const [_, qStateCode, qSearchTerm, currentPage, parksPerPage, formattedActivity] = queryKey;
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const startCount = (currentPage - 1) * parksPerPage + 1;

  const apiUrl = `https://developer.nps.gov/api/v1/parks?api_key=${npsAPIKeys}${qStateCode ? `&stateCode=${qStateCode}` : ''}${qSearchTerm ? `&q=${qSearchTerm}` : ''}${startCount ? `&start=${startCount}` : ''}&limit=${parksPerPage}`;

  const res = await axios.get(apiUrl);

  if (res.status !== 200) {
    throw new Error("Failed to fetch parks");
  }

  let parksData = res.data.data;

  if (formattedActivity) {
    parksData = parksData.filter((park) =>
      park.activities.some((act) => act.name.toLowerCase() === formattedActivity.toLowerCase())
    );
  }

  return {
    parks: parksData.map((park) => ({
      parkID: park.id,
      name: park.fullName,
      parkCode: park.parkCode,
      image: park.images && park.images[0] ? park.images[0].url : notFoundImage,
      url: park.url,
    })),
    total: res.data.total,
  };
};
