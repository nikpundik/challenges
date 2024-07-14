import { FC } from "react";
import {
  Button,
  Box,
  Heading,
  HStack,
  Image,
  Tag,
  VStack,
  Text,
} from "@chakra-ui/react";
import AddPlayer from "../AddPlayer";
import { Player } from "../../types";

type StartProps = {
  players: Player[];
  addPlayer: (name: string) => void;
  start: () => void;
};

const Start: FC<StartProps> = ({ players, addPlayer, start }) => {
  return (
    <VStack spacing={16} alignItems="stretch">
      <Image
        src="/splash.jpeg"
        alt="Splash"
        width="100%"
        borderRadius="lg"
        boxShadow="md"
      />
      <Box maxW="container.md" borderRadius="lg">
        <VStack spacing={1} alignItems="stretch">
          <Heading>Players</Heading>
          <Text>Add players to start. At least 4 players required.</Text>
          <HStack spacing={2} wrap="wrap" paddingBottom={4}>
            {players.map((player) => (
              <Tag
                size="lg"
                key={player.id}
                variant="subtle"
                colorScheme="teal"
              >
                {player.name}
              </Tag>
            ))}
          </HStack>
          <Box
            maxW="container.md"
            bg="white"
            p={3}
            boxShadow="md"
            borderRadius="lg"
          >
            <VStack spacing={4} alignItems="stretch">
              <AddPlayer addPlayer={addPlayer} />
              <Button
                colorScheme="teal"
                size="lg"
                isDisabled={players.length < 4}
                onClick={start}
              >
                Start
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
};

export default Start;
