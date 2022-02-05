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

export default function CreateUsername({ userInfo, setUserInfo, setupComplete }) {
  const [address, setAddress] = useState('');
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
    console.log(accounts);
    const account = accounts[0];
    setUserInfo({
      username: username,
      address: account
    });
    setupComplete();
  }

  return (
    <Container
      maxW='container.sm'
      p={3}
      border='1px'
      borderColor='gray.200'
    >
      <Flex direction="column" p={3} m={1}>
        <Heading as='h4' size='md'>First Time Seeing This Account!</Heading>
        {status === "idle" && <Text mt={5}>Create Username</Text>}
        {status === "success" && <Alert status='success' mt={5}><AlertIcon />Successfully created username: {username}</Alert>}
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