# Fat Chat GPT

This application is a simple web page that let user to enter a big text, a request, split the text then send each part with the request to OpenAI api.

An openai API key is required to use this application. You can get one here: https://beta.openai.com/docs/api-reference/authentication

The application is deployed on Vercel: https://fat-chatgpt.vercel.app/

Your API key and request is^stored in the browser local storage so there is no need to retype it if you go back on the page.

The API key is not stored in the server.

The application is built with Next.js and hosted by Vercel.



Here the sequence diagram of the application:

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server
    participant OpenAI
    User->>Browser: Enter API Key, request and text
    Browser->>Server: POST 1st part to /api
    Server->>OpenAI: POST /v1/engines/davinci/completions
    OpenAI->>Server: Response
    Server->>Browser: Response
    Browser->>User: Display response for part 1
    Browser->>Server: POST 2nd part to /api
    Server->>OpenAI: POST /v1/engines/davinci/completions
    OpenAI->>Server: Response
    Server->>Browser: Response
    Browser->>User: Display response for part 2
    Browser->>Server: POST Nth part to /api
    Server->>OpenAI: POST /v1/engines/davinci/completions
    OpenAI->>Server: Response
    Server->>Browser: Response
    Browser->>User: Display response for part N
```

## Getting Started

First, run the development server:

```bash
npm i

npm run dev
```
