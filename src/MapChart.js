import React, { useState } from "react";
import Tooltip from '@mui/material/Tooltip';

import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from "react-simple-maps";

const geoUrl = "/features.json";

const markers = [
    {
        coordinates: [-80.1918, 25.7617],
        tooltipText: "Miami"
    },
    {
        coordinates: [2.3522, 48.8566],
        tooltipText: "Paris"
    },
    {
        coordinates: [139.6917, 35.6895],
        tooltipText: "Tokyo"
    }
];

const MapChart = () => {
    const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
    const [tooltipText, setTooltipText] = useState("");

    function handleZoomIn() {
        if (position.zoom >= 4) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.33 }));
    }

    function handleZoomOut() {
        if (position.zoom <= 1) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.33 }));
    }

    function handleMoveEnd(position) {
        setPosition(position);
    }

    function handleMarkerMouseEnter() {
        setTooltipText("Miami");
    }

    function handleMarkerMouseLeave() {
        setTooltipText("");
    }

    return (
        <div>
            <h1> F1 World map!</h1>
            <ComposableMap>
                <ZoomableGroup
                    zoom={position.zoom}
                    center={position.coordinates}
                    onMoveEnd={handleMoveEnd}
                >
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography key={geo.rsmKey} geography={geo} />
                            ))
                        }
                    </Geographies>
                    {markers.map(({ coordinates, tooltipText }) => (
                        <Tooltip title={tooltipText}>
                            <Marker
                                key={`${coordinates[0]}-${coordinates[1]}`}
                                coordinates={coordinates}
                                onMouseEnter={() => handleMarkerMouseEnter(tooltipText)}
                                onMouseLeave={handleMarkerMouseLeave}
                                onClick={() => console.log(`Marker clicked: ${tooltipText}`)}
                                >
                                <circle r={3} fill="#F53" />
                            </Marker>
                        </Tooltip>
                    ))}

                </ZoomableGroup>
            </ComposableMap>
            <div className="controls">
                <button onClick={handleZoomIn}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
                <button onClick={handleZoomOut}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                    >
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MapChart;
