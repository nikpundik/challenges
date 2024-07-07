export type Coords = {
  x: number;
  y: number;
  z: number;
};

export type World = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

export type Diffs = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

export type ShipResource = "fuel";

export type PlanetResource = "crystal" | "alien" | "metal" | "plutonium";

export type Crafting = {
  [key in ShipResource]: Partial<Resources>;
};

export type ShipResources = {
  [key in ShipResource]: number;
};

export type Resources = {
  [key in PlanetResource]: number;
};
export type PlanetDescription = {
  resources: Resources;
  size: number;
};

export type StarDescription = {
  size: number;
  type: number;
};

export type WorldTile = {
  planets: PlanetDescription[];
  star: StarDescription;
};

export type PlayerStats = {
  shipResources: ShipResources;
  visited: number;
  harvested: number;
  resources: Resources;
  planetResources: Resources;
};
