import HomeBanner from "../components/HomeBanner";
import Adventure from "../components/Adventure";
import HomeForm from "../components/HomeForm";

const Home = ( { city, country, state, stateCode }) => {
  return (
    <>
      <HomeBanner city={city} country={country} state={state} stateCode={stateCode} />
      <div className="container-fluid">
        <Adventure/>
        <HomeForm uState={stateCode}/>
      </div>
    </>
  );
};

export default Home;
