import { Round } from "../types";

export const getRoundRoles = (round: Round) => {
  let minVote = Number.MAX_SAFE_INTEGER;
  let maxVote = 0;
  let totalVotes = 0;
  round.losers.forEach((player) => {
    if (player.votes < minVote) {
      minVote = player.votes;
    }
    if (player.votes > maxVote) {
      maxVote = player.votes;
    }
    totalVotes += player.votes;
  });
  const champions = round.losers.filter((player) => {
    return player.votes === minVote;
  });
  const filteredChampions = champions.filter((player) => {
    if (player.id === round.champion) {
      return true;
    }
    return round.champion === null && player.votes === minVote;
  });
  const tie =
    round.losers.filter((player) => {
      return player.votes === minVote;
    }).length > 1;
  const losers = round.losers.filter((player) => {
    return player.votes === maxVote;
  });
  const canProceed = filteredChampions.length === 1;
  const champion = canProceed ? filteredChampions[0] : null;
  return { champions, champion, losers, totalVotes, canProceed, tie };
};
