import { useEffect, useState } from "react";
import useAsync from "../../hooks/useAsync";
import {
  Box,
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
const textOneLineStyle = { whiteSpace: "nowrap" }

export default function CreateUsername({ userInfo, setUserInfo }) {
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('')
  const handleChange = (event) => setUsername(event.target.value);

  const { execute, status, value, error } = useAsync(updateUsername, false);
  async function updateUsername() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts);
    const account = accounts[0];
    setUserInfo({
      username: username,
      address: account.address
    });
  }

  useEffect(async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(accounts);
    const account = accounts[0];
    setAddress(account.address)
  }, [address])

  return (
    <Container maxW='container.sm'>
      <Box
        borderWidth={2}
        mb={1}
        p={3}
      >
        <Flex direction="column" p={3} m={1}>
          <Heading as='h4' size='md'>First Time Seeing This Account!</Heading>
          {status === "idle" && <Text>Submit to load account info</Text>}
          {status === "success" && <Alert status='success'><AlertIcon />{value}</Alert>}
          {status === "error" && <Alert status='error'><AlertIcon />{error.message}</Alert>
          }
          <Text mt={5} style={textOneLineStyle}>Enter Username</Text>
          <Flex alignItems="center">
            <Input
              value={username}
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
        </Flex>
      </Box>
    </Container>
  )
}