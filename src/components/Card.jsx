import React from "react";
import { Link } from "react-router-dom";

const Card = ({ title, imageUrl, parkCode}) => {
   const viewPark = () => {
     console.log(parkCode);
   };

  return (
    <div className="park-card" onClick={() => viewPark(parkCode)}>
      <button className="park-image">
        <img src={imageUrl} alt={title} />
        <h3 className="park-name">{title}</h3>
      </button>
    </div>
  );
};

export default Card;
