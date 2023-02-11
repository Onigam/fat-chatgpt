/**
 * This function generates the prompt for the OpenAI API.
 * @param {*} text 
 * @param {*} request 
 * @returns 
 */
function generatePrompt(text, request) {
    return `${request}:
      
      \`\`\`
      ${text}
      \`\`\`
      `;
  }

/**
 * This function calls the OpenAI API and returns the generated text.
 * @param {*} text 
 * @param {*} request 
 * @param {*} openai 
 * @returns 
 */
export default async function callGPT(text, request, openai) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(text, request),
    temperature: 0.6,
    max_tokens: 1400,
  });

  return completion.data.choices[0].text;
}
