import useAsync from "../../hooks/useAsync";
import { ethers } from 'ethers'
import {
  Box,
  Button,
  Flex,
  Text,
  Spinner
} from '@chakra-ui/react';

export default function ConnectWallet({ userInfo, setUserInfo }) {
  const { execute, status, value, error } = useAsync(metamaskConnect, false);
  async function metamaskConnect() {
    try {
      await window.ethereum.enable()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setUserInfo({
        ...userInfo,
        selectedAddress: await signer.getAddress()
      });
    } catch (e) {
      throw new Error(e.message);
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