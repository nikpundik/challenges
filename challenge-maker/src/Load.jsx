import { useState } from "react";
import Issues from "./Issues";
import { Tweet } from "./Tweet";
import { Markdown } from "./Markdown";
import PrizeSplitter from "./PrizeSplitter";
import { extractVideoLinks } from "./video";
import { extractImageLinks } from "./image";
import { prepareTweets } from "./tweet";
import exampleIssues from "./example.json";

const token = "YOUR_ACCESS_TOKEN"; // Optional

async function getTwitterName(username) {
  const userUrl = `https://api.github.com/users/${username}`;
  const response = await fetch(userUrl);
  const user = await response.json();
  return `@${user.twitter_username}` || username;
}

export default function Load() {
  const [view, setView] = useState("evaluate");
  const [prize, setPrize] = useState({ total: 150, values: [75, 75 + 50] });
  const [issues, setIssues] = useState([]);
  const [owner, setOwner] = useState("Algorithm-Arena");
  const [repo, setRepo] = useState(
    "weekly-challenge-23-unconventional-randomness"
  );

  const changePrizes = (newValues) => {
    setPrize((prev) => ({ ...prev, values: newValues }));
  };

  const load = async () => {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        headers: {
          // Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    const data = await res.json();
    const newIssues = data;
    for (const issue of newIssues) {
      issue.twitterName = await getTwitterName(issue.user.login);
    }
    setIssues(newIssues);
  };

  const sort = (index, direction = 1) =>
    setIssues((prev) => {
      const newIssues = [...prev];
      const item = newIssues.splice(index, 1)[0];
      newIssues.splice(index + direction, 0, item);
      return newIssues;
    });

  const setPosition = (index, position) =>
    setIssues((prev) => {
      const newIssues = [...prev];
      const element = newIssues.splice(index, 1)[0];
      newIssues.splice(position, 0, element);
      return newIssues;
    });

  const setBlurb = (index, blurb) =>
    setIssues((prev) => {
      const newIssues = [...prev];
      newIssues[index] = { ...newIssues[index], blurb };
      return newIssues;
    });

  const toggleHonorableMention = (index) => {
    setIssues((prev) => {
      const newIssues = [...prev];
      newIssues[index] = {
        ...newIssues[index],
        honorableMention: !newIssues[index].honorableMention,
      };
      return newIssues;
    });
  };

  const convert = () => {
    const entries = issues.map((issue) => {
      const { body } = issue;
      const { markdownImages, directImages } = extractImageLinks(body);
      const { githubAssets, youtubeLinks } = extractVideoLinks(body);
      const videoUrl = githubAssets[0];
      const youtubeUrl = youtubeLinks[0];
      return { videoUrl, youtubeUrl, markdownImages, directImages };
    });
    fetch("http://localhost:3000/convert-videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entries, owner, repo }),
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
          disabled={false}
        >
          Load
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={convert}
          disabled={issues.length === 0}
        >
          Convert
        </button>
      </div>
      <div className="my-10 pl-14">
        <PrizeSplitter prize={prize} changePrizes={changePrizes} />
      </div>
      {issues.length > 0 && (
        <div>
          <div class="flex space-x-2 justify-center">
            <button
              onClick={() => setView("evaluate")}
              className={`py-2 px-4 ${
                view === "evaluate"
                  ? "text-white bg-blue-500"
                  : "text-gray-500 bg-gray-200 hover:bg-gray-300"
              } rounded-t-lg focus:outline-none`}
            >
              Evaluate
            </button>

            <button
              onClick={() => setView("twitter")}
              className={`py-2 px-4 ${
                view === "twitter"
                  ? "text-white bg-blue-500"
                  : "text-gray-500 bg-gray-200 hover:bg-gray-300"
              } rounded-t-lg focus:outline-none`}
            >
              Share
            </button>
            <button
              onClick={() => setView("markdown")}
              className={`py-2 px-4 ${
                view === "markdown"
                  ? "text-white bg-blue-500"
                  : "text-gray-500 bg-gray-200 hover:bg-gray-300"
              } rounded-t-lg focus:outline-none`}
            >
              Markdown
            </button>
          </div>
          {view === "evaluate" && (
            <Issues
              issues={issues}
              setPosition={setPosition}
              sort={sort}
              setBlurb={setBlurb}
              toggleHonorableMention={toggleHonorableMention}
            />
          )}
          {view === "twitter" && (
            <div className="flex flex-col gap-2 w-full">
              {prepareTweets({ issues, prize }).map((tweet, i) => (
                <Tweet key={i} tweet={tweet} />
              ))}
            </div>
          )}
          {view === "markdown" && <Markdown issues={issues} prize={prize} />}
        </div>
      )}
    </div>
  );
}
