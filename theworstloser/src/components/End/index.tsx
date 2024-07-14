import { FC } from "react";
import { Box, Heading, Image, VStack } from "@chakra-ui/react";
import { Round } from "../../types";
import { getRoundRoles } from "../../helpers/round";

type EndProps = {
  round: Round;
};

const End: FC<EndProps> = ({ round }) => {
  const { champion } = getRoundRoles(round);
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
          <Heading textAlign="center" fontSize="2xl">
            the Worst Loser
          </Heading>
          <Heading textAlign="center" color="teal">
            {champion?.name}
          </Heading>
        </VStack>
      </Box>
    </VStack>
  );
};

export default End;
