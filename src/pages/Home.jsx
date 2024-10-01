import { useState } from "react";
import HomeBanner from "../components/HomeBanner";
import Adventure from "../components/Adventure";

const Home = ( { city, country, state, stateCode }) => {
  return (
    <>
      <HomeBanner city={city} country={country} state={state} stateCode={stateCode} />
      <div className="container">
        <Adventure/>
      </div>
    </>
  );
};

export default Home;
