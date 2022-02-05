/**
 * DApps require account setup through MetaMask
 * 
 * Steps
 * check MetaMask is installed (detect Ethereum Provider)
 * check user is connected to MetaMask
 * check user has signed in before using Web3 message signing
 */
import { useContext, useState } from "react";
// Context
import UserInfoContext from "../../context/UserInfoContext";
// Custom components
import { Loading, Wait } from "./Loading";
import NoWalletDetected from "./NoWalletDetected";
import CreateUsername from "./CreateUsername";
import {
  Container,
  Flex,
  Button
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { isVoter } from "../../utils";

export default function UserSetup({ setLoadingSetup }) {
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const animationDelay = 1000; // ms
  const setupList = [
    {
      loadingText: "Detecting MetaMask",
      errorText: "MetaMask Not Detected",
      condition: async () => {
        return typeof window !== "undefined" && typeof window.ethereum === "undefined"
      },
      Component: NoWalletDetected
    },
    {
      loadingText: "Detecting Account and Username",
      errorText: "Account not seen before",
      condition: async () => {
        if (!("address" in userInfo)) {
          return true
        }
        return await !isVoter(userInfo.address)
      },
      Component: CreateUsername
    },
  ];
  const totalAnimationDelay = animationDelay * (setupList.length - 1);
  const [shouldShowApp, setShouldShowApp] = useState(setupList.every(val => val.condition() === false));

  function showApp() {
    setLoadingSetup(false)
  }

  console.log(typeof window !== "undefined" && typeof window.ethereum === "undefined");
  if (typeof window !== "undefined" && typeof window.ethereum === "undefined") {
    return (
      <Container maxW='container.md'>
        <Flex direction="column" justify="center" alignItems="center">
          <Loading
            key={`loading-step-0`}
            wait={animationDelay * 0}
            loadingText={"Detecting MetaMask"}
            errorText={"MetaMask Not Detected"}
            condition={async () => {
              return typeof window !== "undefined" && typeof window.ethereum === "undefined"
            }}
          >
            <NoWalletDetected />
          </Loading>
        </Flex>
      </Container>
    )
  }

  return (
    <Container maxW='container.md'>
      <Flex direction="column" justify="center" alignItems="center">
        <Loading
          key={`loading-step-0`}
          wait={animationDelay * 0}
          loadingText={"Detecting MetaMask"}
          errorText={"MetaMask Not Detected"}
          condition={async () => {
            return typeof window !== "undefined" && typeof window.ethereum === "undefined"
          }}
        >
          <NoWalletDetected />
        </Loading>
        <Loading
          key={`loading-step-1`}
          wait={animationDelay * 1}
          loadingText={"Detecting Account and Username"}
          errorText={"Account not seen before"}
          condition={async () => {
            if (!("address" in userInfo)) {
              return true
            }
            return await !isVoter(userInfo.address)
          }}
        >
          <CreateUsername userInfo={userInfo} setUserInfo={setUserInfo} setupComplete={() => setShouldShowApp(true)} />
        </Loading>
        <Wait wait={totalAnimationDelay} show={shouldShowApp}>
          <Button
            mt={5}
            leftIcon={<CheckIcon />}
            colorScheme='pink'
            variant='solid'
            onClick={showApp}
          >
            Enter App
          </Button>
        </Wait>
      </Flex>
    </Container>
  )
}