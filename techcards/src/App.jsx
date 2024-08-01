import { useRef, useState } from "react";
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
} from "@chakra-ui/react";
import useSkill from "./hooks/useSkill";
import Card from "./components/Card";
import styles from "./app.module.css";
import Skill from "./components/Skill";

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
  const [role, setRole] = useState("");
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

  return (
    <main>
      <Box p={10}>
        <Stack spacing={5} direction="row">
          <Box width="50%">
            <Card
              stageRef={stageRef}
              file={file}
              title={title}
              role={role}
              skills={[skill1, skill2, skill3, skill4]}
              filters={filters.map(([f]) => f)}
            />
          </Box>
          <Stack width="50%" spacing={5} direction="column">
            <FormControl>
              <FormLabel>Image</FormLabel>

              <Stack spacing={2} direction="column">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/png, image/gif, image/jpeg"
                />
                <Stack spacing={5} direction="row">
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
                placeholder="Tech star"
                type="text"
                onChange={(event) => setTitle(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Input
                maxLength={22}
                value={role}
                placeholder="Frontend Rockstar"
                type="text"
                onChange={(event) => setRole(event.target.value)}
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
              <Button colorScheme="blue" onClick={handleExport}>
                Download
              </Button>
            </div>
          </Stack>
        </Stack>
      </Box>
    </main>
  );
}

export default App;
