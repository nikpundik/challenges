"use client";

import { useState } from "react";
import { uniqBy } from "lodash";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ImageDetection from "./image";
import Loader from "./ui/loader";
import { hexToRgb } from "@/lib/utils";
import ExportButton from "@/components/exportButton";
import ImportButton from "@/components/importButton";
import DetectionTable from "@/components/detectionTable";

export function Dashboard() {
  const [snapshot, setSnapshot] = useState({
    areaMin: 0,
    areaMax: 100000,
    arMin: 0,
    arMax: 100000,
    colorTarget: "#000000",
    colorThreshold: 1000,
    detection: [],
    excluedClasses: [],
    width: 0,
    height: 0,
    selected: null,
  });
  const selectedDetection =
    snapshot.selected && snapshot.detection
      ? snapshot.detection?.[snapshot.selected]
      : null;
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  const handleImageUpload = async (eventUpload) => {
    const file = eventUpload.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          setSnapshot((prev) => ({
            ...prev,
            width: img.width,
            height: img.height,
          }));
          setImage(file);
          setImageSrc(e.target.result);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  const performObjectDetection = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("targetColor", hexToRgb(snapshot.colorTarget));
      formData.append("colorThreshold", snapshot.colorThreshold.toString());
      formData.append("areaMin", snapshot.areaMin.toString());
      formData.append("areaMax", snapshot.areaMax.toString());
      formData.append("arMin", snapshot.arMin.toString());
      formData.append("arMax", snapshot.arMax.toString());
      const response = await fetch("http://10.100.1.168:8080/detect", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setSnapshot((prev) => ({
        ...prev,
        detection: data,
      }));
    } catch (error) {
      console.error("Error performing object detection:", error);
    }
    setIsLoading(false);
  };

  const handleExcludedClass = (className, checked) => {
    setSnapshot((prev) => ({
      ...prev,
      excluedClasses: checked
        ? prev.excluedClasses.filter((c) => c !== className)
        : [...prev.excluedClasses, className],
    }));
  };

  return (
    <div className="grid grid-cols-[1fr_300px] h-screen">
      <div className="relative flex justify-center items-center bg-muted/40 overflow-auto">
        {imageSrc && (
          <div className="w-full h-full p-6">
            <ImageDetection
              src={imageSrc}
              setSnapshot={setSnapshot}
              snapshot={snapshot}
            />
          </div>
        )}

        {!image && (
          <div className="text-center space-y-4 flex flex-col items-center">
            <h2 className="text-2xl font-bold">Object Detection</h2>
            <p className="text-muted-foreground">
              Upload an image to see the detected objects.
            </p>

            {isLoading ? (
              <Loader />
            ) : (
              <label
                htmlFor="image-upload"
                className="inline-flex items-center gap-2 bg-black text-white rounded-md px-4 py-2 cursor-pointer"
              >
                <UploadIcon className="w-5 h-5" />
                Choose Image
              </label>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        )}
      </div>
      <div className="bg-zinc-50 border-l p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Controls</h2>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="confidence-threshold">Area min/max</Label>
            <div className="flex gap-2 justify-between">
              <input
                className="px-2 py-1 bg-zinc-100 rounded w-24 flex-1"
                type="number"
                value={snapshot.areaMin}
                onChange={(e) =>
                  setSnapshot((prev) => ({ ...prev, areaMin: e.target.value }))
                }
              />
              <input
                className="px-2 py-1 bg-zinc-100 rounded w-24 flex-1"
                type="number"
                value={snapshot.areaMax}
                onChange={(e) =>
                  setSnapshot((prev) => ({ ...prev, areaMax: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="confidence-threshold">Aspect ratio min/max</Label>
            <div className="flex gap-2 justify-between">
              <input
                className="px-2 py-1 bg-zinc-100 rounded w-24 flex-1"
                type="number"
                value={snapshot.arMin}
                onChange={(e) =>
                  setSnapshot((prev) => ({ ...prev, arMin: e.target.value }))
                }
              />
              <input
                className="px-2 py-1 bg-zinc-100 rounded w-24 flex-1"
                type="number"
                value={snapshot.arMax}
                onChange={(e) =>
                  setSnapshot((prev) => ({ ...prev, arMax: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="confidence-threshold">Color range</Label>
            <div className="flex gap-2 justify-between">
              <input
                className="px-2 py-1 bg-zinc-100 rounded w-24 flex-1"
                type="color"
                value={snapshot.colorTarget}
                onChange={(e) =>
                  setSnapshot((prev) => ({
                    ...prev,
                    colorTarget: e.target.value,
                  }))
                }
              />
              <input
                className="px-2 py-1 bg-zinc-100 rounded w-24 flex-1"
                type="number"
                value={snapshot.colorThreshold}
                onChange={(e) =>
                  setSnapshot((prev) => ({
                    ...prev,
                    colorThreshold: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <button
              disabled={!image}
              onClick={performObjectDetection}
              className="disabled:opacity-30 inline-flex items-center gap-2 bg-black text-white rounded-md px-4 py-2 cursor-pointer"
            >
              <UploadIcon className="w-5 h-5" />
              Detect objects
            </button>
          )}
          <div className="flex gap-4">
            <ExportButton file={image} snapshot={snapshot} />
            <ImportButton
              setImage={setImage}
              setImageSrc={setImageSrc}
              setSnapshot={setSnapshot}
            />
          </div>
          <hr />
          <div>
            <Label>Visible Classes</Label>
            <div className="grid grid-cols-2 gap-2">
              {uniqBy(snapshot.detection, "class").map((d) => (
                <Label
                  key={d.class}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Checkbox
                    checked={!snapshot.excluedClasses.includes(d.class)}
                    onCheckedChange={(checked) =>
                      handleExcludedClass(d.class, checked)
                    }
                  />
                  {d.class}
                </Label>
              ))}
            </div>
          </div>
          <hr />
          <div>
            {snapshot?.detection && (
              <DetectionTable snapshot={snapshot} setSnapshot={setSnapshot} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
