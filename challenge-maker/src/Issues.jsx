import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { extractVideoLinks } from "./video";
import { extractImageLinks } from "./image";

function Issue({ issue, index, last, sort, setBlurb }) {
  const [open, setOpen] = useState(false);
  const { githubAssets } = extractVideoLinks(issue.body);
  const { markdownImages, directImages } = extractImageLinks(issue.body);
  const image = markdownImages[0] || directImages[0];
  return (
    <div className="w-full bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-gray-800 font-semibold mb-1">
            {issue.title}
          </h2>
          <button
            className="px-3 py-1 border-solid border-2 shrink-0 text-xs text-gray-700 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setOpen((prev) => !prev)}
          >
            more / less
          </button>
        </div>
        <p className="text-sm text-gray-600">By {issue.user.login}</p>
      </div>
      {open && (
        <div className="px-4 flex-grow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <video controls className="w-full h-48 object-cover rounded-md">
                <source src={githubAssets[0]} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div>
              {image && (
                <img
                  src={image || "https://via.placeholder.com/300x200"}
                  alt={issue.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-coverrounded-md"
                />
              )}
            </div>
          </div>
          <div className="mt-4 prose sm:prose-md">
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {issue.body}
            </Markdown>
          </div>
        </div>
      )}
      <div className="px-4 py-3">
        <textarea
          placeholder="Blurb"
          name="blurb"
          className="w-full h-24 px-4 py-2 border-solid border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          value={issue.blurb}
          onChange={(event) => setBlurb(index, event.target.value)}
        ></textarea>
      </div>
      <div className="px-4 py-3 bg-gray-100 flex justify-between">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => sort(index, -1)}
          disabled={index === 0}
        >
          ↑<span className="sr-only">Move up</span>
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => sort(index, 1)}
          disabled={last}
        >
          ↓<span className="sr-only">Move down</span>
        </button>
      </div>
    </div>
  );
}

export default function Issues({ issues, sort, setBlurb }) {
  return (
    <div className="grid gap-6 grid-cols-1 w-full">
      {issues.map((issue, index) => (
        <div className="w-full flex gap-4">
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 border-solid border-2 rounded-full shrink-0 mt-4">
            {index + 1}
          </div>
          <div className="grow">
            <Issue
              key={issue.id}
              issue={issue}
              index={index}
              last={index === issues.length - 1}
              sort={sort}
              setBlurb={setBlurb}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
