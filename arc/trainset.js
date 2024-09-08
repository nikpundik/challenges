const { Grid } = require("./grid");

class TrainSet {
  constructor(name, { train, test }) {
    if (!Array.isArray(train) || !Array.isArray(test)) {
      throw new Error("Train and test sets must be arrays");
    }

    this.name = name;
    this.train = train.map(this.createGridPair);
    this.test = test.map(this.createGridPair);
  }

  createGridPair(item) {
    if (
      !item.input ||
      !item.output ||
      !Array.isArray(item.input) ||
      !Array.isArray(item.output)
    ) {
      throw new Error("Each item must have input and output arrays");
    }

    return {
      input: new Grid(item.input),
      output: new Grid(item.output),
    };
  }

  padLog(content, padding = 4) {
    const padLine = (line) => " ".repeat(padding) + line;
    content.split("\n").forEach((line) => console.log(padLine(line)));
  }

  printTrainSet() {
    this.padLog(`*** Train Set ${this.name} ***`);
    this.padLog("Train Grids:");
    this.train.forEach((pair, index) => {
      this.padLog(`Train Input Grid ${index + 1}:`);
      this.padLog(pair.input.toString());
      this.padLog(`Train Output Grid ${index + 1}:`);
      this.padLog(pair.output.toString());
      this.padLog("");
    });

    this.padLog("Test Grids:");
    this.test.forEach((pair, index) => {
      this.padLog(`Test Input Grid ${index + 1}:`);
      this.padLog(pair.input.toString());
      this.padLog(`Test Output Grid ${index + 1}:`);
      this.padLog(pair.output.toString());
      this.padLog("");
    });
  }

  createReplicationSolution(input, output) {
    const inputRows = input.rows;
    const inputCols = input.cols;
    const outputRows = output.rows;
    const outputCols = output.cols;

    if (outputRows % inputRows !== 0 || outputCols % inputCols !== 0) {
      return null;
    }

    const solutionData = Array(outputRows)
      .fill()
      .map(() => Array(outputCols).fill(0));

    for (let i = 0; i < outputRows; i++) {
      for (let j = 0; j < outputCols; j++) {
        const inputRowIndex = i % inputRows;
        const inputColIndex = j % inputCols;
        solutionData[i][j] = input.grid[inputRowIndex][inputColIndex];
      }
    }

    return new Grid(solutionData);
  }

  createMirrorSolution(input, output) {
    const solutionData = Array(output.rows)
      .fill()
      .map(() => Array(output.cols).fill(0));

    for (let i = 0; i < output.rows; i++) {
      for (let j = 0; j < output.cols; j++) {
        const inputCol = input.cols - 1 - (j % input.cols);
        const inputRow = i % input.rows;
        solutionData[i][j] = input.grid[inputRow][inputCol];
      }
    }

    return new Grid(solutionData);
  }

  createFlipSolution(input, output) {
    const solutionData = Array(output.rows)
      .fill()
      .map(() => Array(output.cols).fill(0));

    for (let i = 0; i < output.rows; i++) {
      for (let j = 0; j < output.cols; j++) {
        const inputRow = input.rows - 1 - (i % input.rows);
        const inputCol = j % input.cols;
        solutionData[i][j] = input.grid[inputRow][inputCol];
      }
    }

    return new Grid(solutionData);
  }

  createScalingSolution(input, output) {
    const inputRows = input.rows;
    const inputCols = input.cols;
    const outputRows = output.rows;
    const outputCols = output.cols;

    const rowScale = outputRows / inputRows;
    const colScale = outputCols / inputCols;

    if (!Number.isInteger(rowScale) || !Number.isInteger(colScale)) {
      return null;
    }

    const solutionData = Array(outputRows)
      .fill()
      .map(() => Array(outputCols).fill(0));

    for (let i = 0; i < outputRows; i++) {
      for (let j = 0; j < outputCols; j++) {
        const inputRowIndex = Math.floor(i / rowScale);
        const inputColIndex = Math.floor(j / colScale);
        solutionData[i][j] = input.grid[inputRowIndex][inputColIndex];
      }
    }

    return new Grid(solutionData);
  }

  createSymmetrySolution(input, output) {
    const symmetryTypes = ["horizontal", "vertical", "diagonal"];

    for (const type of symmetryTypes) {
      const solution = this.applySymmetry(input, output, type);
      if (solution) return solution;
    }

    return null;
  }

  applySymmetry(input, output, type) {
    const solutionData = Array(output.rows)
      .fill()
      .map(() => Array(output.cols).fill(0));

    const inputRows = input.rows;
    const inputCols = input.cols;

    for (let i = 0; i < output.rows; i++) {
      for (let j = 0; j < output.cols; j++) {
        let sourceI, sourceJ;

        switch (type) {
          case "horizontal":
            sourceI = i % inputRows;
            sourceJ = j < inputCols ? j : inputCols - 1 - (j % inputCols);
            break;
          case "vertical":
            sourceI = i < inputRows ? i : inputRows - 1 - (i % inputRows);
            sourceJ = j % inputCols;
            break;
          case "diagonal":
            if (inputRows !== inputCols) return null;
            sourceI = Math.min(i, j) % inputRows;
            sourceJ = Math.min(i, j) % inputCols;
            break;
        }

        solutionData[i][j] = input.grid[sourceI][sourceJ];
      }
    }

    return new Grid(solutionData);
  }

