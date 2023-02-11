import styles from '@/styles/Home.module.css';
import Head from 'next/head';
import { useEffect, useState } from "react";
import sequence from './api/sequence';

export default function Home() {
  const [requestInput, setRequestInput] = useState("Summarize the text below");
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);


  // Get the openai api key from the local storage
  const [openaiAPIKey, setOpenAIAPIKey] = useState("");

  function splitString(str, chunkSize) {
    let chunks = [];
    for (let i = 0; i < str.length; i += chunkSize) {
      chunks.push(str.slice(i, i + chunkSize));
    }
    return chunks;
  }

  useEffect(() => {
    if (window && window.localStorage) {
      const key = window.localStorage.getItem("openaiAPIKey");
      if (key) {
        setOpenAIAPIKey(key);
      }

      const request = window.localStorage.getItem("request");
      if (request) {
        setRequestInput(request);
      }
    }
  }, []);

  async function processChunk(chunk) {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ request: requestInput, text: chunk, openaiAPIKey }),
    });

    const data = await response.json();
    if (response.status !== 200) {
      throw data.error || new Error(`Request failed with status ${response.status}`);
    }

    //const newRes = [...result,...data.result];

    //setResult(newRes);

    return data.result;
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setProcessing(true);

      setResult([]);

      let chunks = splitString(textInput, 3000);

      const res = await sequence(chunks, (chunk, index) => {
        // Set the progress of the progress bar in percent
        setProgress(Math.round(((index-1) / chunks.length) * 100));
        console.log(`Processing chunk: ${index} of ${chunks.length}`);
        return processChunk(chunk);
      });

      setResult(res);

    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  }

  const setAPIKeyAndPersist = (key) => {
    setOpenAIAPIKey(key);
    if (window && window.localStorage) {
      window.localStorage.setItem("openaiAPIKey", key);
    }
  }

  const setRequestAndPersist = (request) => {
    setRequestInput(request);
    if (window && window.localStorage) {
      window.localStorage.setItem("request", request);
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
        <a href="https://github.com/Onigam/fat-chatgpt">
          github.com/Onigam/fat-chatgpt
        </a>

        <form onSubmit={onSubmit}>
          <label>Enter your OpenAI API Key</label>
          <a href="https://beta.openai.com/account/api-keys">Get your API Key here</a>
          <input
            type="text"
            name="openaiAPIKey"
            placeholder="Enter your OpenAI API Key"
            value={openaiAPIKey}
            onChange={(e) => setAPIKeyAndPersist(e.target.value)}
          />

          <label>Enter your request</label>
          <textarea
            type="text"
            name="request"
            rows="2"
            placeholder="Enter your request"
            value={requestInput}
            onChange={(e) => setRequestAndPersist(e.target.value)}
          />
          <label>The text you want to process</label>
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
          {processing && <progress value={progress} max="100" />}
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
