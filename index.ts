/**
 * APIKEY
 */
process.env.OPENAI_API_KEY = "your-api-key";

import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { returnPdfText } from "./getPdfText.js"

const res = await returnPdfText();
// console.log(res.substring(0, 200));

const prompt = PromptTemplate.fromTemplate(`简历内容是 {subject}`);

const model = new ChatOpenAI({});

const functionSchema = [
  {
    name: "pdf",
    description: "你是专门设计用来分析候选人简历文件的工具。你的主要功能是提取、分析和总结简历中的所有信息。你是专家级的，能够深入分析简历，提供详细的总结，包括候选人的所有信息，核心功能是以固定的格式回答用户。你将保持专业的态度，确保分析的准确性和全面性。如有必要，你需要澄清对应缺少内容的解释，以确保信息的完整性和清晰度。其目的是提供一个简洁、全面、准确、详细的候选人信息的概览。所有的交流都将以中文进行。",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "候选人的姓名",
        },
        sex: {
          type: "string",
          description: "候选人的性别",
        },
      },
      required: ["name", "sex"],
    },
  },
];

const chain = prompt.pipe(
  model.bind({
    functions: functionSchema,
    function_call: { name: "pdf" },
  })
);

const result = await chain.invoke({ subject: res.substring(0, 200) });

console.log(result);

/*
  AIMessage {
    content: "",
    additional_kwargs: {
      function_call: {
        name: "joke",
        arguments: '{\n  "setup": "Why don\'t bears wear shoes?",\n  "punchline": "Because they have bear feet!"\n}'
      }
    }
  }
*/