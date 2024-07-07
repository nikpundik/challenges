import React from "react";
import { ShipResources } from "../../lib/types";
import styles from "./index.module.css";

type ShipDisplayProps = {
  shipResources: ShipResources;
  visited: number;
  harvested: number;
};

const total = BigInt((Number.MAX_SAFE_INTEGER * 2) ** 3);

const displayAmount = (amount: number) =>
  amount > 99 ? "+99" : amount.toString();

const ShipDisplay: React.FC<ShipDisplayProps> = ({
  shipResources,
  visited,
  harvested,
}) => {
  return (
    <div className={styles.icons}>
      <div className={styles.icon} title={`Visited: ${visited}/${total}`}>
        <div className={styles.text}>{visited}</div>
        <div className={styles.symbol}>V</div>
      </div>
      <div
        className={styles.icon}
        title="Fuel (Press 'F' to craft Fuel (cost 1 of each resource)"
      >
        <div className={styles.text}>{displayAmount(shipResources.fuel)}</div>
        <div className={styles.symbol}>F</div>
      </div>
      <div
        className={styles.icon}
        title="Harvest (Press 'Spacebar' to harvest planet resources (cost 1 Fuel for harvesting half of planet resources)"
      >
        <div className={styles.text}>{displayAmount(harvested)}</div>
        <div className={styles.symbol}>H</div>
      </div>
    </div>
  );
};

export default ShipDisplay;
