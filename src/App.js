import React from "react";
import "./styles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MapChart from "./MapChart";
import NavBar from "./NavBar.js"
import Result from "./Result.js";
import Standing from "./Standing.js";
import Footer from "./Footer.js"
import Sprint from "./Sprint.js"
import Constructors from './Constructors.js'

export default function App() {
  return (
    <div>
      <NavBar />
      <div className="content-body">
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<MapChart />} />
          <Route path="/result" element={<Result />} />
          <Route path="/sprint" element={<Sprint />} />
          <Route path="/standing" element={<Standing />} />
          <Route path="/constructor" element={<Constructors />} />
        </Routes>
      </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}


