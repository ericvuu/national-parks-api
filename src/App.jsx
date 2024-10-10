import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useGeoLocation from "./hooks/useGeoLocation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Explore from "./pages/Explore";
import Park from "./pages/Park";
import CampFinder from "./pages/CampFinder";
import Camp from "./pages/Camp";
import ScrollToTop from "./components/ScrollToTop";

import "./App.scss";

const queryClient = new QueryClient();

function App() {
  const { location, loading, error } = useGeoLocation();
  const { city, country, state, stateCode } = location || {};

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Home city={city} country={country} state={state} stateCode={stateCode} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/park" element={<Park />} />
          <Route path="/campgrounds" element={<CampFinder />} />
          <Route path="/camp" element={<Camp />} />
        </Routes>
        <Footer />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
