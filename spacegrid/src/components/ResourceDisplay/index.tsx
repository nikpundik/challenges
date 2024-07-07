import React from "react";
import { resources, resourcesColors } from "../../lib/resources";
import { PlanetResource } from "../../lib/types";
import styles from "./index.module.css";

type ResourceDisplayProps = {
  amounts: Record<PlanetResource, number>;
};

const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ amounts }) => {
  return (
    <div className={styles.icons}>
      {resources.map((resource) => {
        const color = resourcesColors[resource];
        const amount = amounts[resource];
        const displayAmount = amount > 99 ? "+99" : amount.toString();

        return (
          <div key={resource} className={styles.icon} title={resource}>
            <div className={styles.text}>{displayAmount}</div>
            <div className={styles.color} style={{ backgroundColor: color }} />
          </div>
        );
      })}
    </div>
  );
};

export default ResourceDisplay;
