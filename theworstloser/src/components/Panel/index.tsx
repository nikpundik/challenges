import { Container, Box, Text, Alert, AlertIcon } from "@chakra-ui/react";
import { FC } from "react";
import { Round } from "../../types";
import { getRoundRoles } from "../../helpers/round";

type PanelProps = {
  round: Round;
  totalPlayers: number;
};

const Panel: FC<PanelProps> = ({ round, totalPlayers }) => {
  const { champions, losers, canProceed, totalVotes } = getRoundRoles(round);
  return (
    <Box
      position="fixed"
      left={0}
      bottom={0}
      width="100%"
      zIndex={1000}
      paddingTop={4}
      bgGradient="linear(to-t, gray.700, rgba(0, 128, 128, 0))"
    >
      <Container maxW="container.md" padding={4}>
        {totalVotes === totalPlayers && champions.length > 1 && (
          <Alert status="warning" borderRadius="lg" w="full" boxShadow="md">
            <AlertIcon />
            <Text fontSize="sm">
              That's a tie! Let the worst losers decide who is the champion.
            </Text>
          </Alert>
        )}
        {totalVotes < totalPlayers && (
          <Alert
            status="warning"
            borderRadius="lg"
            colorScheme="teal"
            w="full"
            boxShadow="md"
          >
            <AlertIcon />
            <Text fontSize="sm">
              There are still {totalPlayers - totalVotes} votes left.
            </Text>
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default Panel;
