function generatePrompt(text, request) {
    return `${request}:
      
      \`\`\`
      ${text}
      \`\`\`
      `;
  }

export default async function callGPT(text, request, openai) {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: generatePrompt(text, request),
    temperature: 0.6,
    max_tokens: 1400,
  });

  return completion.data.choices[0].text;
}
