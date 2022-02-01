import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "./ErrorFallback";
import {
  Flex,
  Text,
  Input,
  Table,
  Tbody,
  Tr,
  Td,
  Button,
} from '@chakra-ui/react';
import { rankOrdinalSuffix, toTitleCase, textOneLineStyle } from "../utils";

export default function UserProfile({ playerObj }) {
  const { username, contribution, rank } = playerObj;
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setGreeting(defaultGreeting)}
    >
      <Flex justify="center"><Text fontSize='2xl'>{toTitleCase(username)} Stats</Text></Flex>
      <Table size='sm' variant='unstyled'>
        <Tbody>
          <Tr>
            <Td><Text fontSize='md'>Current Rank</Text></Td>
            <Td><Text fontSize='md' noOfLines={1}>{rankOrdinalSuffix(rank)}</Text></Td>
          </Tr>
          <Tr>
            <Td><Text fontSize='md'>Current Contribution</Text></Td>
            <Td><Text fontSize='md' noOfLines={1}>{`${contribution} `}ETH</Text></Td>
          </Tr>
          <Tr>
            <Td><Text fontSize='md' style={textOneLineStyle}>Enter New Amount</Text></Td>
            <Td><Input /></Td>
            <Td><Button onClick={() => console.log("BLAH")}>Submit</Button></Td>
          </Tr>
        </Tbody>
      </Table>
    </ErrorBoundary>
  )
}