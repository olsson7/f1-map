import React, { useState, useEffect, Component } from "react";
import Tooltip from '@mui/material/Tooltip';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { format } from 'date-fns';
import FlipCountdown from '@rumess/react-flip-countdown';

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
    const [markers, setMarkers] = useState([]);
    const [videos, setVideos] = useState([]);
    const [isSmallScreen, setIsSmallScreen] = useState(false);



    const fetchVideos = async () => {
        try {
            const response = await axios.get(
                "https://www.googleapis.com/youtube/v3/playlistItems",
                {
                    params: {
                        part: "snippet",
                        playlistId: "PLfoNZDHitwjX-oU5YVAkfuXkALZqempRS",
                        key: process.env.REACT_APP_YOUTUBE_API_KEY,
                        maxResults: 25,
                    },
                }
            );
            console.log(response.data.items);
            setVideos(response.data.items);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };



    //Get next race
    useEffect(() => {
        axios.get("https://ergast.com/api/f1/current/next.json")
            .then(response => {
                setNext(response.data.MRData.RaceTable.Races);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    //Get winner from each race
    useEffect(() => {
        axios.get("https://ergast.com/api/f1/current/results/1.json")
            .then(response => {
                setWinner(response.data.MRData.RaceTable.Races);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    //Get all races for current season
    useEffect(() => {
        axios.get("https://ergast.com/api/f1/current.json")
            .then(response => {
                setRace(response.data.MRData.RaceTable.Races);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    //Populate markers
    useEffect(() => {
        setMarkersMap(race);
    }, [race]);


    useEffect(() => {
        fetchVideos();
    }, []);

    //Set markers with info. 
    function setMarkersMap(races) {
        const currentDate = new Date();

        const newMarkers = races.map((race, index) => {
            const raceDate = new Date(`${race.date}T${race.time}`);
            const hasRaceHappened = currentDate > raceDate;
            const color = hasRaceHappened ? "#F53" : "#00FF00";
            let logo_path = race.Circuit.circuitName.split(' ').join('-');
            const logos = process.env.PUBLIC_URL + './assets/' + `${logo_path}` + '.png';

            const video = videos[index];
            const videoId = video?.snippet?.resourceId?.videoId || "";

            return {
                coordinates: [parseFloat(race.Circuit.Location.long), parseFloat(race.Circuit.Location.lat)],
                tooltipText: race.Circuit.circuitName,
                color: color,
                date: race.date,
                round: race.round,
                map: logos,
                hasHappend: hasRaceHappened,
                videoId: videoId,
            };
        });
        setMarkers(newMarkers);
    }

    //Zoom in function
    function handleZoomIn() {
        if (position.zoom >= 4) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.33 }));
    }

    //Zoom out function
    function handleZoomOut() {
        if (position.zoom <= 1) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.33 }));
    }

    // Check if the screen size is smaller than 600px
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };
        handleResize(); // Call the function on initial load
        window.addEventListener("resize", handleResize); // Add event listener to update on window resize
        return () => {
            window.removeEventListener("resize", handleResize); // Clean up the event listener on component unmount
        };
    }, []);


    var testTime = '2023-06-18 17:54:25'


    const isRaceToday = next.length > 0 && new Date(next[0].date).toDateString() === new Date().toDateString();

    console.log(isRaceToday);




    //Render map with markers. Tooltip on hover. Modal open when clicked. 
    return (
        <div>

            <div className="nextRace">
                <h2>F1 Season {next[0]?.season}</h2>
                {next && next.length > 0 && <p>Next race is {next[0].raceName}</p>}
                {next && next.length > 0 && <p>Round {next[0].round}</p>}
                {
                    next && next.length > 0 && (
                        <p>
                            {next[0].date},
                            {
                                (() => {
                                    try {
                                        const dateTimeString = `${next[0].date}T${next[0].time}`;

                                        console.log(dateTimeString);
                                        const dateObject = new Date(dateTimeString);
                                        if (isNaN(dateObject.getTime())) {
                                            throw new Error('Invalid date');
                                        }
                                        return format(dateObject, "HH:mm");
                                    } catch (error) {
                                        console.error("Error formatting date:", error);
                                        return " Time not set yet.";
                                    }
                                })()
                            }
                        </p>
                    )
                }

{next && next.length > 0 && (
  <p>
    {new Date(`${next[0].date}T${next[0].time}`) > new Date() ? (
      <FlipCountdown
        hideYear={new Date(next[0].date) - new Date() < 31536000000}
        hideMonth={new Date(next[0].date) - new Date() < 2592000000}
        hideDay={new Date(next[0].date) - new Date() < 86400000}
        hourTitle="Hours"
        minuteTitle="Minutes"
        secondTitle="Seconds"
        size={isSmallScreen ? 'small' : 'medium'}
        endAt={`${next[0].date} ${next[0].time}`}
        onTimeUp={() => console.log("Time's up ⏳")}
      />
    ) : (
      (() => {
        try {
          const raceDateTime = new Date(`${next[0].date}T${next[0].time}`);
          const now = new Date();
          if (isNaN(raceDateTime.getTime())) {
            throw new Error('Invalid date');
          }

          if (raceDateTime > now) {
            // The race is in the future - this case should be handled by the FlipCountdown above
            return null;
          } else {
            // Race is now or in the past
            return <p className="RaceText">Race is live</p>;
          }
        } catch (error) {
          console.error("Error formatting date:", error);
          return <p></p>;
        }
      })()
    )}
  </p>
)}



                {isRaceToday && (
                    <iframe
                        src="https://www.tvmatchen.nu/widget/648f2a2556c4f?heading=F1&border_color=gray&autoscroll=1"
                        frameborder="0"
                        className="widget"
                    ></iframe>
                )}

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
                    {markers.map(({ coordinates, tooltipText, color, date, round, map, hasHappend, videoId }) => (
                        <Tooltip key={round} title={tooltipText}>
                            <Marker
                                coordinates={coordinates}
                                onClick={() => {
                                    setClickedMarker({ coordinates, tooltipText, color, date, round, map, hasHappend, videoId });
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


                    {clickedMarker?.videoId && (
                        <div className="Highlight">
                            <p>Highlights</p>
                            <iframe
                                width="360"
                                height="315"
                                src={`https://www.youtube.com/embed/${clickedMarker.videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}

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
