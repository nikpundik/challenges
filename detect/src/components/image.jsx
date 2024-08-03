"use client";

const createPathData = (mask) => {
  return mask[0]
    .map((point, index) => {
      const [x, y] = point;
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");
};

const Image = ({ src, snapshot, setSnapshot }) => {
  const w = snapshot.width;
  const h = snapshot.height;
  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <filter x="0" y="0" width="1" height="1" id="solid">
          <feFlood floodColor="black" result="bg" />
          <feMerge>
            <feMergeNode in="bg" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <image href={src} height={h} width={w} />
      {snapshot.detection.map((d, i) => {
        if (snapshot.excluedClasses.includes(d.class)) {
          return null;
        }
        return (
          <g
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setSnapshot((prev) => ({
                ...prev,
                selected: prev.selected === i ? null : i,
              }));
            }}
          >
            <path
              d={createPathData(d.mask)}
              stroke="black"
              strokeWidth={3}
              className={`transition fill-[#243c5a] ${
                snapshot.selected === i ? "opacity-90" : "opacity-50"
              } hover:opacity-90`}
            />
            <rect
              x={d.box[0]}
              y={d.box[1]}
              width={d.box[2] - d.box[0]}
              height={d.box[3] - d.box[1]}
              stroke="black"
              strokeWidth={1}
              fill="none"
            />
            <text filter="url(#solid)" x={d.box[0]} y={d.box[1]} fill="white">
              {` ${d.class} `}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default Image;
