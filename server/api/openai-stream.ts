import {
  ChatCompletionFunctions,
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionRequestFunctionCall,
  OpenAIApi,
} from "openai";



export default defineEventHandler(async (event) => {
  let messages: ChatCompletionRequestMessage[] | undefined = undefined;
  let function_call: ChatCompletionFunctions | undefined = undefined;
  let apikey = "";

  // if (event.node.req.method == "POST") {
    const body = JSON.parse(await readBody(event));
    messages = body.messages;
    function_call = body.function_call;
    apikey = body.apikey;


    console.log(body)
    console.log( body.messages);
    console.log(body.function_call);
    console.log( body.apikey);
  
   

  const openai = await new OpenAIApi(
    new Configuration({ apiKey:apikey })
  ).createChatCompletion(
    {
      model: "gpt-3.5-turbo-16k-0613",
      // temperature:1.6,
      // top_p:0.7,
      messages: messages ?? [
        { role: "system", content: "you are a best chemistry teacher" },
        { role: "user", content: "what is the best way to learn chemistry" },
      ],
      function_call: function_call ?? undefined,
      stream: true,
      max_tokens: 2000,
    },
    { responseType: "stream" }
  );

  return openai.data;
});
