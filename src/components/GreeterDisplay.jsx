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

export default function GreeterDisplay({ greeting, setGreeting, handleSubmitGreeting }) {
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
          <form onSubmit={handleSubmitGreeting}>
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