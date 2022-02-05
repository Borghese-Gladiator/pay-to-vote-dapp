// Load smart contracts
import { ethers } from 'ethers'
import Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json'

// Context
import ContractAddressesContext from "../context/ContractAddressesContext";

// Frontend
import { useState, useEffect, useContext } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "./ErrorFallback";
import {
  Heading,
  Box,
  Stack,
  Flex,
  Button,
  Text,
  FormControl,
  Input,
  Spinner
} from '@chakra-ui/react';

const defaultGreeting = "";

export default function GreeterDisplay() {
  const { greeterAddress } = useContext(ContractAddressesContext);
  const [greeting, setGreeting] = useState();
  const [loading, setLoading] = useState(false);

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window !== "undefined" && typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        return data;
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  // call the smart contract, send an update
  async function updateGreeting(e) {
    e.preventDefault();
    const newGreeting = e.target.greeting.value;
    if (!greeting) return
    if (typeof window !== "undefined" && typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(newGreeting)
      setLoading(true);
      await transaction.wait()
      setGreeting(await fetchGreeting());
      setLoading(false);
    }
  }
  useEffect(async () => {
    setGreeting(await fetchGreeting());
  }, [greeting])

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setGreeting(defaultGreeting)}
    >
      <Box
        borderWidth={2}
        mb={1}
        p={3}
      >
        <Stack>
          <Heading>Greeter</Heading>
          <Flex>
            <Text p>Current greeting: {greeting}</Text>
            {loading && <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />}
          </Flex>
          <form onSubmit={updateGreeting}>
            <FormControl isRequired>
              <Flex alignItems="center" m={1}>
                <Text noOfLines={1}>Set Greeting</Text>
                <Box pl={1} />
                <Input name="greeting" placeholder={greeting} size="lg" />
                <Button type="submit">Submit</Button>
              </Flex>
            </FormControl>
          </form>
        </Stack>
      </Box>
    </ErrorBoundary>
  )
}