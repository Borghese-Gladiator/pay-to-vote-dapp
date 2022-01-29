import { useState } from "react";
import useAsync from "../../hooks/useAsync";
import { ethers } from 'ethers'
import {
  Box,
  Button,
  Flex,
  Spinner
} from '@chakra-ui/react';

export default function ConnectWallet({ userInfo, setUserInfo }) {
  const { execute, status, value, error } = useAsync(metamaskConnect, false);
  const [loading, setLoading] = useState(false);
  async function metamaskConnect() {
    if (typeof window !== "undefined") {
      setLoading(true);
      await window.ethereum.enable()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setUserInfo({
        ...userInfo,
        selectedAddress: await signer.getAddress()
      });
      setLoading(false);
    }
  }
  return (
    <Box
      borderWidth={2}
      p={3}
    >
      {status === "idle" && <div>Waiting to get address from MetaMask...</div>}
      {status === "success" && <div>{value}</div>}
      {status === "error" && <div>{error}</div>}
      <Button onClick={execute} disabled={status === "pending"}>
        <Flex alignItems="center">
          <Text>Connect to MetaMask</Text>
          {status === "pending"
          && <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />}
        </Flex>
      </Button>
    </Box>
  )
}

import React, { useState, useEffect, useCallback } from "react";
// Usage
function App() {
  const { execute, status, value, error } = useAsync(myFunction, false);
  return (
    <div>
      {status === "idle" && <div>Start your journey by clicking a button</div>}
      {status === "success" && <div>{value}</div>}
      {status === "error" && <div>{error}</div>}
      <button onClick={execute} disabled={status === "pending"}>
        {status !== "pending" ? "Click me" : "Loading..."}
      </button>
    </div>
  );
}
// An async function for testing our hook.
// Will be successful 50% of the time.
const myFunction = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rnd = Math.random() * 10;
      rnd <= 5
        ? resolve("Submitted successfully 🙌")
        : reject("Oh no there was an error 😞");
    }, 2000);
  });
};