"use client";

const DetectionTable = ({ snapshot, setSnapshot }) => {
  const selectedDetection =
    snapshot.selected !== null && snapshot.detection
      ? snapshot.detection?.[snapshot.selected]
      : null;
  if (!selectedDetection) {
    return null;
  }
  return (
    <div>
      <div>Edit label</div>
      <input
        className="px-2 py-1 bg-zinc-100 rounded w-24 flex-1 mt-2 w-full block"
        type="text"
        value={selectedDetection.class}
        onChange={(e) =>
          setSnapshot((prev) => ({
            ...prev,
            detection: prev.detection.map((d, j) =>
              j === snapshot.selected ? { ...d, class: e.target.value } : d
            ),
          }))
        }
      />
    </div>
  );
};

export default DetectionTable;
