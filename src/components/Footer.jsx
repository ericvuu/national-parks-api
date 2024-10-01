import React from "react";
import Logo from "../assets/logo_white.svg";

const Footer = () => {
  return (
    <footer className="np-footer">
      <div className="container">
        <div className="row">
          <div className="column logo-column">
            <p>
              <img
                className="np-logo"
                src={Logo}
                alt="National Parks logo - footer"
              />
            </p>
          </div>

          <div className="column made-possible-column">
            <p>
              Made with the
              <br />
              <a
                href="https://www.nps.gov/subjects/developer/api-documentation.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                National Park Service API
              </a>
            </p>
          </div>

          <div className="column info-column">
            <p>
              For more information about national parks, upcoming park events,
              anniversaries, and awards, view the{" "}
              <a
                href="https://www.nps.gov/index.htm"
                target="_blank"
                rel="noopener noreferrer"
              >
                National Park Service website
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
