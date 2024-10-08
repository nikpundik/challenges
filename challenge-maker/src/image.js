export const extractImageLinks = (issueBody) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];

  // Regex to match markdown image syntax ![alt](image-url)
  const markdownImagePattern = /!\[[^\]]*\]\((https?:\/\/[^\s\)]+)\)/gi;

  // General URL pattern (matching image extensions)
  const urlPattern = /https?:\/\/[^\s\)]+/gi;
  const urls = issueBody.match(urlPattern) || [];

  // Extract image URLs from markdown pattern
  const markdownImages = [];
  let match;
  while ((match = markdownImagePattern.exec(issueBody)) !== null) {
    markdownImages.push(match[1]);
  }

  // Filter for direct image URLs that match known image extensions
  const directImages = urls.filter((url) =>
    imageExtensions.some((ext) => url.toLowerCase().endsWith(`.${ext}`))
  );

  return { markdownImages, directImages };
};
