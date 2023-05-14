import React from "react";
import "./styles.css";

import MapChart from "./MapChart";
import NavBar from "./NavBar.js"

export default function App() {
  return (
    <div>
      <NavBar />
                  <h1> F1 World map!</h1>
      <MapChart  />

    </div>
  );
}
