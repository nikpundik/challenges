import React, { useState } from "react";
import { Range } from "react-range";

const PrizeSplitter = ({ totalPrize = 150 }) => {
  const [values, setValues] = useState([75, 75 + 50]);

  const handleChange = (newValues) => {
    setValues(newValues);
  };

  return (
    <div>
      <p>
        Total Prize: <b>${totalPrize}</b>
      </p>
      <div className="my-2">
        <Range
          values={values}
          step={1}
          min={0}
          max={totalPrize}
          onChange={(values) => handleChange(values)}
          renderTrack={({ props, children }) => (
            <div className="bg-gray-300 h-2 rounded-lg" {...props}>
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div className="bg-gray-500 w-4 h-4 rounded-full" {...props} />
          )}
        />
      </div>
      <div className="flex justify-between">
        <div>
          <h2 className="text-gray-800 rounded-xl border-solid border-2 border-gray-200 p-2">
            ${values[0]}
          </h2>
        </div>
        <div>
          <h2 className="text-gray-800 rounded-xl border-solid border-2 border-gray-200 p-2">
            ${values[1] - values[0]}
          </h2>
        </div>
        <div>
          <h2 className="text-gray-800 rounded-xl border-solid border-2 border-gray-200 p-2">
            ${totalPrize - values[1]}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PrizeSplitter;
