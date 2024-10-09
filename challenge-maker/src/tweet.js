const getPosition = (index, prize) => {
  if (index === 0) {
    return `The winner for ${prize.values[0]}$ is`;
  }
  if (index === 1) {
    return `In second place for ${prize.values[1] - prize.values[0]}$ is`;
  }
  if (index === 2) {
    return `In third place for ${prize.total - prize.values[1]}$ is`;
  }
  return "Honorable mention for";
};

export const prepareTweets = ({ issues, prize }) => {
  return issues
    .filter((issue, i) => i < 3 || issue.honorableMention)
    .map((issue, index) => {
      return `${getPosition(index, prize)} ${issue.twitterName}! ${
        issue.blurb || ""
      } ${issue.html_url}`;
    });
};
