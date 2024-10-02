import React from "react";
import { Link } from "react-router-dom";
import camping from "../assets/camping.svg";
import hiking from "../assets/hiking.svg";
import wildlifeWatching from "../assets/wildlife-watching.svg";

const Adventure = ({ city, country, state, stateCode }) => {
  return (
    <div className="adventure-section">
      <h2 className="section-title">Choose Your Adventure</h2>
      <div className="cards-container">
        <Link to="/explore?activity=camping" className="card-link">
          <div className="card">
            <img src={camping} alt="Camping Adventure" />
            <div className="card-title">Camping</div>
          </div>
        </Link>

        <Link to="/explore?activity=hiking" className="card-link">
          <div className="card">
            <img src={hiking} alt="Hiking Adventure" />
            <div className="card-title">Hiking</div>
          </div>
        </Link>

        <Link to="/explore?activity=wildlife-watching" className="card-link">
          <div className="card">
            <img src={wildlifeWatching} alt="Wildlife Watching Adventure" />
            <div className="card-title">Wildlife Watching</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Adventure;
