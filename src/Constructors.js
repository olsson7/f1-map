import Collapse from 'react-bootstrap/Collapse';
import React, { useState, useEffect } from "react";
import axios from "axios";

function Constructor() {

  const [driverInfo, setDriverInfo] = useState([]);
  const [open, setOpen] = useState({});

  //Get drivers and sort by constructor. 
  useEffect(() => {
    axios.get("http://ergast.com/api/f1/current/driverStandings.json")
      .then(response => {
        const driverStandings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        const sortedDriverStandings = driverStandings.sort((a, b) => {
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
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  //Calculate age of driver
  const calculateAge = (birthdate) => {
    const currentDate = new Date();
    const birthDate = new Date(birthdate);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  //Show driver info sorted by team
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
              <Collapse in={open[driver.Constructors[0].name]}>
                <div id={`race-${driver.Constructors[0].name}`}>

                  <hr></hr>

                  {driverInfo
                    .filter(d => d.Constructors[0].name === driver.Constructors[0].name)
                    .map(d => {
                      const age = calculateAge(d.Driver.dateOfBirth);
                      return (
                        <div key={d.Driver.driverId}>
                          <p>{d.Driver.givenName} {d.Driver.familyName}</p>
                          <p>Age: {age}</p>
                          <img src={process.env.PUBLIC_URL + './assets/drivers/' + `${d.Driver.driverId}` + '.png'} alt={'Driver picture ' + `${d.Driver.driverId}`} />

                          <hr></hr>
                        </div>
                      );
                    })}
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
