import { useMemo, useState } from "react";

const useSkill = () => {
  const [label, setLabel] = useState("");
  const [skill, setSkill] = useState(0);
  return useMemo(() => ({ label, setLabel, skill, setSkill }), [label, skill]);
};

export default useSkill;
