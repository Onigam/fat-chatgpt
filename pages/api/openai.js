import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

function generatePrompt(text, request) {
  return `${request}:
    
    \`\`\`
    ${text}
    \`\`\`
    `;
}

export default async function callGPT(text, request) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(text, request),
    temperature: 0.6,
    max_tokens: 1400,
  });

  return completion.data.choices[0].text;
}
