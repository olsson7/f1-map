
import React from "react";
import ReactDOM from "react-dom/client";

import "./styles.css";

import MapChart from "./MapChart";

function App() {
  return (
    <div>
      <MapChart />
    </div>
  );
}




const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

