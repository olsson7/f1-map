import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Table from 'react-bootstrap/Table';

import React, { useState, useEffect } from "react";
import axios from "axios";

function Constructor() {

    const [driverInfo, setDriverInfo] = useState([]);
    const [open, setOpen] = useState({});



    useEffect(() => {
        axios.get("http://ergast.com/api/f1/current/driverStandings.json")
            .then(response => {
                const driverStandings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
                const sortedDriverStandings = driverStandings.sort((a, b) => {
                    // Sort by constructor name
                    const constructorA = a.Constructors[0].name.toUpperCase();
                    const constructorB = b.Constructors[0].name.toUpperCase();
                    if (constructorA < constructorB) {
                        return -1;
                    }
                    if (constructorA > constructorB) {
                        return 1;
                    }
                    return 0;
                });
                setDriverInfo(sortedDriverStandings);
                console.log(sortedDriverStandings);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <>
        {driverInfo.map((driver, index) => (
          (index % 2 === 0) && (
            <ul key={driver.Constructors[0].name} className="teams">
               <li
               key={driver.Constructors[0].name}
               onClick={() => setOpen(prevState => ({ ...prevState, [driver.Constructors[0].name]: !prevState[driver.Constructors[0].name] }))}
               aria-controls={`race-${driver.Constructors[0].name}`}
               aria-expanded={open[driver.Constructors[0].name]}
               >
                <img src={process.env.PUBLIC_URL + './assets/logos/' + `${driver.Constructors[0].constructorId}` + '.png'} alt="Logo" />
               {driver.Constructors[0].name}

               <Collapse in={open[driver.Constructors[0].name]}>
                  <div id={`race-${driver.Constructors[0].name}`}>
                  {driverInfo
                .filter(d => d.Constructors[0].name === driver.Constructors[0].name)
                .map(d => (
                  <div key={d.Driver.driverId}>
                    {d.Driver.givenName} {d.Driver.familyName}
                  </div>
                ))}
                  </div>
                </Collapse>
               </li>

               
            </ul>
          )
        ))}
      </>
    );
}

export default Constructor;
