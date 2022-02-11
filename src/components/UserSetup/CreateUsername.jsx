import { ethers } from 'ethers'
import { useState } from "react";
import useAsync from "../../hooks/useAsync";
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
import { usernameTaken } from "../../utils";

export default function CreateUsername({ setupComplete }) {
  const { customVotingAddress } = useContext(ContractAddressesContext);
  const [username, setUsername] = useState('')
  const handleChange = (event) => setUsername(event.target.value);

  const { execute, status, value, error } = useAsync(updateUsername, false);
  async function updateUsername() {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner()
    // MetaMask requires requesting permission to connect users accounts
    const accounts = await provider.send("eth_requestAccounts", []);
    const account = accounts[0];
    if (await usernameTaken(customVotingAddress, username)) {
      throw new Error("Username already taken");
    }
    // Check localhost or Ropsten Testnet - https://ethereum.stackexchange.com/questions/85194/how-to-check-the-current-metamask-network
    if (window.ethereum.networkVersion !== "3" && window.ethereum.networkVersion !== "1337") {
      alert("Please change to Ropsten network")
    }
    else {
      setUserInfo({
        username: username,
        address: account
      });
      setupComplete();
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
        <Heading as='h4' size='md'>Please Create a User</Heading>
        {status === "idle" && <Text mt={5}>Enter Username below</Text>}
        {status === "success" && <Alert status='success' mt={5}><AlertIcon />Successfully created</Alert>}
        {status === "error" && <Alert status='error' mt={5}><AlertIcon />{error.message}</Alert>}
        <Flex alignItems="center">
          <Input
            value={username}
            onChange={handleChange}
            placeholder={"Winged Victory of Samothrace"} size="lg" />
          <Button onClick={execute} disabled={status === "pending"}>Submit</Button>
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