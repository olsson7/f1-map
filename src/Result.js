import Collapse from 'react-bootstrap/Collapse';
import Table from 'react-bootstrap/Table';
import React, { useState, useEffect } from "react";
import axios from "axios";

function Result() {

  const [open, setOpen] = useState(false);
  const [result, setResult] = useState([]);

  //Get all race results
  useEffect(() => {
    axios.get("https://ergast.com/api/f1/current/results.json?limit=1000&offset=0")
      .then(response => {
        setResult(response.data.MRData.RaceTable);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);



  //Showing all races in a list. 
  return (
    <>
      <ul>
        {result.Races &&
          result.Races.map(race => (
            <li id="title"
              key={race.round}
              onClick={() => setOpen(prevState => ({ ...prevState, [race.round]: !prevState[race.round] }))}
              aria-controls={`race-${race.round}`}
              aria-expanded={open[race.round]}
            >
              {race.raceName}
              <Collapse in={open[race.round]}>
                <div id={`race-${race.round}`}>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Position</th>
                        <th>Driver</th>
                        <th>Team</th>
                        <th>Time/Status</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {race.Results &&
                        race.Results.map(result => (
                          <tr key={result.position}>
                            <td>{result.position}</td>
                            <td>
                              {result.Driver.givenName}
                              {' '}
                              {result.Driver.familyName}
                            </td>
                            <td>{result.Constructor.name}</td>
                            <td>{result.status}</td>
                            <td>{result.points}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </Collapse>
            </li>
          ))}
      </ul>
    </>
  );
}


export default Result;