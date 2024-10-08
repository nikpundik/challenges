import { useState } from "react";
import Issues from "./Issues";
import { extractVideoLinks } from "./video";
import { extractImageLinks } from "./image";
import exampleIssues from "./example.json";

const token = "YOUR_ACCESS_TOKEN"; // Optional

export default function Load() {
  const [issues, setIssues] = useState([exampleIssues[1]]);
  const [owner, setOwner] = useState("Algorithm-Arena");
  const [repo, setRepo] = useState(
    "weekly-challenge-23-unconventional-randomness"
  );

  const load = () => {
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      headers: {
        // Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    })
      .then((res) => res.json())
      .then((data) => setIssues(data))
      .catch((err) => console.error(err));
  };

  const sort = (index, direction = 1) =>
    setIssues((prev) => {
      const newIssues = [...prev];
      const item = newIssues.splice(index, 1)[0];
      newIssues.splice(index + direction, 0, item);
      return newIssues;
    });

  const setBlurb = (index, blurb) =>
    setIssues((prev) => {
      const newIssues = [...prev];
      newIssues[index].blurb = blurb;
      return newIssues;
    });

  const convert = () => {
    const entries = issues.map((issue) => {
      const { body } = issue;
      const { markdownImages, directImages } = extractImageLinks(body);
      const { githubAssets } = extractVideoLinks(body);
      const videoUrl = githubAssets[0];
      return { videoUrl, markdownImages, directImages };
    });
    fetch("http://localhost:3000/convert-videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entries }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div className="flex gap-2 justify-center w-full mb-6">
        <input
          className="px-3 py-1 border-solid border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          type="text"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
        <input
          className="px-3 py-1 border-solid border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={load}
          disabled
        >
          Load
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={convert}
        >
          Convert
        </button>
      </div>
      <Issues issues={issues} sort={sort} setBlurb={setBlurb} />
    </div>
  );
}
