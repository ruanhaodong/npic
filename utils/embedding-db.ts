import { PineconeClient } from "@pinecone-database/pinecone";

console.log(process.env.PINECONE_EMBEDDING_ENVIRONMENT)
const pinecone = new PineconeClient();


pinecone.init({
  environment: process.env.PINECONE_EMBEDDING_ENVIRONMENT!,
  apiKey: process.env.PINECONE_API_KEY!,
});

const createIndex = (name: string) => {
  pinecone.createIndex({
    createRequest: {
      dimension: parseInt(process.env.EMBEDDING_DIMENSIONS!) || 1536,
      name,
      metric: "cosine",
    },
  });
};




const saveMemory=({
   
})=>{

}


const a  = async()=>{
    await pinecone.init({
        environment: process.env.PINECONE_EMBEDDING_ENVIRONMENT!,
        apiKey: process.env.PINECONE_API_KEY!,
      });

    console.log(await pinecone.listIndexes())

}
a()






