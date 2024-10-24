import axios from "axios";
import notFoundImage from "../assets/images/banners/not-found.jpg";

export const fetchParks = async ({ queryKey, pageParam}) => {
  const [_, qStateCode, qSearchTerm, parksPerPage, formattedActivity] = queryKey;
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  const startCount = pageParam || 0;

  const apiUrl = `https://developer.nps.gov/api/v1/parks?api_key=${npsAPIKeys}${qStateCode ? `&stateCode=${qStateCode}` : ""}${qSearchTerm ? `&q=${qSearchTerm}` : ""}${startCount ? `&start=${startCount}` : ""}${parksPerPage ? `&limit=${parksPerPage}` : ""}`;

  const res = await axios.get(apiUrl);

  if (res.status !== 200) {
    throw new Error("Failed to fetch parks");
  }

  let parksData = res.data.data;
  let parksBatchCount = parksData.length;

  if (formattedActivity && typeof formattedActivity === "string") {
    parksData = parksData.filter((park) =>
      park.activities.some(
        (act) => act.name.toLowerCase() === formattedActivity.toLowerCase()
      )
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
    start: res.data.start,
    total: res.data.total,
    batch: parksBatchCount
  };
};
