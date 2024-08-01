import { Input, Select, Stack } from "@chakra-ui/react";

function Skill({ skill }) {
  return (
    <Stack spacing={5} direction="row">
      <Input
        value={skill.label}
        type="text"
        placeholder="Javascript"
        onChange={(e) => skill.setLabel(e.target.value)}
        maxLength={35}
      />
      <Select
        value={skill.skill}
        onChange={(e) => skill.setSkill(e.target.value)}
      >
        <option>0</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </Select>
    </Stack>
  );
}

export default Skill;
