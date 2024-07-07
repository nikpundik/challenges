import { FC, useCallback, useRef } from "react";
import styles from "./index.module.css";
import useAnimationFrame from "../../hooks/useAnimationFrame";
import { PlanetDescription } from "../../lib/types";
import { resources, resourcesColors } from "../../lib/resources";

type PlanetProps = {
  planet: PlanetDescription;
  radius: number;
  selected: boolean;
};

const calculateGradientColor = (
  planetResources: PlanetDescription["resources"]
) => {
  const total = Object.values(planetResources).reduce(
    (sum, value) => sum + value,
    0
  );

  const percentages: [number, string][] = resources.map((key) => [
    (planetResources[key] / total) * 100,
    resourcesColors[key] || "red",
  ]);
  percentages.sort((a, b) => b[0] - a[0]);

  const gradients = percentages
    .map(([percentage, color]) => {
      const alphaHex = Math.round((percentage / 100) * 255)
        .toString(16)
        .padStart(2, "0");
      return `radial-gradient(circle, ${color} 0%, ${color}${alphaHex} ${percentage}%)`;
    }, [])
    .join(", ");

  return gradients;
};

const Planet: FC<PlanetProps> = ({ planet, radius, selected }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const rotRef = useRef(Math.random() * Math.PI * 2);

  const animate = useCallback((delta: number) => {
    rotRef.current += delta * 0.1;
    if (ref.current) {
      const x = radius * Math.sin(rotRef.current);
      const y = radius * Math.cos(rotRef.current);
      ref.current.style.left = `${50 + x}%`;
      ref.current.style.top = `${50 + y}%`;
    }
  }, []);

  useAnimationFrame(animate);

  return (
    <div
      ref={ref}
      className={styles.planet}
      style={{
        width: `${1 + planet.size}%`,
        height: `${1 + planet.size}%`,
      }}
    >
      <div
        className={selected ? styles.planetSpriteSelected : styles.planetSprite}
        style={{
          background: calculateGradientColor(planet.resources),
        }}
      ></div>
    </div>
  );
};

export default Planet;
