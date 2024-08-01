import { useMemo, useRef, useState } from "react";
import { Filters } from "konva";
import {
  Input,
  Button,
  Stack,
  Checkbox,
  FormLabel,
  FormControl,
  Box,
  Kbd,
  Text,
} from "@chakra-ui/react";
import useSkill from "./hooks/useSkill";
import Card from "./components/Card";
import Skill from "./components/Skill";
import styles from "./app.module.css";
import { useDebounce } from "@uidotdev/usehooks";

const konvaFilters = [
  [Filters.Posterize, "Posterize"],
  [Filters.Emboss, "Emboss"],
  [Filters.Pixelate, "Pixelate"],
  [Filters.Solarize, "Solarize"],
  [Filters.Grayscale, "Grayscale"],
  [Filters.Invert, "Invert"],
  [Filters.Sepia, "Sepia"],
];

function App() {
  const stageRef = useRef(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const titleCard = useDebounce(title, 500);
  const [role, setRole] = useState("");
  const roleCard = useDebounce(role, 500);
  const [team, setTeam] = useState("");
  const teamCard = useDebounce(team, 500);
  const skill1 = useSkill();
  const skill2 = useSkill();
  const skill3 = useSkill();
  const skill4 = useSkill();
  const [filters, setFilters] = useState([]);

  const handleFileChange = (event) => {
    const f = event.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        setFile(img);
      };
      reader.readAsDataURL(f);
    }
  };

  const handleFilterChange = (filter) => {
    setFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = `${title}.png`;
    link.href = uri;
    link.click();
  };

  const skills = useMemo(
    () => [skill1, skill2, skill3, skill4],
    [skill1, skill2, skill3, skill4]
  );

  const selectedFilters = useMemo(() => {
    return filters.map(([f]) => f);
  }, [filters]);

  return (
    <main className={styles.main}>
      <Box p={10}>
        <Stack spacing={5} direction="row">
          <Box width="50%" p={4}>
            <Card
              stageRef={stageRef}
              file={file}
              title={titleCard}
              team={teamCard}
              role={roleCard}
              skills={skills}
              filters={selectedFilters}
            />
          </Box>
          <Box width="50%">
            <Text fontSize={30} fontWeight={"bold"} color={"purple.900"}>
              Tech Stars Heroes
            </Text>
            <Text fontSize={16} color={"purple.800"} mb={8}>
              Create your very own <strong>Tech Stars Heroes</strong>{" "}
              collectible card! Start by selecting a photo, then apply your
              favorite effects to personalize it. Define your hero's skills and
              role to complete your unique collectible card.
            </Text>
            <Box p={5} background="white" borderRadius={8} boxShadow="2xl">
              <Stack width="50%" spacing={5} direction="column">
                <FormControl>
                  <FormLabel>Image</FormLabel>

                  <Stack spacing={2} direction="column">
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/png, image/gif, image/jpeg"
                    />
                    <Stack spacing={5} direction="row" flexWrap={"wrap"}>
                      {konvaFilters.map((konvaFilter) => (
                        <Checkbox
                          key={konvaFilter[1]}
                          isDisabled={!file}
                          onChange={() => handleFilterChange(konvaFilter)}
                        >
                          {konvaFilter[1]}
                        </Checkbox>
                      ))}
                    </Stack>
                    <Stack spacing={2} direction="row" alignItems={"center"}>
                      {filters.map((filter, i) => (
                        <>
                          {i > 0 && <span>{"+"}</span>}
                          <Kbd key={filter[1]}>{filter[1]}</Kbd>
                        </>
                      ))}
                    </Stack>
                  </Stack>
                </FormControl>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    maxLength={22}
                    value={title}
                    placeholder="Hero's name"
                    type="text"
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Input
                    maxLength={22}
                    value={role}
                    placeholder="Hero's role"
                    type="text"
                    onChange={(event) => setRole(event.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Team</FormLabel>
                  <Input
                    maxLength={18}
                    value={team}
                    placeholder="Hero's team"
                    type="text"
                    onChange={(event) => setTeam(event.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Abilities</FormLabel>
                  <Stack spacing={2} direction="column">
                    <Skill skill={skill1} />
                    <Skill skill={skill2} />
                    <Skill skill={skill3} />
                    <Skill skill={skill4} />
                  </Stack>
                </FormControl>
                <div>
                  <Button colorScheme="purple" onClick={handleExport}>
                    Download
                  </Button>
                </div>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>
    </main>
  );
}

export default App;
