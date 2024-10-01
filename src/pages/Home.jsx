import { useState } from "react";
import HomeBanner from "../components/HomeBanner";

const Home = ( { city, country, state, stateCode }) => {
  return (
    <div>
      <HomeBanner city={city} country={country} state={state} stateCode={stateCode} />
    </div>
  );
};

export default Home;
