/**
 * DApps require account setup through MetaMask
 * 
 * Steps
 * check MetaMask is installed (detect Ethereum Provider)
 * check user is connected to MetaMask
 * check user has signed in before using Web3 message signing
 */
import { useContext } from "react";
// Context
import UserInfoContext from "../../context/UserInfoContext";
// Custom components
import { Loading, Wait } from "./Loading";
import NoWalletDetected from "./NoWalletDetected";
import ConnectWallet from "./ConnectWallet";
import CreateUsername from "./CreateUsername";
import {
  Container,
  Flex,
  Button
} from "@chakra-ui/react";

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

const setupList = [
  {
    loadingText: "Detecting MetaMask",
    condition: typeof window !== "undefined" && typeof window.ethereum === "undefined",
    Component: NoWalletDetected
  },
  {
    loadingText: "Detecting MetaMask Account",
    condition: typeof window !== "undefined" && typeof window.ethereum === "undefined" && !("selectedAddress" in userInfo),
    Component: ConnectWallet
  },
  {
    loadingText: "Detecting Username",
    condition: typeof window !== "undefined" && typeof window.ethereum === "undefined" && !("name" in userInfo),
    Component: CreateUsername
  },
]

export default function UserSetup({ setLoadingSetup }) {
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const animationDelay = 5000; // ms
  const totalAnimationDelay = animationDelay * (setupList.length - 1);
  const shouldShowApp = setupList.every(val => val.condition === false);
  
  function showApp() {
    setLoadingSetup(false)
  }

  return (
    <Container maxW='container.md'>
      <Flex direction="column" justify="center" alignItems="center">
        {setupList.map(({ Component, condition, loadingText }, idx) => {
          const currentDelay = animationDelay * idx;
          return (
            <Loading key={`loading-step-${idx}`} wait={currentDelay} loadingText={loadingText} condition={condition}>
              <Component userInfo={userInfo} setUserInfo={setUserInfo} />
            </Loading>
          )
        })}
        <Wait wait={totalAnimationDelay} show={shouldShowApp}>
          <Button onClick={showApp}>Enter App</Button>
        </Wait>
      </Flex>
    </Container>
  )
}