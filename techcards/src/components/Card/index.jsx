import React, { useEffect, useRef } from "react";
import { Stage, Layer, Text, Rect, Image, Group, Star } from "react-konva";
import useImage from "use-image";
import styles from "./index.module.css";
import overlayUrl from "./mask.png";

const width = 563;
const height = 795;
const scale = 0.5;

const Card = ({ stageRef, file, title, role, skills, filters }) => {
  const [overlay] = useImage(overlayUrl);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.cache();
    }
  }, [file]);

  return (
    <div className={styles.cardContainer}>
      <Stage
        ref={stageRef}
        className={styles.card}
        width={width}
        height={height}
      >
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill="black" />
          {file && (
            <Image
              image={file}
              ref={imageRef}
              x={30}
              y={90}
              width={width - 58}
              height={height - 326}
              filters={filters}
              levels={0.029}
              embossStrength={0.1}
              embossWhiteLevel={0.2}
              embossBlackLevel={0.2}
              embossBlend
            />
          )}
          <Image image={overlay} x={0} y={0} width={width} height={height} />
          <Text
            x={120}
            y={45}
            align="center"
            width={width - 240}
            fontFamily="Exo 2"
            fontSize={30}
            fill="white"
            text={title}
          />
          <Text
            x={120}
            y={570}
            align="center"
            width={width - 240}
            fontFamily="Exo 2"
            fontSize={22}
            fill="white"
            text={role}
          />
          <Group y={640}>
            {skills.map((skill, k) => (
              <Group key={k} y={skills.indexOf(skill) * 25}>
                <Text
                  x={80}
                  y={-5}
                  fontFamily="Exo 2"
                  fontSize={18}
                  fill="white"
                  text={skill.label}
                />
                {Array.from({ length: skill.skill }).map((_, i) => (
                  <Star
                    fill="white"
                    numPoints={7}
                    innerRadius={3}
                    outerRadius={6}
                    stroke="goldenrod"
                    strokeWidth={1}
                    key={i}
                    x={width - 80 - i * 20}
                  />
                ))}
              </Group>
            ))}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default Card;
