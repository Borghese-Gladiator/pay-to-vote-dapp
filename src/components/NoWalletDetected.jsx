import {
  VStack,
  Button,
  Text,
  Link,
  Container
} from '@chakra-ui/react';

export default function NoWalletDetected() {
  return (
    <Container
      maxW='container.sm'
      p={3}
      border='1px'
      borderColor='gray.200'
    >
      <VStack
        spacing={4}
      >
        <form
          action="https://metamask.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button colorScheme='teal' type="submit" isFullWidth>
            Install MetaMask 🦊<ExternalLinkIcon mx='2px' />
          </Button>
        </form>
        <Text fontSize='lg'>
          MetaMask is a Chrome Extension that lets you approve Ethereum
          transactions
        </Text>
        <Text fontSize='sm'>
          Once MetaMask is installed, this page should{' '}
          <Link color='teal.500' href='/'>
            refresh
          </Link>{' '}
          automatically
        </Text>
      </VStack>
    </Container>
  )
}
