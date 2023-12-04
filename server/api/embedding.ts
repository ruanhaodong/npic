import { ChatCompletionFunctions, ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai"


export default defineEventHandler(async (event) => {


  
const   text = (await readBody(event)).text
console.log(text)
const response = await  new OpenAIApi(
    new Configuration({apiKey: process.env.OPENAI_API_KEY})
).createEmbedding({
    input:text,
    model:'text-embedding-ada-002'
})

return response.data


})