'use client';

import { useEffect, useState } from 'react';
import { TantoConnectButton } from '@sky-mavis/tanto-widget';
import { useAccount, useBalance } from 'wagmi';
import { useEvmNativeBalance } from "@moralisweb3/next";
import Link from 'next/link';
import Image from 'next/image';

const WRON_CONTRACT = "0xe514d9DEB7966c8BE0ca922de8a064264eA6bcd4"; // WRON contract on Ronin

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();
  const { data: ronBalance } = useEvmNativeBalance(
    isConnected && address
      ? { address, chain: "0x7e4" }
      : undefined
  );
  const { data: wronBalance } = useBalance({
    address: address,
    token: WRON_CONTRACT,
    chainId: 2020,
  });

  // Prevent hydration mismatch by rendering nothing until mounted
  if (!mounted) return null;

  const shortAddress = address
    ? address.slice(2, 8).toUpperCase()
    : '';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#181C23] shadow-sm border-b border-gray-200 dark:border-[#232B3A]">
      <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo on the left */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="https://cdn.roninchain.com/mavis-mkp/statics/icons//tokens/ron.png"
                alt="Your Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              <span className="ml-1 text-xl font-semibold text-white">Ronin SDK</span>
            </Link>
          </div>

          {/* Hamburger for mobile */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {mounted && isConnected && (
              <div className="flex items-center rounded-full px-6 py-2 space-x-6 transition-colors duration-200 bg-[#232B3A] hover:bg-[#232B3A]/80">
                {/* RON */}
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center">
                    <svg
                      className="aspect-square overflow-hidden"
                      viewBox="0 0 24 24"
                      width={16}
                      height={16}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="fill-current"
                        d="M3.43 1.846v14.807a1.84 1.84 0 0 0 .695 1.44l7.008 5.603a1.393 1.393 0 0 0 1.737 0l7.008-5.603a1.847 1.847 0 0 0 .695-1.44V1.846c0-.49-.195-.959-.543-1.305A1.857 1.857 0 0 0 18.72 0H5.283c-.491 0-.963.195-1.31.54a1.843 1.843 0 0 0-.543 1.306ZM15.4 3.714c.423 0 .83.17 1.13.473.3.302.469.713.469 1.14v3.228c0 .427-.169.837-.468 1.14-.3.302-.705.473-1.129.473.424 0 .831.17 1.131.473.3.303.469.713.469 1.141v2.91a1.625 1.625 0 0 1-.6 1.258l-2.476 2.005a.198.198 0 0 1-.294-.05.203.203 0 0 1-.03-.107v-5.613c0-.32-.127-.628-.352-.855a1.194 1.194 0 0 0-.848-.355h-1.8a.2.2 0 0 0-.2.202v6.62a.203.203 0 0 1-.113.183.198.198 0 0 1-.212-.025L7.6 15.95a1.611 1.611 0 0 1-.6-1.259V5.328c0-.428.17-.839.469-1.141.3-.303.707-.473 1.131-.473Zm-2 1.614h-2.8a.2.2 0 0 0-.14.059.203.203 0 0 0-.06.142V9.16c0 .054.022.105.06.143a.2.2 0 0 0 .14.059h1.8c.318 0 .623-.128.848-.355.225-.227.352-.535.352-.855V5.529a.203.203 0 0 0-.059-.142.199.199 0 0 0-.141-.06Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                  <span className="text-white tracking-wide">
                    {ronBalance?.balance.ether
                      ? Number(ronBalance.balance.ether).toFixed(2)
                      : '0.00'} RON
                  </span>
                </div>
                {/* Divider */}
                <span className="text-gray-500 text-xl font-light select-none">|</span>
                {/* WRON */}
                <div className="flex items-center space-x-2">
                  <span className="text-white tracking-wide">
                    {wronBalance?.formatted
                      ? Number(wronBalance.formatted).toFixed(2)
                      : '0.00'} WRON
                  </span>
                </div>
              </div>
            )}
            <div className="tanto-connect-btn-sm">
              {mounted && <TantoConnectButton />}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#181C23] border-t border-[#232B3A] px-4 py-4">
          <div className="flex flex-col space-y-4">
            {mounted && isConnected && (
              <div className="flex items-center rounded-full px-6 py-2 space-x-6 transition-colors duration-200 bg-[#232B3A]">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center">
                    <svg
                      className="aspect-square overflow-hidden"
                      viewBox="0 0 24 24"
                      width={16}
                      height={16}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        className="fill-current"
                        d="M3.43 1.846v14.807a1.84 1.84 0 0 0 .695 1.44l7.008 5.603a1.393 1.393 0 0 0 1.737 0l7.008-5.603a1.847 1.847 0 0 0 .695-1.44V1.846c0-.49-.195-.959-.543-1.305A1.857 1.857 0 0 0 18.72 0H5.283c-.491 0-.963.195-1.31.54a1.843 1.843 0 0 0-.543 1.306ZM15.4 3.714c.423 0 .83.17 1.13.473.3.302.469.713.469 1.14v3.228c0 .427-.169.837-.468 1.14-.3.302-.705.473-1.129.473.424 0 .831.17 1.131.473.3.303.469.713.469 1.141v2.91a1.625 1.625 0 0 1-.6 1.258l-2.476 2.005a.198.198 0 0 1-.294-.05.203.203 0 0 1-.03-.107v-5.613c0-.32-.127-.628-.352-.855a1.194 1.194 0 0 0-.848-.355h-1.8a.2.2 0 0 0-.2.202v6.62a.203.203 0 0 1-.113.183.198.198 0 0 1-.212-.025L7.6 15.95a1.611 1.611 0 0 1-.6-1.259V5.328c0-.428.17-.839.469-1.141.3-.303.707-.473 1.131-.473Zm-2 1.614h-2.8a.2.2 0 0 0-.14.059.203.203 0 0 0-.06.142V9.16c0 .054.022.105.06.143a.2.2 0 0 0 .14.059h1.8c.318 0 .623-.128.848-.355.225-.227.352-.535.352-.855V5.529a.203.203 0 0 0-.059-.142.199.199 0 0 0-.141-.06Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                  <span className="text-white tracking-wide">
                    {ronBalance?.balance.ether
                      ? Number(ronBalance.balance.ether).toFixed(2)
                      : '0.00'} RON
                  </span>
                </div>
                <span className="text-gray-500 text-xl font-light select-none">|</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white tracking-wide">
                    {wronBalance?.formatted
                      ? Number(wronBalance.formatted).toFixed(2)
                      : '0.00'} WRON
                  </span>
                </div>
              </div>
            )}
            <div className="tanto-connect-btn-sm">
              {mounted && <TantoConnectButton />}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}