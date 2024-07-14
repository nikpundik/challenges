export type Topic = {
  key: string;
  title: string;
  image: string;
};

export type Player = {
  id: number;
  name: string;
  votes: number;
};

export type Round = {
  index: number;
  topic: Topic;
  losers: Player[];
  champion: number | null;
};