  findBestSolution(input, output) {
    const solutions = [
      {
        name: "replication",
        func: () => this.createReplicationSolution(input, output),
      },
      {
        name: "mirror",
        func: () => this.createMirrorSolution(input, output),
      },
      {
        name: "flip",
        func: () => this.createFlipSolution(input, output),
      },
      {
        name: "scaling",
        func: () => this.createScalingSolution(input, output),
      },
      {
        name: "symmetry",
        func: () => this.createSymmetrySolution(input, output),
      },
    ];

    let bestAccuracy = 0;
    let bestActions = [];

    for (const solution of solutions) {
      const solutionGrid = solution.func();
      if (solutionGrid) {
        const accuracy = output.compare(solutionGrid);
        if (accuracy > bestAccuracy) {
          bestAccuracy = accuracy;
          bestActions = [solution.name];
        }
      }
    }

    for (let i = 0; i < solutions.length; i++) {
      for (let j = 0; j < solutions.length; j++) {
        if (i !== j) {
          let solutionGrid = solutions[i].func();
          if (solutionGrid) {
            solutionGrid = solutions[j].func() || solutionGrid;
            const accuracy = output.compare(solutionGrid);
            if (accuracy > bestAccuracy) {
              bestAccuracy = accuracy;
              bestActions = [solutions[i].name, solutions[j].name];
            }
          }
        }
      }
    }

    return { actions: bestActions, accuracy: bestAccuracy };
  }

  applySolutions(input, output, actions) {
    let result = new Grid(
      Array(output.rows)
        .fill()
        .map(() => Array(output.cols).fill(0))
    );

    for (const action of actions) {
      if (action === "replication") {
        result = this.createReplicationSolution(input, output) || result;
      } else if (action === "mirror") {
        result = this.createMirrorSolution(input, output);
      } else if (action === "flip") {
        result = this.createFlipSolution(input, output);
      } else if (action === "scaling") {
        result = this.createScalingSolution(input, output) || result;
      } else if (action === "symmetry") {
        result = this.createSymmetrySolution(input, output) || result;
      }
    }
    return result;
  }

  findSolutions() {
    const trainSolutions = [];
    let totalTrainAccuracy = 0;

    for (const pair of this.train) {
      const { input, output } = pair;
      const { actions, accuracy } = this.findBestSolution(input, output);

      const solutionGrid = this.applySolutions(input, output, actions);

      trainSolutions.push({
        input: input,
        expectedOutput: output,
        proposedSolution: solutionGrid,
        accuracy: accuracy,
        actions: actions,
      });

      totalTrainAccuracy += accuracy;
    }

    this.averageTrainAccuracy = totalTrainAccuracy / this.train.length;

    const testSolutions = [];
    let totalTestAccuracy = 0;

    for (const pair of this.test) {
      const { input, output } = pair;
      const solutionGrid = this.applySolutions(
        input,
        output,
        trainSolutions[0].actions
      );
      const accuracy = output.compare(solutionGrid);

      testSolutions.push({
        input: input,
        expectedOutput: output,
        proposedSolution: solutionGrid,
        accuracy: accuracy,
        actions: trainSolutions[0].actions,
      });

      totalTestAccuracy += accuracy;
    }

    this.averageTestAccuracy = totalTestAccuracy / this.test.length;

    this.trainSolutions = trainSolutions;
    this.testSolutions = testSolutions;
  }

  printSolutions(type = "train") {
    const solutions =
      type === "test" ? this.testSolutions : this.trainSolutions;

    this.padLog("\n" + ":".repeat(50));
    this.padLog(
      `${type.toUpperCase()} SOLUTIONS FOR TRAINING SET ${this.name.toUpperCase()}`
    );
    this.padLog(":".repeat(50));

    solutions.forEach((solution, index) => {
      this.padLog("\n" + "-".repeat(30));
      this.padLog(`Solution ${index + 1}`.padStart(20, " ").padEnd(30, " "));
      this.padLog("-".repeat(30));

      this.padLog("\n🔹 Input:");
      solution.input.printGrid();

      this.padLog("\n🔹 Expected Output:");
      solution.expectedOutput.printGrid();

      this.padLog("\n🔹 Proposed Solution:");
      solution.proposedSolution.printGrid();

      this.padLog("\n" + "-".repeat(30));
      this.padLog(`Accuracy: ${solution.accuracy.toFixed(2)}%`.padStart(30));
      this.padLog("-".repeat(30) + "\n");
    });
  }
}

module.exports = {
  TrainSet,
};
