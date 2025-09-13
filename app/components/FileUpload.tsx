"use client";
import { useState } from "react";

export default function FileUpload() {
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // TODO: send file to /api/parse-file
    }
  }

  return (
    <div className="border-2 border-dashed p-6 rounded-lg text-center">
      <input
        type="file"
        accept=".xlsx,.csv"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />
      <label htmlFor="fileInput" className="cursor-pointer text-blue-600">
        {fileName ? `Uploaded: ${fileName}` : "Drag & drop or choose a file"}
      </label>
    </div>
  );
}
