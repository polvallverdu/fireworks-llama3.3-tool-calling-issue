import { DynamicStructuredTool } from "@langchain/core/tools";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { z } from "zod";

const FIREWORKS_API_KEY = process.env.FIREWORKS_API_KEY;

if (!FIREWORKS_API_KEY) {
  throw new Error("FIREWORKS_API_KEY is not set");
}

const weatherTool = new DynamicStructuredTool({
  name: "get_weather",
  description: "Get the current weather for a city",
  schema: z.object({
    city: z.string().describe("The city to get weather for"),
  }),
  async func({ city }) {
    console.log("Getting weather for", city);

    // Return dummy weather data
    return `
            Temperature: 22°C
            Feels like: 24°C
            Humidity: 65%
            Weather: partly cloudy with a chance of meatballs
        `;
  },
});

async function main() {
  // Initialize the Fireworks chat model
  const model = new ChatFireworks({
    modelName: "accounts/fireworks/models/llama-v3p3-70b-instruct",
    apiKey: FIREWORKS_API_KEY,
    temperature: 0.7,
  }).bindTools([weatherTool]);

  const messages = [
    new SystemMessage(
      "You are a helpful assistant that can get the weather for a city using it's tools."
    ),
    new HumanMessage("What's the weather like in London?"),
  ];

  try {
    const result = await model.invoke(messages);
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

main().catch(console.error);
