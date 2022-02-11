import { useEffect, useState } from "react";
import Lottie from "react-lottie";
import { getProfile } from "../../utils";
import CreateUsername from "./CreateUsername";
import NoWalletDetected from "./NoWalletDetected";
import {
  Flex,
  Heading,
  SlideFade,
  Container,
} from '@chakra-ui/react';
import * as loadingData from "./4397-loading-blocks.json";
import * as doneData from "./92460-checkmark-animation.json";
import * as errorData from "./14651-error-animation.json";

const loadingOptions = {
  loop: true,
  autoplay: true,
  animationData: loadingData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};
const doneOptions = {
  loop: false,
  autoplay: true,
  animationData: doneData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};
const errorOptions = {
  loop: false,
  autoplay: true,
  animationData: errorData.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
}

export default function UserSetup({ setSetupComplete }) {
  const animationDelay = 1000; // ms
  const [showMetamaskError, setShowMetamaskError] = useState(false);
  const [showCreateUsername, setShowCreateUsername] = useState(false);
  const [status, setStatus] = useState("pending");
  const [statusText, setStatusText] = useState("Loading...");
  
  // Run on initial load
  useEffect(async () => {
    setStatusText("Getting MetaMask!")
    if (typeof window.ethereum === "undefined") {
      setShowMetamaskError(true);
      setStatus("error");
      setStatusText("Please install MetaMask!")
      return;
    }
    setStatusText("Getting MetaMask account address");
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0]; // MetaMask currently only ever provide a single account, but the array gives us some room to grow.
    setStatusText("Getting user profile from database");
    const username = await getProfile(address);
    if (typeof username === "undefined") {
      setShowCreateUsername(true);
      setStatus("error");
      setStatusText("Register a username with this account!")
      return;
    }
    // Loading complete animation
    setStatus("success");
    setStatusText("Setup complete")
    setTimeout(() => {
      setSetupComplete(true);
    }, animationDelay)
  }, [])

  return (
    <Container maxW='container.md' h="100%">
      <Flex direction="column" justify="center" alignItems="center" h="100%">
        <Flex direction="row" justify="center" alignItems="center">
          {status === "pending" && <>
            <Heading as='h3' size='lg'>{statusText}</Heading>
            <Lottie options={loadingOptions} height={120} width={120} />
          </>}
          {status === "error" && <>
            <Heading as='h3' size='lg'>{statusText}</Heading>
            <Lottie options={errorOptions} height={120} width={120} />
          </>}
          {status === "success" && <>
            <Heading as='h3' size='lg'>{statusText}</Heading>
            <Lottie options={doneOptions} height={120} width={120} />
          </>}
        </Flex>
        {showMetamaskError &&
          <SlideFade in={true} offsetY='20px'>
            <NoWalletDetected />
          </SlideFade>
        }
        {showCreateUsername &&
          <SlideFade in={true} offsetY='20px'>
            <CreateUsername />
          </SlideFade>
        }
      </Flex>
    </Container>
  )
}