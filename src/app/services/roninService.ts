import axios from 'axios';
import { ethers, JsonRpcProvider } from 'ethers';

// Ronin RPC endpoint
const RONIN_RPC = 'https://api.roninchain.com/rpc';

// Create a provider for Ronin
const provider = new JsonRpcProvider(RONIN_RPC);

// GraphQL endpoint for Ronin's Katana subgraph
const GRAPHQL_ENDPOINT = 'https://graphql.roninchain.com/subgraphs/name/ronin/ronin';

// ERC721 ABI (simplified for balanceOf and tokenOfOwnerByIndex)
const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

/**
 * Get all NFTs owned by an address
 * @param walletAddress The Ronin wallet address (0x... format)
 * @param contractAddress The NFT contract address
 */
export async function getNFTsByOwner(walletAddress: string, contractAddress: string) {
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
  
  // Get the number of NFTs owned by the address
  const balance = await contract.balanceOf(walletAddress);
  
  const nfts = [];
  
  // Loop through all NFTs owned
  for (let i = 0; i < balance.toNumber(); i++) {
    const tokenId = await contract.tokenOfOwnerByIndex(walletAddress, i);
    const tokenURI = await contract.tokenURI(tokenId);
    
    nfts.push({
      tokenId: tokenId.toString(),
      tokenURI
    });
  }
  
  return nfts;
}

/**
 * Get all NFT collections owned by an address using GraphQL
 * @param walletAddress The Ronin wallet address (0x... format)
 */
export async function getAllNFTCollections(walletAddress: string) {
  const query = `
    {
      tokens(where: {owner: "${walletAddress.toLowerCase()}"}) {
        contract {
          id
          name
          symbol
        }
        tokenId
        tokenURI
      }
    }
  `;

  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, { query });
    return response.data.data.tokens;
  } catch (error) {
    console.error('Error fetching NFT collections:', error);
    return [];
  }
}

/**
 * Get NFT metadata from URI
 * @param tokenURI The token URI (IPFS or HTTP)
 */
export async function getNFTMetadata(tokenURI: string) {
  try {
    // Handle IPFS URIs
    if (tokenURI.startsWith('ipfs://')) {
      tokenURI = `https://ipfs.io/ipfs/${tokenURI.split('ipfs://')[1]}`;
    }
    
    const response = await axios.get(tokenURI);
    return response.data;
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    return null;
  }
}