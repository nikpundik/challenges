import { Button, Input, HStack } from "@chakra-ui/react";
import { FC, useState } from "react";

type AddPlayerProps = {
  addPlayer: (name: string) => void;
};
const AddPlayer: FC<AddPlayerProps> = ({ addPlayer }) => {
  const [name, setName] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim() !== "") {
          addPlayer(name);
          setName("");
        }
      }}
    >
      <HStack spacing={4}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Bobby"
        />
        <Button type="submit" variant="outline" colorScheme="teal">
          Add player
        </Button>
      </HStack>
    </form>
  );
};

export default AddPlayer;
