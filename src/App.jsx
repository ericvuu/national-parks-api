import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useGeoLocation from "./hooks/useGeoLocation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Explore from "./pages/Explore";
import "./App.scss";

function App() {
  const { city, country, region, regionCode } = useGeoLocation();
  const npsAPIKeys = import.meta.env.VITE_NPS_API_Keys;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Home city={city} country={country} state={region} stateCode={regionCode}/>}
        />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
