import React from 'react';
import { useParams } from "react-router-dom";

function Call() {
    const { id } = useParams();

    return (
        <div>
            <h3>Call ID: {id}</h3>
        </div>
    );
}

export default Call;