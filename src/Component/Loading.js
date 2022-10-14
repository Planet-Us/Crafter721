import react, {Component, useEffect, useState} from 'react';
import CircularProgress from '@mui/material/CircularProgress';


export default function Loading(props) {

    return(
            <div style={{position: "absolute",top: "50%", left: "50%",transform: "translate(-50%, -50%)",zIndex: "100",justifyContent: "center",flexDirection: "column",width: "100vw", height: "120vh",backgroundColor: "#363940",opacity:0.5,objectFit: "cover"}}>
                <CircularProgress style={{marginTop: "25%"}}/>
            </div>
    );
}