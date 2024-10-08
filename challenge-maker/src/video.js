export const extractVideoLinks = (issueBody) => {
  const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm", "flv"];
  const youtubePatterns = [
    /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[\w-]+/gi,
    /https?:\/\/youtu\.be\/[\w-]+/gi,
  ];

  // Pattern for GitHub assets (video and other files)
  const githubAssetPattern =
    /https:\/\/github\.com\/[\w-]+\/[\w-]+\/assets\/[\w-]+\/[\w-]+/gi;

  // General URL pattern (strips possible markdown and trailing characters like parentheses)
  const urlPattern = /https?:\/\/[^\s\)]+/gi;

  // Extract URLs (now stripping unwanted characters)
  const urls = issueBody.match(urlPattern) || [];

  // Filter for direct video file links
  const videoFiles = urls.filter((url) =>
    videoExtensions.some((ext) => url.endsWith(`.${ext}`))
  );

  // Filter for YouTube links
  const youtubeLinks = urls.filter((url) =>
    youtubePatterns.some((pattern) => pattern.test(url))
  );

  // Filter for GitHub assets (including images or videos)
  const githubAssets = urls.filter((url) => githubAssetPattern.test(url));

  return { githubAssets, videoFiles, youtubeLinks };
};
