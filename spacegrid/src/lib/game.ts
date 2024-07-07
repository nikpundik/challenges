import hash from "object-hash";

import { Coords, Diffs, PlanetDescription, World, WorldTile } from "./types";

export const getRandomPosition = () => {
  return {
    x: Math.random() * Number.MAX_SAFE_INTEGER * (Math.random() > 0.5 ? 1 : -1),
    y: Math.random() * Number.MAX_SAFE_INTEGER * (Math.random() > 0.5 ? 1 : -1),
    z: Math.random() * Number.MAX_SAFE_INTEGER * (Math.random() > 0.5 ? 1 : -1),
  };
};

export const getKey = ({ x, y, z }: Coords) => `${x}.${y}.${z}`;

export const getInitialPosition = () => {
  return {
    x: 72423234,
    y: 29488,
    z: -1023095,
  };
};

export const getCellHash = ({ x, y, z }: Coords): string => {
  const key = `${x}x${y}y${z}z`;
  return hash.MD5(key);
};

const diffs: Diffs = [
  [-1, -1, 0],
  [-1, 0, 0],
  [-1, 1, 0],
  [0, -1, 0],
  [0, 0, 0],
  [0, 1, 0],
  [1, -1, 0],
  [1, 0, 0],
  [1, 1, 0],
];

export const getWorld = ({ x, y, z }: Coords): World =>
  diffs.map(([dx, dy, dz]) =>
    getCellHash({ x: x + dx, y: y + dy, z: z + dz })
  ) as World;

export const getPositionFromIndex = (from: Coords, index: number) => {
  if (index === 4) return from;
  return {
    x: from.x + diffs[index][0],
    y: from.y + diffs[index][1],
    z: from.z + diffs[index][2],
  };
};

export const isValidMove = (from: Coords, to: Coords) => {
  return (
    Math.abs(to.x - from.x) <= 1 &&
    Math.abs(to.y - from.y) <= 1 &&
    Math.abs(to.z - from.z) <= 1
  );
};

const getPlanetsCount = (key: string) => {
  const subStr = key.substring(0, 3);
  const numericValue = parseInt(subStr, 16);
  const number = (numericValue % 8) + 1;
  return number;
};

const getStarSize = (key: string) => {
  const subStr = key.substring(2, 4);
  const numericValue = parseInt(subStr, 16);
  const number = (numericValue % 2) + 1;
  return number;
};

const getStarType = (key: string) => {
  const subStr = key.substring(5, 7);
  const numericValue = parseInt(subStr, 16);
  const number = numericValue % 4;
  return number;
};

const getPlanet = (index: number, key: string): PlanetDescription => {
  const size = 1 / ((parseInt(key[index], 16) % 10) + 1) + 0.5;
  const crystal = parseInt(key[index + 1], 16) % 10;
  const alien = parseInt(key[index + 2], 16) % 10;
  const metal = parseInt(key[index + 3], 16) % 10;
  const plutonium = parseInt(key[index + 4], 16) % 10;
  return {
    size,
    resources: {
      crystal,
      alien,
      metal,
      plutonium,
    },
  };
};

export const getWorldTile = (key: string): WorldTile => {
  const planets = Array.from({ length: getPlanetsCount(key) }, (_, index) =>
    getPlanet(index, key)
  );
  return {
    planets,
    star: {
      size: getStarSize(key),
      type: getStarType(key),
    },
  };
};
