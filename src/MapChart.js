import React, { useState, useEffect } from "react";
import Tooltip from '@mui/material/Tooltip';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from "react-simple-maps";
const geoUrl = "/features.json";

const MapChart = () => {
    const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
    const [next, setNext] = useState("");

    const [winner, setWinner] = useState([]);


    const [race, setRace] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [clickedMarker, setClickedMarker] = useState(null);

    useEffect(() => {
        axios.get("https://ergast.com/api/f1/current.json")
            .then(response => {
                //console.log(response.data.MRData);
            })
            .catch(error => {
                console.log(error);
            });

    },

        []);


    useEffect(() => {
        axios.get("https://ergast.com/api/f1/current/next.json")
            .then(response => {
                //console.log(response.data.MRData);
                setNext(response.data.MRData.RaceTable.Races);
                console.log(response.data.MRData.RaceTable.Races);

                //setMarkers2(race.RaceTable.Races);
            })
            .catch(error => {
                console.log(error);
            });


    }

        , []);


    useEffect(() => {
        axios.get("https://ergast.com/api/f1/current/results/1.json")
            .then(response => {
                console.log(response.data.MRData);
                setWinner(response.data.MRData.RaceTable.Races);
                //console.log(response.data.MRData);

                //setMarkers2(race.RaceTable.Races);
            })
            .catch(error => {
                console.log(error);
            });


    }

        , []);


    useEffect(() => {
        axios.get("https://ergast.com/api/f1/current.json")
            .then(response => {
                setRace(response.data.MRData.RaceTable.Races);
            })
            .catch(error => {
                console.log(error);
            });
    }
        , []);








    useEffect(() => {
        console.log(race);
        setMarkersMap(race);
    }, [race]);








    const [markers, setMarkers] = useState([]);

    function setMarkersMap(races) {
        const currentDate = new Date();
        const newMarkers = races.map((race) => {
            const raceDate = new Date(`${race.date}T${race.time}`);
            const hasRaceHappened = currentDate > raceDate;
            const color = hasRaceHappened ? "#F53" : "#00FF00";

            let logo_path = race.Circuit.circuitName.split(' ').join('-');
            //console.log(logo_path); 
            const logos = process.env.PUBLIC_URL + './assets/' + `${logo_path}` + '.png';

            return {
                coordinates: [parseFloat(race.Circuit.Location.long), parseFloat(race.Circuit.Location.lat)],
                tooltipText: race.Circuit.circuitName,
                color: color,
                date: race.date,
                round: race.round,
                map: logos,
                hasHappend: hasRaceHappened
            };
        });
        setMarkers(newMarkers);
    }

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


    
    

    return (
        <div>
            <div className="nextRace">
                {next && next.length > 0 &&<h2>F1 Season {next[0].season}</h2>}
                {next && next.length > 0 && <p>Next race is {next[0].raceName}</p>}
                {next && next.length > 0 && <p>Round {next[0].round}</p>}
                {next && next.length > 0 && <p>{next[0].date} , {next[0].time.slice(0, -4)} </p>}
            </div>


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

            <br></br>
            <ComposableMap>
                <ZoomableGroup
                    zoom={position.zoom}
                    center={position.coordinates}
                    onMoveEnd={handleMoveEnd}
                >
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography key={geo.rsmKey} geography={geo} style={{
                                    default: {
                                        outline: 'none'
                                    },
                                    hover: {
                                        outline: 'none'
                                    },
                                    pressed: {
                                        outline: 'none'
                                    }
                                }} />
                            ))
                        }
                    </Geographies>
                    {markers.map(({ coordinates, tooltipText, color, date, round, map, hasHappend }) => (
                        <Tooltip key={round} title={tooltipText}>
                            <Marker
                                key={`${coordinates[0]}-${coordinates[1]}`}
                                coordinates={coordinates}
                                onClick={() => {
                                    setClickedMarker({ coordinates, tooltipText, color, date, round, map, hasHappend });
                                    setShowModal(true);
                                }}
                            >
                                <circle r={4} fill={color} />
                                <text textAnchor="middle" fill="black" fontSize="6px" fontFamily="Arial" dy=".3em">{round}</text>

                            </Marker>
                        </Tooltip>
                    ))}

                </ZoomableGroup>
            </ComposableMap>

            
           
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>{clickedMarker?.tooltipText}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Round: {clickedMarker?.round}</p>
                    <p>Date: {clickedMarker?.date}</p>
                    <p>{clickedMarker?.hasHappend}</p>
                    {clickedMarker?.hasHappend && (
                        <p>Winner: {winner[clickedMarker?.round - 1].Results[0].Driver.givenName} {winner[clickedMarker?.round - 1].Results[0].Driver.familyName}</p>
                    )}
                    {clickedMarker?.hasHappend && (
                        <p><a href="/result">See full result</a></p>
                    )}
                    <img src={clickedMarker?.map} alt="track" className="modal-image"></img>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MapChart;
