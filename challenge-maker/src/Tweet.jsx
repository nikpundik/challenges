import { useState } from "react";

export const Tweet = ({ tweet }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(tweet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="w-full bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="p-4 flex gap-4 items-center">
        <div className="flex-grow">{tweet}</div>
        <button
          disabled={copied}
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};
