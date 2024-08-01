import { useState } from "react";

const useSkill = () => {
  const [label, setLabel] = useState("");
  const [skill, setSkill] = useState(3);
  return { label, setLabel, skill, setSkill };
};

export default useSkill;
