import {
  Box,
  Stack,
  Heading,
  Input,
  Text,
  Button,
  Flex,
  FormControl
} from '@chakra-ui/react';

const textOneLineStyle = { whiteSpace: "nowrap" }

export default function CreateUsername({ userInfo, setUserInfo }) {
  async function updateUsername(e) {
    if (typeof window !== "undefined") {
      e.preventDefault();
      const name = e.target.username.name;
      // Tell user to enter name
      const message = "Hello from Ethereum Stack Exchange!";
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const signature = await window.ethereum.request({ method: 'personal_sign', params: [message, account] });

      setUserInfo({
        ...userInfo,
        name: name
      });
    }
    /*
    // Create a SHA3 hash of the message 'Apples'
    const messageHash = web3.sha3('Apples');

    // Signs the messageHash with a given account
    const signature = await web3.eth.personal.sign(messageHash, web3.eth.defaultAccount);
    */
  }

  return (
    <Box
      borderWidth={2}
      mb={1}
      p={3}
    >
      <Stack>
        <Heading>Set Username</Heading>
        <form onSubmit={updateUsername}>
          <FormControl isRequired>
            <Flex alignItems="center" m={1}>
              <Text style={textOneLineStyle}>Set Greeting</Text>
              <Box pl={1} />
              <Input name="username" placeholder={"Winged Victory of Samothrace"} size="lg" />
              <Button type="submit">Submit</Button>
            </Flex>
          </FormControl>
        </form>
      </Stack>
    </Box>
  )
}