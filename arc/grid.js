const { Color, colorMap } = require("./colors");

class Grid {
  constructor(gridData) {
    if (
      !Array.isArray(gridData) ||
      !gridData.every((row) => Array.isArray(row))
    ) {
      throw new Error("Invalid grid data: expected array of arrays");
    }

    this.rows = gridData.length;
    this.cols = gridData[0].length;
    this.grid = gridData.map((row) => [...row]);

    // Validate grid data
    for (let i = 0; i < this.rows; i++) {
      if (this.grid[i].length !== this.cols) {
        throw new Error(
          "Invalid grid data: all rows must have the same length"
        );
      }
      for (let j = 0; j < this.cols; j++) {
        if (
          !Number.isInteger(this.grid[i][j]) ||
          this.grid[i][j] < 0 ||
          this.grid[i][j] > 9
        ) {
          throw new Error(
            `Invalid color value at position (${i}, ${j}): ${this.grid[i][j]}`
          );
        }
      }
    }
  }

  padLog(content, padding = 4) {
    const padLine = (line) => " ".repeat(padding) + line;
    content.split("\n").forEach((line) => console.log(padLine(line)));
  }

  printGrid() {
    let output = "";
    for (let i = 0; i < this.rows; i++) {
      let row = "";
      for (let j = 0; j < this.cols; j++) {
        const cellValue = this.grid[i][j];
        const colorCode = colorMap[cellValue] || colorMap[Color.EMPTY];
        row += `${colorCode}■ `;
      }
      output += row + "\x1b[0m\n"; // Reset color at the end of each row
    }
    this.padLog(output);
  }

  toString() {
    let output = "";
    for (let i = 0; i < this.rows; i++) {
      let row = "";
      for (let j = 0; j < this.cols; j++) {
        const cellValue = this.grid[i][j];
        row += `${cellValue} `;
      }
      output += row.trim() + "\n";
    }
    return output.trim();
  }

  compare(otherGrid) {
    if (!(otherGrid instanceof Grid)) {
      throw new Error("Input must be a Grid instance");
    }

    if (this.rows !== otherGrid.rows || this.cols !== otherGrid.cols) {
      throw new Error(
        `Grids must have the same dimensions. This grid: ${this.rows}x${this.cols}, Other grid: ${otherGrid.rows}x${otherGrid.cols}`
      );
    }

    let matchingCells = 0;
    const totalCells = this.rows * this.cols;

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid[i][j] === otherGrid.grid[i][j]) {
          matchingCells++;
        }
      }
    }

    return (matchingCells / totalCells) * 100;
  }
}

module.exports = {
  Grid,
};
