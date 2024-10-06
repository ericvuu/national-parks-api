import React from "react";
import { Link } from "react-router-dom";

const Card = ({parkUrl, imageUrl, title, parkCode}) => {

  return (
    <Link to={parkUrl} className="park-card">
      <button className="park-image">
        <img src={imageUrl} alt={title} />
        <h3 className="park-name">{title}</h3>
      </button>
    </Link>
  );
};

export default Card;
