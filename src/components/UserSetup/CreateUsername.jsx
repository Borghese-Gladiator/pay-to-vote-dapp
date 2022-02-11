import { useState, useContext } from "react";
import UserInfoContext from "../../context/UserInfoContext";

import {
  Input,
  Text,
  Button,
  Flex,
  Spinner,
  Container,
  Alert,
  AlertIcon,
  Heading
} from '@chakra-ui/react';

import { ethers } from 'ethers'
import { fetchGetProfile, fetchPostProfile, timeout } from "../../utils";

export default function CreateUsername({ setSetupComplete }) {
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState();

  const [username, setUsername] = useState('')
  const handleChange = (event) => setUsername(event.target.value);

  async function updateUsername() {
    setStatus("pending");
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    
    // MetaMask requires requesting permission to connect users accounts
    const accounts = await provider.send("eth_requestAccounts", []);
    const address = accounts[0];

    // Check localhost or Ropsten Testnet - https://ethereum.stackexchange.com/questions/85194/how-to-check-the-current-metamask-network
    console.log(window.ethereum.networkVersion, 'window.ethereum.networkVersion');
    
    const { chainId } = await provider.getNetwork()
    console.log(chainId);
    if (chainId !== 3 && chainId !== 1337) {
      setStatus("error");
      setError("In MetaMask, please change to Ropsten network");
    } else {
      try {
        const success = await fetchPostProfile(address, username);
        const profile = await fetchGetProfile(address);
        setStatus("success");
        await timeout();
        setUserInfo(profile);
        setSetupComplete(true);
      } catch(e) {
        setStatus("error");
        setError(e.message);
      }
    }
  }

  return (
    <Container
      maxW='container.sm'
      p={3}
      border='1px'
      borderColor='gray.200'
    >
      <Flex direction="column" p={3} m={1}>
        {status === "idle" || status === "pending" && <Text mt={5}>Enter Username below</Text>}
        {status === "success" && <Alert status='success' mt={5}><AlertIcon />Successfully created user!</Alert>}
        {status === "error" && <Alert status='error' mt={5}><AlertIcon />{error}</Alert>}
        <Flex alignItems="center">
          <Input
            value={username}
            onChange={handleChange}
            placeholder={"Enter username here"} size="lg" />
          <Button onClick={updateUsername} disabled={status === "pending"}>Submit</Button>
          {status === "pending"
            && <div><Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            /></div>}
        </Flex>
      </Flex>
    </Container>
  )
}