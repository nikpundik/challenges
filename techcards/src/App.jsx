import { useState } from "react";
import Card from "./components/Card";
import styles from "./app.module.css";

function App() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        setFile(img);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className={styles.main}>
      <Card file={file} title={title} />
      <div>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/png, image/gif, image/jpeg"
        />
        <input type="text" onChange={(event) => setTitle(event.target.value)} />
      </div>
    </main>
  );
}

export default App;
