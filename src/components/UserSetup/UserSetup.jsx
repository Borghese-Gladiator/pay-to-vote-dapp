import { useEffect, useState, useContext } from "react";
import UserInfoContext from "../../context/UserInfoContext";

import CreateUsername from "./CreateUsername";
import NoWalletDetected from "./NoWalletDetected";
import Lottie from "react-lottie";
import {
  Flex,
  Heading,
  SlideFade,
  Container,
} from '@chakra-ui/react';

import { ethers } from "ethers";
import { fetchGetProfile, timeout } from "../../utils";

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
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const [showMetamaskError, setShowMetamaskError] = useState(false);
  const [showCreateUsername, setShowCreateUsername] = useState(false);
  const [status, setStatus] = useState("pending");
  const [statusText, setStatusText] = useState("Loading...");
  
  // Run on initial load
  useEffect(() => {
    async function fetchData() {
      setStatusText("Getting MetaMask!")
      await timeout();
      if (typeof window.ethereum === "undefined") {
        setShowMetamaskError(true);
        setStatus("error");
        setStatusText("Please install MetaMask!")
        return;
      }
      
      setStatusText("Getting MetaMask account");
      await timeout();
      let metamaskErr;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []).catch(err => metamaskErr = err);
      if (metamaskErr) {
        setStatus("error");
        setStatusText("Please login to MetaMask!")
        return;
      }
      const address = accounts[0]; // MetaMask currently only ever provide a single account, but the array gives us some room to grow.
      
      setStatusText("Getting user profile from database");
      await timeout();
      let getProfileErr;
      const profile = await fetchGetProfile(address).catch(err => getProfileErr = err);
      console.log(getProfileErr);
      if (typeof getProfileErr !== "undefined" && "code" in getProfileErr && getProfileErr.code === 401 ) {
        setStatus("error");
        setStatusText(`User declined signing username.`)
        return;
      }
      if (typeof getProfileErr !== "undefined" && "msg" in getProfileErr && getProfileErr.msg === "Incorrect signature") {
        //  && getProfileErr.msg === "Incorrect signature - are you on the correct account?"
        console.log("get profile");
        setStatus("error");
        setStatusText(`Switch accounts! Incorrect signature for username: ${getProfileErr.username}`)
        return;
      }
      if (getProfileErr) {
        setShowCreateUsername(true);
        setStatus("error");
        setStatusText("Register a username!")
        return;
      }
  
      // Loading complete animation
      setStatus("success");
      setStatusText("Setup complete")
      await timeout();
      setUserInfo(profile);
      setSetupComplete(true);
    }
    fetchData()
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
            <CreateUsername setSetupComplete={setSetupComplete} />
          </SlideFade>
        }
      </Flex>
    </Container>
  )
}