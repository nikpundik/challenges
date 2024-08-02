import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const ImportButton = ({ setImage, setImageSrc, setSnapshot }) => {
  const handleImport = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const zip = await JSZip.loadAsync(file);
      let imageFile = null;
      let dataFile = null;

      zip.forEach((relativePath, file) => {
        if (file.name.endsWith(".json")) {
          dataFile = file;
        } else {
          console.log("image", file.name);
          imageFile = file;
        }
      });
      if (imageFile && dataFile) {
        const imageBuffer = await imageFile.async("arraybuffer");
        const data = JSON.parse(await dataFile.async("text"));
        const blob = new Blob([imageBuffer], { type: imageFile.mimeType });
        const imageURL = URL.createObjectURL(blob);
        const newFile = new File([blob], imageFile.name, {
          type: imageFile.mimeType,
        });

        const reader = new FileReader();
        reader.onload = function (e) {
          setSnapshot(data);
          setImage(newFile);
          setImageSrc(imageURL);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      <label
        htmlFor="image-import"
        className="inline-flex items-center gap-2 bg-indigo-700 text-white rounded-md px-4 py-2 cursor-pointer"
      >
        Import
      </label>
      <input
        id="image-import"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImport}
      />
    </div>
  );
};

export default ImportButton;
