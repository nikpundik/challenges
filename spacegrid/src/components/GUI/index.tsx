import { FC } from "react";
import ResourceDisplay from "../ResourceDisplay";
import ShipDisplay from "../ShipDisplay";
import { PlayerStats } from "../../lib/types";
import styles from "./index.module.css";

type GUIProps = {
  stats: PlayerStats;
  currentWorld: string;
  currentPlanet: number;
};

const GUI: FC<GUIProps> = ({ stats, currentWorld, currentPlanet }) => {
  return (
    <div className={styles.gui}>
      <div className={styles.sections}>
        <div className={styles.section}>
          <ResourceDisplay amounts={stats.resources} />
          <ShipDisplay
            visited={stats.visited}
            harvested={stats.harvested}
            shipResources={stats.shipResources}
          />
        </div>
        <div className={styles.section}>
          <ResourceDisplay amounts={stats.planetResources} />
          <div>
            {currentWorld}.{currentPlanet}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GUI;
