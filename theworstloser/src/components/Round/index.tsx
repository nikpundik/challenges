import {
  Heading,
  Box,
  HStack,
  VStack,
  Image,
  Highlight,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FC } from "react";
import { Round } from "../../types";
import PlayerTag from "../PlayerTag";
import { getRoundRoles } from "../../helpers/round";

type RoundDisplayProps = {
  round: Round;
  totalPlayers: number;
  vote: (player: number, vote: 1 | -1) => void;
  next: () => void;
  selectChampion: (player: number) => void;
  past: boolean;
};

const RoundDisplay: FC<RoundDisplayProps> = ({
  round,
  vote,
  next,
  totalPlayers,
  selectChampion,
  past,
}) => {
  const { canProceed, totalVotes, champions, tie } = getRoundRoles(round);
  const blockedByTie = totalVotes === totalPlayers && tie;
  return (
    <VStack spacing={4} alignItems={"stretch"}>
      <Heading size="md">Round {round.index + 1}</Heading>
      <Heading>
        <Highlight
          query={round.topic.title}
          styles={{ px: "2", py: "1", rounded: "full", bg: "red.100" }}
        >{`Loser at ${round.topic.title}`}</Highlight>
      </Heading>

      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              How to play
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Text>
              In this round, each player will nominate another player from the
              losers pool and explain why that player is the worst loser at '
              {round.topic.title}'. After all nominations are made, each player
              will vote for the player they think is the worst loser. Each
              nominated player should be upvoted on the board. The player with
              the fewest votes will be eliminated from the losers pool for the
              next round. In case of a tie for the fewest votes, the players
              with the most votes will decide among themselves who should be
              eliminated, by ticking the "not a loser" checkbox next to the
              'less' loser player's name.
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <HStack spacing={4} alignItems="flex-start">
        <Box maxW="xs">
          <Image
            src={`/cards/${round.topic.image}`}
            alt={round.topic.title}
            width="100%"
            borderRadius="lg"
            boxShadow="md"
          />
        </Box>
        <Box flexGrow={1}>
          <VStack spacing={2} alignItems={"stretch"}>
            {!past && (
              <Button
                colorScheme="teal"
                isDisabled={totalVotes !== totalPlayers || !canProceed}
                onClick={next}
              >
                Next round ({totalVotes}/{totalPlayers})
              </Button>
            )}
            {round.losers.map((player) => (
              <PlayerTag
                key={player.id}
                player={player}
                round={round}
                vote={vote}
                selectChampion={selectChampion}
                tie={
                  blockedByTie &&
                  champions.some((champion) => champion.id === player.id)
                }
                past={past}
              />
            ))}

            {blockedByTie && !past && (
              <Alert status="warning" borderRadius="lg" w="full" boxShadow="md">
                <AlertIcon />
                <Text fontSize="sm">
                  That's a tie! Let the worst losers decide who is not a loser
                  for this round.
                </Text>
              </Alert>
            )}
          </VStack>
        </Box>
      </HStack>
    </VStack>
  );
};

export default RoundDisplay;
