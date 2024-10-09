import React, { useState } from "react";
import { Range } from "react-range";

const PrizeSplitter = ({ prize: { total, values }, changePrizes }) => {
  return (
    <div>
      <p>
        Total Prize: <b>${total}</b>
      </p>
      <div className="mt-2">
        <Range
          values={values}
          step={1}
          min={0}
          max={total}
          onChange={changePrizes}
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
      <div className="flex justify-between mt-4">
        <div>
          <h2 className="text-gray-800 ">
            1st{" "}
            <span className="text-white rounded-md border-solid border-1 border-gray-200 bg-blue-400 p-1">
              ${values[0]}
            </span>
          </h2>
        </div>
        <div>
          <h2 className="text-gray-800 ">
            2rd{" "}
            <span className="text-white rounded-md border-solid border-1 border-gray-200 bg-blue-400 p-1">
              ${values[1] - values[0]}
            </span>
          </h2>
        </div>
        <div>
          <h2 className="text-gray-800 ">
            3rd{" "}
            <span className="text-white rounded-md border-solid border-1 border-gray-200 bg-blue-400 p-1">
              ${total - values[1]}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PrizeSplitter;
