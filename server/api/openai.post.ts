import {  ChatCompletionFunctions, ChatCompletionRequestMessage, Configuration, CreateChatCompletionRequestFunctionCall, OpenAIApi } from "openai"


// console.log('requesting1', process.env.OPENAI_API_KEY)
// return;
export default defineEventHandler(async (event) => {


  let messages: ChatCompletionRequestMessage[] 
  let function_call: ChatCompletionFunctions | undefined = undefined;


    const body = await readBody(event);
    messages = body.messages;
    function_call = body.function_call;
  

  console.log('post read',{messages,function_call})
  const openai = await new OpenAIApi(new Configuration()).createChatCompletion({
    model:'gpt-3.5-turbo-0613',
    messages,
  });

console.log(openai.data)

    return openai.data
  })
