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
  Heading,
  Spinner
} from '@chakra-ui/react';
import { rankOrdinalSuffix, toTitleCase, textOneLineStyle, setUserContribution } from "../utils";
// Context
import ContractAddressesContext from "../context/ContractAddressesContext";
import { useState, useEffect, useContext } from 'react';

export default function UserProfile({ playerObj }) {
  const { username, contribution, rank } = playerObj;
  const { customCashGrabAddress } = useContext(ContractAddressesContext);
  const [isLoading, setLoading] = useState(false);
  /*
  const [contribution, setContribution] = setState("");

  useEffect(async () => {
    setContribution(await getUserContribution())
  }, [contribution])
  */
  async function handleSubmit() {
    console.log("BLAH")
    setLoading(true);
    await submitUserContribution(customCashGrabAddress);
    setContribution(await getUserContribution());
    setLoading(false);
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setGreeting(defaultGreeting)}
    >
      <Flex justify="center"><Heading as='h4' size='md'>{username === "" ? "Loading Stats" : `${toTitleCase(username)}  Stats`}</Heading></Flex>
      <Table size='sm' variant='unstyled'>
        <Tbody>
          <Tr>
            <Td><Text fontSize='md'>Current Rank</Text></Td>
            <Td><Text fontSize='md' noOfLines={1}>{rank === "" ? "Loading" : rankOrdinalSuffix(rank)}</Text></Td>
          </Tr>
          <Tr>
            <Td><Text fontSize='md'>Current Contribution</Text></Td>
            <Td><Text fontSize='md' noOfLines={1}>{contribution === "" ? "Loading" : `${contribution} ETH`}</Text></Td>
          </Tr>
          <Tr>
            <Td><Text fontSize='md' style={textOneLineStyle}>Enter New Amount</Text></Td>
            <Td><Input /></Td>
            <Td>
              <Flex alignItems="center">
                <Button onClick={handleSubmit}>Submit</Button>
                {
                  isLoading
                    ? <Spinner
                      thickness='4px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='blue.500'
                      size='xl'
                    />
                    : <></>
                }
              </Flex>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </ErrorBoundary>
  )
}