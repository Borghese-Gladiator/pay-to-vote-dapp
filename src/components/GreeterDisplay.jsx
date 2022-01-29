import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "./ErrorFallback";
import {
  Heading,
  Box,
  Flex,
  Stack,
  Button,
  Text,
  FormControl,
  Input
} from '@chakra-ui/react';

const textOneLineStyle = { whiteSpace: "nowrap" }
const defaultGreeting = "";

export default function GreeterDisplay({ greeterAddress }) {
  const [greeting, setGreeting] = useState();
  
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
        console.log('data: ', data)
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
      await transaction.wait()
      setGreeting(fetchGreeting());
    }
  }

  setGreeting(fetchGreeting());
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
          <Text p>Current greeting: {greeting}</Text>
          <form onSubmit={updateGreeting}>
            <FormControl isRequired>
              <Flex alignItems="center" m={1}>
                <Text style={textOneLineStyle}>Set Greeting</Text>
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