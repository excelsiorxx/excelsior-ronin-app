'use client';

import { getDefaultConfig, TantoProvider } from '@sky-mavis/tanto-widget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { ronin, saigon } from 'viem/chains';

const config = getDefaultConfig({
  appMetadata: {
    appName: 'My DApp',
    appIcon: '<https://my-dapp.com/icon.png>',
    appDescription: 'A decentralized application for Web3 enthusiasts',
    appUrl: '<https://my-dapp.com>',
  },
  keylessWalletConfig: {
    chainId: 2020, // Ronin Mainnet
    clientId: 'YOUR_CLIENT_ID',
    waypointOrigin: '<https://waypoint.roninchain.com>',
    popupCloseDelay: 1000,
  },
  walletConnectConfig: {
    projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  },
  coinbaseWalletConfig: {
    enable: true,
  },
  chains: [ronin, saigon],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TantoProvider theme="dark">{children}</TantoProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}