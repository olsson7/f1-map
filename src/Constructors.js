import Collapse from 'react-bootstrap/Collapse';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getDriverStatus } from './DriverStatus'; 

function Constructor() {

  const [driverInfo, setDriverInfo] = useState([]);
  const [open, setOpen] = useState({});


  useEffect(() => {
    axios.get("https://ergast.com/api/f1/current/driverStandings.json")
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
        console.log(sortedDriverStandings);


      })
      .catch(error => {
        console.log(error);
      });
  }, []);


  const groupByConstructor = driverInfo.reduce((acc, driver) => {
    const name = driver.Constructors[0].name;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(driver);
    return acc;
  }, {});

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
      {Object.entries(groupByConstructor).map(([constructorName, drivers]) => (
        (
          <ul key={constructorName} className="teams">
            <li
              onClick={() => setOpen(prevState => ({ ...prevState, [constructorName]: !prevState[constructorName] }))}
              aria-controls={`race-${constructorName}`}
              aria-expanded={open[constructorName]}
            >
              <img src={process.env.PUBLIC_URL + './assets/' + `${drivers[0].Constructors[0].constructorId}` + '.png'} alt="Logo" />
              <Collapse in={open[constructorName]}>
                <div id={`race-${constructorName}`}>
                  <hr></hr>
                  {drivers.map(driver => {
                    const age = calculateAge(driver.Driver.dateOfBirth);
                    const driverStatus = getDriverStatus(driver.Driver.driverId); // fetch driver status using the function
                    return (
                      <div key={driver.Driver.driverId}>
                        <p>{driver.Driver.givenName} {driver.Driver.familyName}</p>
                        <p>Age: {age}</p>


                        {driverStatus && (driverStatus === 'Fired' || driverStatus === 'Reserve') && (
                          <p style={{ color: driverStatus === 'Fired' ? 'red' : 'blue' }}>{driverStatus}</p>
                        )}

                        <img src={process.env.PUBLIC_URL + './assets/' + `${driver.Driver.driverId}` + '.png'} alt={'Driver picture ' + `${driver.Driver.driverId}`} />
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
