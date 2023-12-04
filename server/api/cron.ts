import { PineconeClient } from "@pinecone-database/pinecone";

export default defineEventHandler(async (event) => {
    const pinecone = new PineconeClient();

   await pinecone.init({
        environment: process.env.PINECONE_EMBEDDING_ENVIRONMENT!,
        apiKey: process.env.PINECONE_API_KEY!,
      });

     return pinecone.listIndexes()

})