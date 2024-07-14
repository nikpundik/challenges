import { shuffle } from "lodash";
import { useReducer } from "react";
import { Player, Round, Topic } from "../types";
import { topics } from "../data/topics";
import { getRoundRoles } from "../helpers/round";

type GameState = {
  players: Player[];
  round: Round | null;
  rounds: Round[];
  topics: Topic[];
  status: "start" | "playing" | "end";
};

type StartAction = {
  type: "start";
};

type AddPlayerAction = {
  type: "addPlayer";
  name: string;
};

type NextAction = {
  type: "next";
};

type SelectChampionAction = {
  type: "selectChampion";
  player: number;
};

type VoteAction = {
  type: "vote";
  points: 1 | -1;
  player: number;
};

type GameAction =
  | StartAction
  | AddPlayerAction
  | VoteAction
  | NextAction
  | SelectChampionAction;

const initialState: GameState = {
  players: [],
  rounds: [],
  round: null,
  status: "start",
  topics: [],
};

const reducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "start":
      const newTopics = shuffle(
        state.topics.length === 0 ? topics : state.topics
      );
      const topic = newTopics.pop();
      if (!topic) {
        return {
          ...state,
          status: "end",
        };
      }
      const round = {
        index: 0,
        topic,
        champion: null,
        losers: [...state.players],
      };
      return {
        ...state,
        topics: newTopics,
        status: "playing",
        round,
        rounds: [],
      };
    case "addPlayer":
      return {
        ...state,
        players: [
          ...state.players,
          { id: state.players.length, name: action.name, votes: 0 },
        ],
      };
    case "next": {
      if (!state.round) {
        throw new Error();
      }
      const { champion } = getRoundRoles(state.round);
      if (!champion) {
        throw new Error();
      }
      const newTopics =
        state.topics.length === 0 ? topics : shuffle(state.topics);
      const topic = newTopics.pop();
      if (!topic) {
        return {
          ...state,
          status: "end",
        };
      }
      const round = {
        index: state.round.index + 1,
        topic,
        losers: state.round.losers
          .filter((player) => player.id !== champion?.id)
          .map((player) => ({ ...player, votes: 0 })),
        champion: null,
      };
      return {
        ...state,
        topics: newTopics,
        status: round.losers.length === 1 ? "end" : "playing",
        round,
        rounds: [state.round, ...state.rounds],
      };
    }
    case "selectChampion": {
      if (!state.round) {
        throw new Error();
      }
      return {
        ...state,
        round: {
          ...state.round,
          champion:
            state.round.champion === action.player ? null : action.player,
        },
      };
    }
    case "vote": {
      if (!state.round) {
        throw new Error();
      }
      const totalVotes =
        state.round.losers.reduce((acc, player) => {
          return acc + player.votes;
        }, 0) + action.points;
      if (totalVotes < 0 || totalVotes > state.players.length) {
        return state;
      }
      return {
        ...state,
        round: {
          ...state.round,
          champion: null,
          losers: state.round.losers.map((player) => {
            if (
              player.id === action.player &&
              player.votes + action.points >= 0
            ) {
              return {
                ...player,
                votes: player.votes + action.points,
              };
            }
            return player;
          }),
        },
      };
    }
    default:
      throw new Error();
  }
};

const useGameState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const vote = (playerId: number, points: 1 | -1) => {
    dispatch({ type: "vote", points, player: playerId });
  };
  const next = () => {
    dispatch({ type: "next" });
  };
  const addPlayer = (name: string) => {
    dispatch({ type: "addPlayer", name });
  };
  const start = () => {
    dispatch({ type: "start" });
  };
  const selectChampion = (player: number) => {
    dispatch({ type: "selectChampion", player });
  };
  return {
    state,
    vote,
    next,
    addPlayer,
    start,
    selectChampion,
  };
};

export default useGameState;
