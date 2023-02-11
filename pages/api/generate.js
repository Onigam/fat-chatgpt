import callGPT from "./openai";
import sequence from "./sequence";


function splitString(str, chunkSize) {
  let chunks = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    chunks.push(str.slice(i, i + chunkSize));
  }
  return chunks;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req, res) {
  /*if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }*/

  const request = req.body.request || '';
  if (request.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a request",
      }
    });
    return;
  }

  const text = req.body.text || '';
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a text",
      }
    });
    return;
  }

  try {
    let chunks = splitString(text, 3000);

    sequence(chunks, (chunk, index) => {
      console.log(`Progressing chunk: ${index} of ${chunks.length}`);
      return callGPT(chunk, request);
    }).then((result) => {
      console.log("Done!");
      res.status(200).json({ result });
    });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

