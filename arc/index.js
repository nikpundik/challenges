const fs = require("fs");
const path = require("path");
const { TrainSet } = require("./trainset");

// Parse command-line arguments
// Usage: node index.js [dataSet] [logLevel]
// Example: node index.js training extended
const dataSet = process.argv[2] || "training";
const logLevel = process.argv[3] || "basic";

const dataFolder = path.join(__dirname, "data", dataSet);

// Fancy logging function with left padding
const fancyLog = (title, content, padding = 4) => {
  const padLine = (line) => " ".repeat(padding) + line;
  console.log("\n" + padLine("=".repeat(50)));
  console.log(padLine(`${title.toUpperCase()}`));
  console.log(padLine("=".repeat(50)));
  content.split("\n").forEach((line) => console.log(padLine(line)));
};

// Read all JSON files in the specified data folder
const trainSets = fs
  .readdirSync(dataFolder)
  .filter((file) => file.endsWith(".json"))
  .map((file) => {
    const filePath = path.join(dataFolder, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileContent);

    // Create a TrainSet instance for each JSON file
    return new TrainSet(file, jsonData);
  });

trainSets.forEach((trainSet) => {
  trainSet.findSolutions();
  if (
    trainSet.averageTestAccuracy === 100 &&
    trainSet.averageTrainAccuracy === 100
  ) {
    if (logLevel === "basic") {
      fancyLog(
        `Train set ${trainSet.name}`,
        `Train Accuracy: ${trainSet.averageTrainAccuracy.toFixed(
          2
        )}%\nTest Accuracy: ${trainSet.averageTestAccuracy.toFixed(2)}%`
      );
    } else if (logLevel === "extended") {
      fancyLog(
        `Train set ${trainSet.name}`,
        `Train Accuracy: ${trainSet.averageTrainAccuracy.toFixed(
          2
        )}%\nTest Accuracy: ${trainSet.averageTestAccuracy.toFixed(2)}%`
      );
      trainSet.printSolutions("test");
    }
  }
});
