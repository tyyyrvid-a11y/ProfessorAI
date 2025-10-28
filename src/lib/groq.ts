import Groq from "groq-sdk";

const GROQ_API_KEY = "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";

export const getGroqCompletion = async (prompt: string) => {
  if (!GROQ_API_KEY) {
    throw new Error("Groq API key is not set.");
  }

  const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed for teachers.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-120b",
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error fetching Groq completion:", error);
    if (error instanceof Error) {
      return `An error occurred: ${error.message}`;
    }
    return "An unknown error occurred.";
  }
};