import { MoralisNextApi } from "@moralisweb3/next";

export default MoralisNextApi({ 
  apiKey: process.env.MORALIS_API_KEY as string, // Force TypeScript to treat it as string
});