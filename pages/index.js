import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import { useState } from "react";

export default function Home() {
  const [requestInput, setRequestInput] = useState("Summarize the text below");
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState();
  const [processing, setProcessing] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setProcessing(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request: requestInput, text: textInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      <Head>
        <title>FatGPT</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>Fat GPT</h3>
        <form onSubmit={onSubmit}>
          <label for="request">Enter your request</label>
          <textarea
            type="text"
            name="request"
            rows="2"
            placeholder="Enter your request"
            value={requestInput}
            onChange={(e) => setRequestInput(e.target.value)}
          />
          <label for="request">The text you want to process</label>
          <textarea
            type="text"
            name="text"
            rows="10"
            placeholder="Enter your text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          {!processing && <input type="submit" value="Process your request" />}
          {processing && <input type="submit" value="Processing wait a few seconds..." disabled />}
        </form>
        {result && (<div className={styles.resultContainer}>
          {result.map((item, index) => (
            <div className={styles.resultPart} key={index}>{item}</div>
          ))}
        </div>)}
      </main>
    </div>
  );
}
