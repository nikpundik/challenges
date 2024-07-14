import React from "react";
import {
  Box,
  HStack,
  Button,
  Tag,
  Checkbox,
  TagLabel,
  Text,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { Player, Round } from "../../types";

type PlayerTagProps = {
  player: Player;
  round: Round;
  vote: (player: number, vote: 1 | -1) => void;
  selectChampion: (player: number) => void;
  tie: boolean;
  past: boolean;
};

const PlayerTag: React.FC<PlayerTagProps> = ({
  player,
  round,
  vote,
  selectChampion,
  tie,
  past,
}) => {
  return (
    <Box p={4} bg="gray.50" borderRadius="md" boxShadow="md">
      <HStack justifyContent="space-between" align="center">
        <HStack justifyContent="space-between" align="center">
          <Text fontSize="lg" fontWeight="bold">
            {player.name}
          </Text>
          {player.id === round.champion && (
            <Badge colorScheme="red" fontSize="xs" borderRadius="md">
              not a loser
            </Badge>
          )}
        </HStack>
        {tie && !past && (
          <Checkbox
            colorScheme="teal"
            isChecked={player.id === round.champion}
            onChange={() => selectChampion(player.id)}
          >
            <Text fontSize="sm" colorScheme="gray">
              not a loser
            </Text>
          </Checkbox>
        )}
      </HStack>
      <HStack spacing={4} justifyContent="space-between" align="center">
        <VStack alignItems={"flex-start"}>
          <Text fontSize="sm" color="gray.500">
            {`is the worst loser at "${round.topic.title}" because...`}
          </Text>
        </VStack>
        <HStack spacing={1}>
          {!past && (
            <>
              <Button
                size="sm"
                colorScheme="green"
                variant="ghost"
                borderRadius="lg"
                onClick={() => vote(player.id, 1)}
              >
                <ArrowUpIcon />
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                variant="ghost"
                borderRadius="lg"
                onClick={() => vote(player.id, -1)}
              >
                <ArrowDownIcon />
              </Button>
            </>
          )}
          <Tag size="lg" colorScheme="teal" borderRadius="md">
            <TagLabel>
              <b>{player.votes}</b>
            </TagLabel>
          </Tag>
        </HStack>
      </HStack>
    </Box>
  );
};

export default PlayerTag;
