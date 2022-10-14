import react, {Component, useEffect, useState} from 'react';


export default function NotFound(props) {
    useEffect(() => {
        console.log("NOT FOUND");
    })

    return(
        <div>
            <div>
                <span>NOT FOUND THE PAGE</span>
            </div>
        </div>
    );
}