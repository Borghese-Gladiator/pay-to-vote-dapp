import { useState } from "react";
import useAsync from "../../hooks/useAsync";
import {
  Box,
  Input,
  Text,
  Button,
  Flex,
  Spinner
} from '@chakra-ui/react';

const textOneLineStyle = { whiteSpace: "nowrap" }

export default function CreateUsername({ userInfo, setUserInfo }) {
  const [username, setUsername] = useState('')
  const handleChange = (event) => setUsername(event.target.value);

  const { execute, status, value, error } = useAsync(updateUsername, false);
  async function updateUsername() {
    try {
      const message = `Hello! I will sign this message with name: ${username}`;
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0]; // MetaMask gets current account
      const signature = await window.ethereum.request({ method: 'personal_sign', params: [message, account] });
      setUserInfo({
        ...userInfo,
        name: username
      });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  return (
    <Box
      borderWidth={2}
      mb={1}
      p={3}
    >
      {status === "idle" && <div>Waiting to set username by using Web3 Message signing given user address...</div>}
      {status === "success" && <div>{value}</div>}
      {status === "error" && <div>{error}</div>}
      <Flex alignItems="center" m={1}>
        <Text style={textOneLineStyle}>Set Username</Text>
        <Box pl={1} />
        <Input
          value={value}
          onChange={handleChange}
          placeholder={"Winged Victory of Samothrace"} size="lg" />
        <Button onClick={execute} disabled={status === "pending"}>Submit</Button>
        {status === "pending"
          && <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />}
      </Flex>
    </Box>
  )
}