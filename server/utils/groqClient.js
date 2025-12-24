import Groq from "groq-sdk";

let groqInstance = null;

export function getGroqClient() {
  if (!groqInstance) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment");
    }

    groqInstance = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    console.log(
      "Groq client initialized:",
      process.env.GROQ_API_KEY.slice(0, 6) + "****"
    );
  }

  return groqInstance;
}
