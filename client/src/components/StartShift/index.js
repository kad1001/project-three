import React from "react";

export function StartShift(props) {

    return (
        <div className="input" type="col-2-sm">
            <h3>Start time</h3>
            {/* <input
                type="button"
                value="Click here to enter start time"
            /> */}
            <input type="text" readOnly />
        </div>
    );
}

export default StartShift;