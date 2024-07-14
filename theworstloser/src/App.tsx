import { Box, Container, VStack } from "@chakra-ui/react";
import RoundDisplay from "./components/Round";
import useGameState from "./hooks/useGameState";
import Start from "./components/Start";
import End from "./components/End";

function App() {
  const { state, vote, next, addPlayer, start, selectChampion } =
    useGameState();
  return (
    <Box bg="gray.100" minH="100vh" py={10}>
      <Container maxW="container.md">
        {state.status === "playing" && state.round && (
          <VStack spacing={32} alignItems="stretch">
            <RoundDisplay
              totalPlayers={state.players.length}
              round={state.round}
              vote={vote}
              next={next}
              selectChampion={selectChampion}
              past={false}
            />
            {state.rounds.map((round) => (
              <RoundDisplay
                key={round.index}
                totalPlayers={state.players.length}
                round={round}
                vote={vote}
                next={next}
                selectChampion={selectChampion}
                past
              />
            ))}
          </VStack>
        )}
        {state.status === "start" && (
          <Start players={state.players} addPlayer={addPlayer} start={start} />
        )}
        {state.status === "end" && state.round && <End round={state.round} />}
      </Container>
    </Box>
  );
}

export default App;
