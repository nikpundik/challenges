import { useEffect } from "react";
import { Player } from "../lib/player";

export const visitMap = {
  1: 6,
  2: 7,
  3: 8,
  4: 3,
  6: 5,
  7: 0,
  8: 1,
  9: 2,
};

export const keyboardMap: Record<number, number> = {
  6: 1,
  7: 2,
  8: 3,
  3: 4,
  5: 6,
  0: 7,
  1: 8,
  2: 9,
};

const useControls = (player: Player, update: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          break;
        case "ArrowRight":
          player.move(1);
          break;
        case "ArrowDown":
          break;
        case "ArrowLeft":
          player.move(-1);
          break;
        case " ":
          player.harvest();
          break;
        case "f":
          player.craft("fuel");
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "6":
        case "7":
        case "8":
        case "9":
          player.visit(visitMap[event.key]);
          break;
        default:
          break;
      }
      update();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [player]);
  return player;
};

export default useControls;
