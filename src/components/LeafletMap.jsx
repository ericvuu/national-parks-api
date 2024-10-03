import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const LeafletMap = ({ position, park }) => {
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ minHeight: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
      />

      <Marker position={position} icon={customIcon}>
        <Popup>
          {park} : <br /> Latitude: {position[0]}, Longitude:{" "}
          {position[1]}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default LeafletMap;
