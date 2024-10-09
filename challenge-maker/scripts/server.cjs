const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// Directory where videos will be saved temporarily
const DOWNLOAD_DIR = path.join(__dirname, "downloads");

// Ensure the downloads directory exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

// Helper function to download video
const downloadVideo = async (url, dest) => {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(dest);
    response.data.pipe(writer);

    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const outputOptionsV4 = [
  "-c:v libx264", // H.264 codec
  "-c:a aac", // AAC audio codec
  "-b:v 1M", // Video bitrate of 1 Mbps
  "-vf scale=w=1280:h=trunc(ow/a/2)*2", // Scale to 1280 width, maintaining aspect ratio
  "-max_muxing_queue_size 1024",
  "-movflags +faststart", // Optimize for web streaming
  "-fs 9.8M", // Limit output file size to just under 10MB
];

const outputOptionsV7 = [
  "-c:v libx264", // H.264 codec
  "-c:a aac", // AAC audio codec
  "-b:v 1M", // Video bitrate of 1 Mbps
  "-max_muxing_queue_size 1024",
  "-movflags +faststart", // Optimize for web streaming
  "-fs 10M", // Limit output file size to 10MB
];

// Helper function to compress video to fit Twitter requirements
const compressVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions(outputOptionsV4)
      .on("end", resolve)
      .on("error", reject)
      .save(outputPath);
  });
};

const downloadAndCompressVideos = async (entries, owner, repo) => {
  const compressedVideos = [];

  for (const entry of entries) {
    const { videoUrl } = entry;

    if (!videoUrl) {
      console.log("No video");
      continue;
    }

    const videoFilename = path.basename(videoUrl);
    const workPath = path.join(DOWNLOAD_DIR, owner, repo);
    if (!fs.existsSync(workPath)) {
      fs.mkdirSync(workPath, { recursive: true });
    }
    const downloadPath = path.join(workPath, videoFilename);
    const compressedPath = path.join(
      DOWNLOAD_DIR,
      `compressed_${videoFilename}.mp4`
    );

    // Download the video
    if (!fs.existsSync(downloadPath)) {
      await downloadVideo(videoUrl, downloadPath);
      console.log(`Downloaded: ${videoUrl}`);
    } else {
      console.log(`Already downloaded: ${videoUrl}`);
    }

    // Compress the video for Twitter
    await compressVideo(downloadPath, compressedPath);
    console.log(`Compressed: ${compressedPath}`);

    // Save compressed video info
    compressedVideos.push({
      originalUrl: videoUrl,
      compressedVideo: compressedPath,
    });

    // Clean up original downloaded file
    fs.unlinkSync(downloadPath);
  }
};

// POST endpoint to handle video compression requests
app.post("/convert-videos", async (req, res) => {
  const { entries, owner, repo } = req.body;

  if (!entries || !Array.isArray(entries)) {
    return res
      .status(400)
      .send({ error: "Entries should be an array of video URLs" });
  }

  try {
    downloadAndCompressVideos(entries, owner, repo);
    console.log("Compressing videos:", entries);

    res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to process videos" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
