import { CSSProperties } from "react";
import { PlanetResource } from "./types";

export const resources: PlanetResource[] = [
  "alien",
  "crystal",
  "plutonium",
  "metal",
];

export const resourcesColors: Record<
  PlanetResource,
  CSSProperties["backgroundColor"]
> = {
  alien: "#800080",
  crystal: "#00FFFF",
  plutonium: "#00008B",
  metal: "#708090",
};
