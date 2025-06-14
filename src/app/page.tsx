'use client';

import { useAccount, useBalance } from 'wagmi';
import { useEvmNativeBalance } from "@moralisweb3/next";
import { useEffect, useState } from 'react';
import { NFTCollections } from './components/NFTCollections';

const WRON_CONTRACT = "0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4"; // WRON contract on Ronin

type NFT = {
  token_address: string;
  name?: string;
  token_id: string;
  metadata?: string;
  image?: string;
  [key: string]: any;
};

type Collection = {
  address: string;
  name: string;
  image: string;
  nfts: NFT[];
  tags: string[];
  
};

function parseImage(nft: NFT) {
  // Try to get image from metadata or image field
  if (nft.image) return nft.image;
  if (nft.metadata) {
    try {
      const meta = JSON.parse(nft.metadata);
      if (meta?.image) {
        // Handle IPFS links
        if (meta.image.startsWith('ipfs://')) {
          return `https://ipfs.io/ipfs/${meta.image.replace('ipfs://', '')}`;
        }
        return meta.image;
      }
    } catch {}
  }
  return undefined; // no fallback
}

function parseTags(nft: NFT) {
  if (nft.metadata) {
    try {
      const meta = JSON.parse(nft.metadata);
      if (meta?.attributes && Array.isArray(meta.attributes)) {
        return meta.attributes
          .map((attr: any) => attr.trait_type || attr.type || attr.value)
          .filter(Boolean)
          .slice(0, 3); // up to 3 tags
      }
    } catch {}
  }
  return [];
}

// Add this helper to fetch collection metadata (logo/banner)
async function fetchCollectionMeta(tokenAddress: string, apiKey: string) {
  const res = await fetch(
    `https://deep-index.moralis.io/api/v2.2/nft/${tokenAddress}/metadata?chain=ronin`,
    {
      headers: { 'X-API-Key': apiKey },
    }
  );
  return res.json();
}

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: nativeBalance } = useEvmNativeBalance(
    isConnected && address
      ? { address, chain: "0x7e4" }
      : undefined
  );

  const { data: wronBalance } = useBalance({
    address: address,
    token: WRON_CONTRACT,
    chainId: 2020,
  });

  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingNfts, setLoadingNfts] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    async function fetchNFTsAndCollections() {
      if (isConnected && address) {
        setLoadingNfts(true);
        try {
          const apiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY as string;
          const nftRes = await fetch(`/api/wallet-nfts?address=${address}`);
          const nftData = await nftRes.json();
          const nfts: NFT[] = nftData.result || [];

          // Get unique collection addresses
          const uniqueAddresses = [
            ...new Set(nfts.map(nft => nft.token_address)),
          ];

          // Fetch collection metadata for each collection
          const metaResults = await Promise.all(
            uniqueAddresses.map(addr => fetchCollectionMeta(addr, apiKey))
          );
          const metaMap: { [address: string]: any } = {};
          uniqueAddresses.forEach((addr, i) => {
            metaMap[addr] = metaResults[i];
          });

          // Attach collection_banner_image to each NFT's collection
          const collections: Collection[] = [];
          const collectionMap: { [address: string]: Collection } = {};

          nfts.forEach(nft => {
            const key = nft.token_address;
            if (!collectionMap[key]) {
              const meta = metaMap[key];
              const image =
                (meta && meta.collection_banner_image) ||
                parseImage(nft)
              const tags = parseTags(nft);
              collectionMap[key] = {
                address: key,
                name: nft.name || 'Unnamed Collection',
                image: image || '', // Ensure image is a string
                nfts: [],
                tags,
              };
              collections.push(collectionMap[key]);
            }
            collectionMap[key].nfts.push(nft);
          });

          setNfts(collections.flatMap(col => col.nfts));
          setCollections(collections);
        } finally {
          setLoadingNfts(false);
        }
      } else {
        setNfts([]);
        setCollections([]);
      }
    }

    fetchNFTsAndCollections();
  }, [isConnected, address]);

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/assets/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Black gradient overlay for darkening effect, lighter at the top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0.98) 100%)',
          zIndex: 0,
        }}
      />
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <NFTCollections collections={collections} loading={loadingNfts} />
      </div>
    </div>
  );
}

// Or, if you must import in a shared file:
if (typeof window !== 'undefined') {
  // Safe to use WalletConnect or anything that uses indexedDB
}