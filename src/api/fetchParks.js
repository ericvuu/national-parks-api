import axios from "axios";
import notFoundImage from "../assets/images/banners/not-found.jpg";

export const fetchParks = async ({ queryKey, pageParam }) => {
  const [_, qStateCode, qSearchTerm, parksPerPage, formattedActivity] = queryKey;
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;
  let startCount = pageParam || 0;
  let parksData = [];
  let totalFetched = 0;
  let totalParks = 0;

  while (parksData.length < parksPerPage) {
    const apiUrl = `https://developer.nps.gov/api/v1/parks?api_key=${npsAPIKeys}${qStateCode ? `&stateCode=${qStateCode}` : ""}${qSearchTerm ? `&q=${qSearchTerm}` : ""}&start=${startCount}&limit=${parksPerPage}`;
    const res = await axios.get(apiUrl);

    if (res.status !== 200) {
      throw new Error("Failed to fetch parks");
    }

    const fetchedParksBatch = res.data.data;
    totalParks = res.data.total;

    const filteredParks = formattedActivity
      ? fetchedParksBatch.filter(park =>
          park.activities.some(
            act => act.name.toLowerCase() === formattedActivity.toLowerCase()
          )
        )
      : fetchedParksBatch;

    parksData = parksData.concat(filteredParks);
    totalFetched += fetchedParksBatch.length;

    startCount += fetchedParksBatch.length;

    if (fetchedParksBatch.length < parksPerPage) break;
  }

  const excessParks = parksData.length - parksPerPage;
  if (excessParks > 0) {
    startCount -= excessParks;
    parksData = parksData.slice(0, parksPerPage);
  }

  return {
    parks: parksData.map((park) => ({
      parkID: park.id,
      name: park.fullName,
      parkCode: park.parkCode,
      image: park.images && park.images[0] ? park.images[0].url : notFoundImage,
      url: park.url,
    })),
    start: startCount,
    total: totalParks,
    batch: formattedActivity ? totalFetched : 0,
  };
};
