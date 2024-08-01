import React from "react";
import { Stage, Layer, Text, Rect, Image } from "react-konva";
import styles from "./index.module.css";

const width = 340;
const height = 460;

const Card = ({ file, title }) => {
  return (
    <div className={styles.cardContainer}>
      <Stage className={styles.card} width={width} height={height}>
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill="black" />
          {file && (
            <Image image={file} x={0} y={0} width={width} height={height} />
          )}
          <Text fontSize={60} fill="white" stroke="black" text={title} />
        </Layer>
      </Stage>
    </div>
  );
};

export default Card;
