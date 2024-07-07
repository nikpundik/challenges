import {
  getPositionFromIndex,
  getInitialPosition,
  getWorld,
  isValidMove,
  getWorldTile,
  getKey,
} from "./game";
import { resources } from "./resources";
import {
  Coords,
  Crafting,
  PlayerStats,
  ShipResource,
  World,
  WorldTile,
} from "./types";

export const crafting: Crafting = {
  fuel: {
    alien: 1,
    crystal: 1,
    plutonium: 1,
    metal: 1,
  } as const,
};

export class Player {
  position: Coords;
  planet: number = 0;
  world!: World;
  current!: WorldTile;
  stats: PlayerStats;
  history: Map<string, { tile: WorldTile }> = new Map();

  constructor() {
    this.stats = {
      shipResources: {
        fuel: 50,
      },
      visited: 0,
      harvested: 0,
      resources: {
        alien: 0,
        crystal: 0,
        plutonium: 0,
        metal: 10,
      },
      planetResources: {
        alien: 0,
        crystal: 0,
        plutonium: 0,
        metal: 0,
      },
    };
    this.position = getInitialPosition();
    this.setWorld(this.position);
  }

  setWorld(position: Coords) {
    this.position = position;
    this.world = getWorld(this.position);
    if (this.history.has(getKey(position))) {
      this.current = this.history.get(getKey(position))!.tile;
    } else {
      this.current = getWorldTile(this.world[4]);
      this.history.set(getKey(position), { tile: this.current });
    }
    this.setPlanet(0);
  }

  setPlanet(planet: number) {
    this.planet = planet;
    this.stats.planetResources = {
      ...this.current.planets[this.planet].resources,
    };
  }

  visit(index: number) {
    const position = getPositionFromIndex(this.position, index);
    if (
      isValidMove(this.position, position) &&
      this.stats.shipResources.fuel > 3
    ) {
      this.setWorld(position);
      this.stats.shipResources.fuel -= 3;
      this.stats.visited += 1;
    }
  }

  harvest() {
    if (this.stats.shipResources.fuel <= 0) return;
    this.stats.shipResources.fuel -= 1;
    const planetResources = this.current.planets[this.planet].resources;
    resources.forEach((resource) => {
      const amount = Math.round(planetResources[resource] / 2);
      planetResources[resource] -= amount;
      this.stats.resources[resource] += amount;
    });
    this.stats.harvested += 1;
    this.stats.planetResources = planetResources;
  }

  craft(shipResource: ShipResource) {
    const cost = crafting[shipResource];

    const hasResources = !resources.some(
      (key) => cost[key] && (cost[key] || 0) > this.stats.resources[key]
    );

    if (hasResources) {
      resources.forEach((resource) => {
        this.stats.resources[resource] -= cost[resource] || 0;
      });
      this.stats.shipResources[shipResource] += 1;
    }
  }

  move(direction: number) {
    if (this.stats.shipResources.fuel <= 0) return;
    const newPlanet = this.planet + direction;
    if (newPlanet >= 0 && newPlanet < this.current.planets.length) {
      this.stats.shipResources.fuel -= 1;
      this.setPlanet(newPlanet);
    }
  }

  export() {
    return {
      world: this.world,
      stats: this.stats,
      position: this.position,
      planet: this.planet,
    };
  }
}
