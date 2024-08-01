import React, { useEffect, useRef } from "react";
import { Stage, Layer, Text, Rect, Image, Group, Star } from "react-konva";
import useImage from "use-image";
import useResize from "../../hooks/useResize";
import styles from "./index.module.css";
import overlayUrl from "./maskIII.png";

const VIRTUAL_WIDTH = 563;
const VIRTUAL_HEIGHT = 795;
const ASPECT_RATIO = VIRTUAL_WIDTH / VIRTUAL_HEIGHT;

const Card = ({ stageRef, file, filters, title, role, team, skills }) => {
  const containerRef = useRef(null);
  const size = useResize({ ref: containerRef });
  const preferWidth =
    size.width && size.height && ASPECT_RATIO > size.width / size.height;
  const WIDTH = preferWidth ? size.width : size.height * ASPECT_RATIO;
  const HEIGHT = preferWidth ? size.width / ASPECT_RATIO : size.height;
  const [overlay] = useImage(overlayUrl);
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.cache();
    }
  }, [file]);

  const scale = Math.min(WIDTH / VIRTUAL_WIDTH, HEIGHT / VIRTUAL_HEIGHT);

  return (
    <div ref={containerRef} className={styles.resizeContainer}>
      <div
        style={{ width: WIDTH, height: HEIGHT }}
        className={styles.cardContainer}
      >
        <Stage
          ref={stageRef}
          className={styles.card}
          width={WIDTH}
          height={HEIGHT}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              width={VIRTUAL_WIDTH}
              height={VIRTUAL_HEIGHT}
              fill="black"
            />
            {file && (
              <Image
                image={file}
                ref={imageRef}
                x={30}
                y={90}
                width={VIRTUAL_WIDTH - 58}
                height={VIRTUAL_HEIGHT - 326}
                filters={filters}
                levels={0.029}
                embossStrength={0.1}
                embossWhiteLevel={0.2}
                embossBlackLevel={0.2}
                embossBlend
                pixelSize={5}
              />
            )}
            <Image
              image={overlay}
              x={0}
              y={0}
              width={VIRTUAL_WIDTH}
              height={VIRTUAL_HEIGHT}
            />
            <Text
              x={120}
              y={45}
              align="center"
              width={VIRTUAL_WIDTH - 240}
              fontFamily="Exo 2"
              fontSize={30}
              fill="white"
              text={title}
            />
            <Text
              x={120}
              y={570}
              align="center"
              width={VIRTUAL_WIDTH - 240}
              fontFamily="Exo 2"
              fontSize={22}
              fill="white"
              text={role}
            />
            <Text
              x={120}
              y={763}
              align="center"
              width={VIRTUAL_WIDTH - 240}
              fontFamily="Exo 2"
              fontSize={16}
              fill="white"
              text={team}
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
                      x={VIRTUAL_WIDTH - 80 - i * 20}
                    />
                  ))}
                </Group>
              ))}
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

const MemoizedCard = React.memo(Card);

export default MemoizedCard;
