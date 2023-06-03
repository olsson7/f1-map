
import Table from 'react-bootstrap/Table';

import React, { useState, useEffect } from "react";
import axios from "axios";

function Standing() {

    const [open, setOpen] = useState(false);
    const [driverStandings, setDriversStandings] = useState([]);
    const [constructorStandings, setConstructorStandings] = useState([]);



    useEffect(() => {
        axios.get("http://ergast.com/api/f1/current/driverStandings.json")
            .then(response => {
                setDriversStandings(response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
                console.log(response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        axios.get("https://ergast.com/api/f1/current/constructorStandings.json")
            .then(response => {
                setConstructorStandings(response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);
                console.log(response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);



    return (

        <>
            <div className='row'>

                <div className='column'>

                    <h3>Drivers Standings</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Driver</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {driverStandings.map(driver => (
                                <tr key={driver.position}>
                                    <td>{driver.position}</td>
                                    <td>{driver.Driver.givenName} {driver.Driver.familyName}</td>
                                    <td>{driver.points}</td>
                                </tr>
                            ))}
                        </tbody>
                        </Table>

                </div>
                <div className='column'>

                <div />
                <h3>Constructors Standings</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Constructor</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {constructorStandings.map(constructor => (
                            <tr key={constructor.position}>
                                <td>{constructor.position}</td>
                                <td>{constructor.Constructor.name}</td>
                                <td>{constructor.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>


        </div>


            </>
            );
}



export default Standing;