import axios from "axios";

export const fetchWeather = async ({ queryKey }) => {
  const [_, qLatitude, qLongitude ] = queryKey;

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${qLatitude}&longitude=${qLongitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&temperature_unit=fahrenheit&timezone=America%2FNew_York`;

  const res = await axios.get(apiUrl);

  if (res.status !== 200) {
    throw new Error("Failed to fetch weather");
  }

  let weatherForecast = res.data;

  return weatherForecast;
};
