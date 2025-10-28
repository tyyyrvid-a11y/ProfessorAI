import Groq from "groq-sdk";

export const getGroqCompletion = async (apiKey: string, prompt: string) => {
  if (!apiKey) {
    throw new Error("Groq API key is not set.");
  }

  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

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
      model: "llama3-70b-8192",
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