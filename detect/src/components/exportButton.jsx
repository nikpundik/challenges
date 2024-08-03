"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const ExportButton = ({ file, snapshot }) => {
  const [isLoading, setIsLoading] = useState(false);
  const createAndDownloadZip = () => {
    setIsLoading(true);
    const zip = new JSZip();
    const reader = new FileReader();
    reader.onload = function (e) {
      zip.file(file.name, e.target.result);
      zip.file("data.json", JSON.stringify(snapshot, null, 2));
      zip
        .generateAsync({ type: "blob" })
        .then((content) => {
          saveAs(content, "export.zip");
          setIsLoading(false);
        })
        .catch((error) => {
          alert("Error generating ZIP file");
          setIsLoading(false);
        });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <button
        className="disabled:opacity-30 inline-flex items-center gap-2 bg-indigo-700 text-white rounded-md px-4 py-2 cursor-pointer"
        disabled={isLoading}
        onClick={createAndDownloadZip}
      >
        Export
      </button>
    </div>
  );
};

export default ExportButton;
