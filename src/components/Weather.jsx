import React from "react";

import clear from "../assets/images/weather/clear-day.svg";
import cloudy from "../assets/images/weather/cloudy.svg";
import haze from "../assets/images/weather/haze.svg";
import rain1 from "../assets/images/weather/rainy-1.svg";
import rain2 from "../assets/images/weather/rainy-2.svg";
import rain3 from "../assets/images/weather/rainy-3.svg";
import rainSleet from "../assets/images/weather/rain-and-sleet-mix.svg";
import rainFreeze from "../assets/images/weather/rain-and-snow-mix.svg";
import snow1 from "../assets/images/weather/snowy-1.svg";
import snow2 from "../assets/images/weather/snowy-2.svg";
import snow3 from "../assets/images/weather/snowy-3.svg";
import thunderstorms from "../assets/images/weather/thunderstorms.svg";
import fog from "../assets/images/weather/fog.svg";

const weatherCodeMapper = {
  0: { condition: "Clear sky", imagePath: clear },
  1: { condition: "Mainly clear", imagePath: clear },
  2: { condition: "Partly cloudy", imagePath: cloudy },
  3: { condition: "Overcast", imagePath: haze },
  45: { condition: "Fog", imagePath: fog },
  48: { condition: "Depositing rime fog", imagePath: haze },
  51: { condition: "Drizzle: Light intensity", imagePath: rain1 },
  53: { condition: "Drizzle: Moderate intensity", imagePath: rain1 },
  55: { condition: "Drizzle: Dense intensity", imagePath: rain1 },
  56: { condition: "Freezing drizzle: Light intensity", imagePath: rainSleet },
  57: { condition: "Freezing drizzle: Dense intensity", imagePath: rainSleet },
  61: { condition: "Rain: Slight intensity", imagePath: rain2 },
  63: { condition: "Rain: Moderate intensity", imagePath: rain2 },
  65: { condition: "Rain: Heavy intensity", imagePath: rain3 },
  66: { condition: "Freezing rain: Light intensity", imagePath: rainFreeze },
  67: { condition: "Freezing rain: Heavy intensity", imagePath: rainFreeze },
  71: { condition: "Snowfall: Slight intensity", imagePath: snow1 },
  73: { condition: "Snowfall: Moderate intensity", imagePath: snow2 },
  75: { condition: "Snowfall: Heavy intensity", imagePath: snow3 },
  77: { condition: "Snow grains", imagePath: snow1 },
  80: { condition: "Rain showers: Slight intensity", imagePath: rain2 },
  81: { condition: "Rain showers: Moderate intensity", imagePath: rain2 },
  82: { condition: "Rain showers: Violent intensity", imagePath: rain3 },
  85: { condition: "Snow showers: Slight intensity", imagePath: snow2 },
  86: { condition: "Snow showers: Heavy intensity", imagePath: snow3 },
  95: { condition: "Thunderstorm: Slight or moderate", imagePath: thunderstorms },
  96: { condition: "Thunderstorm with slight hail", imagePath: thunderstorms },
  99: { condition: "Thunderstorm with heavy hail", imagePath: thunderstorms },
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

const Weather = ({ day, code, min, max }) => {
  const weather = weatherCodeMapper[code];

  if (weather) {
    const formattedDate = formatDate(day);
    return (
      <div className="weather">
        <h4>{formattedDate}</h4>
       <div className="daily-stats">
         <img className="weather-icon" src={weather.imagePath} alt={weather.condition} />
          <p className="temp-range">L:{min}° <br /> H:{max}°</p>
       </div>
      </div>
    );
  } else {
    return <div className="weather">Weather data not available</div>;
  }
};

export default Weather;
