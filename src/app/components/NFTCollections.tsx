import React from 'react';


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

type NFTCollectionsProps = {
  collections: Collection[];
  loading: boolean;
};

export function NFTCollections({ collections, loading }: NFTCollectionsProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">My NFT Collections</h1>
      {loading ? (
        <p className="text-center">Loading NFTs...</p>
      ) : collections.length === 0 ? (
        <p className="text-center">No NFTs found.</p>
      ) : (
        <div className="flex justify-center">
          <div className="w-full max-w-6xl px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {collections.map((col) => (
                <div
                  key={col.address}
                  className="relative rounded-2xl overflow-hidden shadow-lg group bg-[#181C23] cursor-pointer"
                  style={{ minHeight: 220 }}
                >
                  {/* Collection Image - full size */}
                  <img
                    src={col.image || '/assets/placeholder.png'}
                    alt={col.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ zIndex: 0 }}
                  />
                  {/* Linear gradient overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(12deg,#0e1116 8.67%,rgba(14,17,22,0) 50%)',
                      zIndex: 1,
                    }}
                  />
                  {/* Collection Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <div className="text-base font-medium text-white mb-2 truncate">{col.name}</div>
                    <div className="flex flex-wrap gap-2">
                      {col.tags.length > 0
                        ? col.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur"
                            >
                              {tag}
                            </span>
                          ))
                        : (
                          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium backdrop-blur">
                            {col.nfts.length} NFT{col.nfts.length > 1 ? 's' : ''}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}