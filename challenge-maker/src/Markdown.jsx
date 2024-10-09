import { useState } from "react";

const getPosition = (index, prize) => {
  if (index === 0) {
    return `The winner for ${prize.values[0]}$ is`;
  }
  if (index === 1) {
    return `In second place for ${prize.values[1] - prize.values[0]}$ is`;
  }
  if (index === 2) {
    return `In third place for ${prize.total - prize.values[1]}$ is`;
  }
  return "Honorable mention for";
};

export const getMarkdown = ({ issues, prize }) => {
  const list = issues
    .filter((issue, i) => i < 3 || issue.honorableMention)
    .map((issue, index) => {
      return `* ${getPosition(index, prize)} ${issue.twitterName}! ${
        issue.blurb || ""
      } ${issue.html_url}\n\n`;
    });

  return `### Winners:\n\n${list.join("")}`;
};

export const Markdown = ({ issues, prize }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const markdown = getMarkdown({ issues, prize });
  return (
    <div className="w-full bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="p-4 flex gap-4 items-center">
        <div className="flex-grow overflow-x-auto">
          <pre style={{ whiteSpace: "pre-wrap" }}>{markdown}</pre>
        </div>
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
