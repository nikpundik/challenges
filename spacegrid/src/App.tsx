import { useState } from "react";
import "./App.css";
import { Player } from "./lib/player";
import { getWorldTile } from "./lib/game";
import Planet from "./components/Planet";
import useControls, { keyboardMap } from "./hooks/useControls";
import Star from "./components/Star";
import GUI from "./components/GUI";

const player = new Player();

function App() {
  const [data, setData] = useState(() => player.export());

  useControls(player, () => setData(player.export()));

  return (
    <div className="app">
      <GUI
        stats={data.stats}
        currentPlanet={data.planet}
        currentWorld={data.world[4]}
      />
      <div className="grid">
        {data.world.map((cell, index) => {
          const { planets, star } = getWorldTile(cell);
          return (
            <div key={index} className="cell">
              <Star star={star} />
              {index !== 4 && (
                <div
                  className="cellIndex"
                  title={`Press ${keyboardMap[index]} to visit system (cost 3 Fuel)`}
                >
                  {keyboardMap[index]}
                </div>
              )}
              {planets.map((planet, planetIndex) => (
                <Planet
                  key={planetIndex}
                  planet={planet}
                  radius={10 + 5 * (planetIndex + 1)}
                  selected={data.planet === planetIndex && index === 4}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
