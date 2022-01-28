import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "./ErrorFallback";
import {
  Box,
  VStack,
  Flex,
  Text
} from '@chakra-ui/react';

export default function UserProfile({ playerObj }) {
  const { username, highest, rank } = playerObj;
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setGreeting(defaultGreeting)}
    >
      <VStack
        justify={"center"}
        alignItems="center"
        borderWidth={1}
        h={"100%"}
      >
        <Text fontSize='4xl'>Hi {username}</Text>
        <Text fontSize='xl'>Current Rank: <Text fontSize='2xl' as='span'>{rank}</Text></Text>
        <Text fontSize='xl'>Current Highest: <Text fontSize='2xl' as='span'>${highest}</Text></Text>
      </VStack>
    </ErrorBoundary>
  )
}