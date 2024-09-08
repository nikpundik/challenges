// Enum for colors
const Color = {
  EMPTY: 0,
  RED: 1,
  GREEN: 2,
  BLUE: 3,
  YELLOW: 4,
  PURPLE: 5,
  CYAN: 6,
  ORANGE: 7,
  PINK: 8,
  BROWN: 9,
};

const colorMap = {
  [Color.EMPTY]: "\x1b[0m", // Reset color
  [Color.RED]: "\x1b[31m",
  [Color.GREEN]: "\x1b[32m",
  [Color.BLUE]: "\x1b[34m",
  [Color.YELLOW]: "\x1b[33m",
  [Color.PURPLE]: "\x1b[35m",
  [Color.CYAN]: "\x1b[36m",
  [Color.ORANGE]: "\x1b[38;5;208m",
  [Color.PINK]: "\x1b[38;5;205m",
  [Color.BROWN]: "\x1b[38;5;130m",
};

module.exports = {
  Color,
  colorMap,
};
