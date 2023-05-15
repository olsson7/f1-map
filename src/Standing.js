

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
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
                //console.log(response.data.MRData.RaceTable);
                setDriversStandings(response.data.MRData.RaceTable);

            })
            .catch(error => {
                console.log(error);
            });
    }
        , []);

        useEffect(() => {
            axios.get("https://ergast.com/api/f1/current/constructorStandings.json")
                .then(response => {
                    //console.log(response.data.MRData.RaceTable);
                    setConstructorStandings(response.data.MRData.RaceTable);
    
                })
                .catch(error => {
                    console.log(error);
                });
        }
            , []);

   


    return (

        <>
        
      </>
    );
  }


export default Standing;