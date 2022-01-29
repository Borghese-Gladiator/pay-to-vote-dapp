/**
 * DApps require account setup through MetaMask
 * 
 * Steps
 * check MetaMask is installed (detect Ethereum Provider)
 * check user is connected to MetaMask
 * check user has signed in before using Web3 message signing
 */
import dynamic from 'next/dynamic';
import { useContext, useEffect } from "react";

// Context
import UserInfoContext from "../../context/UserInfoContext";

// Dynamic Import Components to avoid SSR
const NoWalletDetected = dynamic(
  () => import('./NoWalletDetected'),
  { ssr: false }
);
const ConnectWallet = dynamic(
  () => import('./ConnectWallet'),
  { ssr: false }
);
const CreateUsername = dynamic(
  () => import('./CreateUsername'),
  { ssr: false }
)

export default function UserSetup({ setLoadingSetup }) {
  const { userInfo, setUserInfo } = useContext(UserInfoContext);

  // Detect Ethereum Provider is present, render MetaMask not detected
  if (typeof window !== "undefined" && typeof window.ethereum === "undefined") {
    // Tell user to install MetaMask
    return <NoWalletDetected />
  }

  // Detect user account from MetaMask
  if (typeof window !== "undefined" && !("selectedAddress" in userInfo)) {
    // Tell user to connect MetaMask account
    return <ConnectWallet userInfo={userInfo} setUserInfo={setUserInfo} />
  }

  // Detect user created username prior
  if (typeof window !== undefined && !("name" in userInfo)) {
    return <CreateUsername userInfo={userInfo} setUserInfo={setUserInfo} />
  }
  
  // Display actual application, setup complete
  setLoadingSetup(false);
  return <></>
}