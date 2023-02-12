import styles from "@/styles/Home.module.css";
import { Analytics } from '@vercel/analytics/react';
import Head from "next/head";
import { useEffect, useState } from "react";
import sequence from "./api/sequence";

export default function Home() {
  const [requestInput, setRequestInput] = useState("Summarize the text below");
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const chunkSize = 2000;

  // Get the openai api key from the local storage
  const [openaiAPIKey, setOpenAIAPIKey] = useState("");

  /**
   * This function splits the text into chunks of the given chunk size.
   * It returns an array of chunks.
   * @param {*} str 
   * @param {*} chunkSize 
   * @returns 
   */
  function splitString(str, chunkSize) {
    let chunks = [];
    for (let i = 0; i < str.length; i += chunkSize) {
      chunks.push(str.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // This useEffect will run once when the component mounts
  // It checks if the window and local storage exist, and if so, it
  // checks if there is an API key stored in local storage. If so, it
  // sets the openAIAPIKey state to the value of the key. It also checks
  // if there is an API request stored in local storage, and if so, it
  // sets the requestInput state to the value of the request.
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

  /**
   * This function calls the API server, which then calls the OpenAI API.
   * The OpenAI API uses the text sent as input and the request to generate a new text.
   * The API server then returns the generated text to this function.
   * The function return the generated text.
   * @param {*} chunk 
   * @param {*} openaiAPIKey 
   * @param {*} requestInput 
   * @returns 
   */
  async function processChunk(chunk, openaiAPIKey, requestInput) {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request: requestInput,
        text: chunk,
        openaiAPIKey,
      }),
    });

    const data = await response.json();
    if (response.status !== 200) {
      throw (
        data.error || new Error(`Request failed with status ${response.status}`)
      );
    }

    return data.result;
  }


  /**
   * This function is called when the user clicks the submit button.
   * It calls the processChunk function for each chunk of the text.
   * It then sets the result state to the generated text.
   * @param {*} chunk 
   * @param {*} openaiAPIKey 
   * @param {*} requestInput 
   * @returns 
   */
  async function processChunk(chunk, openaiAPIKey, requestInput) {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request: requestInput,
        text: chunk,
        openaiAPIKey,
      }),
    });

    const data = await response.json();
    if (response.status !== 200) {
      throw (
        data.error || new Error(`Request failed with status ${response.status}`)
      );
    }

    return data.result;
  }

  /**
   * This function is called when the user clicks the submit button.
   * It calls the processChunk function in sequence for each chunk of the text.
   * It then sets the result state to the generated text.
   * @param {*} event 
   */
  async function onSubmit(event) {
    event.preventDefault();
    try {
      setProcessing(true);

      setResult([]);

      let chunks = splitString(textInput, chunkSize);

      await sequence(chunks, (chunk, index) => {
        setProgress(Math.round(((index - 1) / chunks.length) * 100));
        console.log(`Processing chunk: ${index} of ${chunks.length}`);

        return processChunk(chunk, openaiAPIKey, requestInput).then((res) => {
          setResult((prevResult) => [...prevResult, ...res]);
        }).finally(() => {
          return result;
        });
      });
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  }

  /**
   * This function is called when the user enters a new API key.
   * It sets the openAIAPIKey state to the new key.
   * It also stores the key in the local storage.
   * @param {*} key 
   */
  const setAPIKeyAndPersist = (key) => {
    setOpenAIAPIKey(key);
    if (window && window.localStorage) {
      window.localStorage.setItem("openaiAPIKey", key);
    }
  };

  /**
   * This function is called when the user enters a new request.
   * It sets the requestInput state to the new request.
   * It also stores the request in the local storage.
   * @param {*} request 
   */
  const setRequestAndPersist = (request) => {
    setRequestInput(request);
    if (window && window.localStorage) {
      window.localStorage.setItem("request", request);
    }
  };

  return (
    <div>
      <Head>
        <title>FatGPT</title>
        <link rel="icon" href="/ai.png" />
      </Head>
      <Analytics />

      <main className={styles.main}>
        <h3>Fat GPT</h3>
        <a className={styles.github} href="https://github.com/Onigam/fat-chatgpt">
          Source code on Github
        </a>

        <form onSubmit={onSubmit}>
          <label>Enter your OpenAI API Key</label>
          <a href="https://beta.openai.com/account/api-keys">
            Get your API Key here
          </a>
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
            placeholder={`Enter your text here, there is no size limitation, the content will be split into ${chunkSize} characters chunks. Each chunk will be processed separatly by openAI.`}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          {!!textInput?.length && (<div className={styles.size}>{`${textInput.length} characters - ${parseInt(textInput.length / chunkSize) + 1} chunks to process`}</div>)}
          {!processing && <input type="submit" value="Process your request" />}
          {processing && (
            <input
              type="submit"
              value="Processing wait a few seconds..."
              disabled
            />
          )}
          {processing && <progress value={progress} max="100" />}
        </form>
        {result && (
          <div className={styles.resultContainer}>
            {result.map((item, index) => (
              <div className={styles.resultPart} key={index}>
                {item}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
