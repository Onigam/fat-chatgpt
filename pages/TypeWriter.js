import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

const Typewriter = ({ text }) => {
    const [currentText, setCurrentText] = useState("");
    let index = 0;
  
    useEffect(() => {
      const type = setInterval(() => {
        setCurrentText(text.slice(0, index));
        index++;
        if (index > text.length) {
          clearInterval(type);
        }
      }, 5);
  
      return () => clearInterval(type);
    }, [text]);
  
    return <div className={styles.typewriter}>{currentText}</div>;
  };

  export default Typewriter;