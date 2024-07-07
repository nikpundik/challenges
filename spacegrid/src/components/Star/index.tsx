import { FC } from "react";
import { StarDescription } from "../../lib/types";
import styles from "./index.module.css";

type StarProps = { star: StarDescription };

const Star: FC<StarProps> = ({ star }) => {
  const starSize = star.size * 3;
  const starStyle = {
    width: `${starSize}%`,
    height: `${starSize}%`,
    top: `calc(50% - ${starSize * 0.5}%)`,
    left: `calc(50% - ${starSize * 0.5}%)`,
    backgroundColor: ["lightcyan", "bisque", "lightgray", "antiquewhite"][
      star.type
    ],
  };
  return <span className={styles.star} style={starStyle}></span>;
};

export default Star;
