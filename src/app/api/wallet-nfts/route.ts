import { NextRequest, NextResponse } from 'next/server';
import Moralis from 'moralis';
import { EvmChain, EvmAddress } from '@moralisweb3/common-evm-utils';

const RONIN_CHAIN_ID = '0x7e4'; // Ronin chain ID

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  try {
    if (!Moralis.Core.isStarted) {
      await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
    }

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: EvmChain.create(RONIN_CHAIN_ID),
      address: EvmAddress.create(address),
    });

    return NextResponse.json(response.toJSON());
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch NFTs' }, { status: 500 });
  }
}