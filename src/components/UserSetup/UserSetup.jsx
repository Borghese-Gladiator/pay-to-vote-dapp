/**
 * DApps require account setup through MetaMask
 * 
 * Steps
 * check MetaMask is installed (detect Ethereum Provider)
 * check user is connected to MetaMask
 * check user has signed in before using Web3 message signing
 */
import { useContext, useEffect } from "react";
// Context
import UserInfoContext from "../../context/UserInfoContext";
// Custom components
import Loading from "./Loading";
import NoWalletDetected from "./NoWalletDetected";
import ConnectWallet from "./ConnectWallet";
import CreateUsername from "./CreateUsername";

// Dynamic Import Components to avoid SSR
/*
import dynamic from 'next/dynamic';
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
*/

const componentsToLoadList = [
  {
    loadingText: "Detecting MetaMask chrome extension is present (or any other Ethereum Provider)",
    condition: typeof window !== "undefined" && typeof window.ethereum === "undefined",
    Component: NoWalletDetected
  },
  {
    loadingText: "Detecting user account from Ethereum Provider",
    condition: typeof window !== "undefined" && typeof window.ethereum === "undefined" && !("selectedAddress" in userInfo),
    Component: ConnectWallet
  },
  {
    loadingText: "Detecting if user has created username",
    condition: typeof window !== "undefined" && typeof window.ethereum === "undefined" && !("name" in userInfo),
    Component: CreateUsername
  },
]

export default function UserSetup({ setLoadingSetup }) {
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const animationDelay = 5;

  // Display actual application, setup complete
  // setLoadingSetup(false);

  return (
    <>
      {componentsToLoadList.map((props, idx) => {
        const { Component, condition, loadingText } = props;
        const currentDelay = animationDelay * idx;
        return (
          <Loading wait={currentDelay} loadingText={loadingText} condition={condition}>
            <Component userInfo={userInfo} setUserInfo={setUserInfo} />
          </Loading>
        )
      })}
    </>
  )
}