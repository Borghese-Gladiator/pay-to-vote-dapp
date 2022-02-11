import { useState, useEffect, useContext } from 'react';
import ContractAddressesContext from "../context/ContractAddressesContext";

import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "./ErrorFallback";

import CountdownTimer from "./CountdownTimer";
import {
  Table,
  Tbody,
  Tr,
  Td,
  Heading,
  Text,
  Container
} from '@chakra-ui/react';

import { getTotalPool, getVotingEndTime } from "../utils";

export default function VotingCountdown() {
  const { customVotingAddress } = useContext(ContractAddressesContext);
  const [endTime, setEndTime] = useState({ hours: 0, minutes: 0, seconds: 0});
  const [endTimeLoading, setEndTimeLoading] = useState(true);
  function resetEndTime() {
    setEndTimeLoading(true);
    getVotingEndTime(customVotingAddress)
      .then(response => {
        setEndTime(response)
      })
      .catch(e => console.log(`Getting end time failed: ${e.message}`))
      .finally(() => setEndTimeLoading(false))
  }
  // Call setEndTime only on initial load
  useEffect(() => {
    resetEndTime()
  }, [])

  const [prizePool, setPrizePool] = useState("");
  const [prizePoolLoading, setPrizePoolLoading] = useState(true);
  function resetPrizePool() {
    setPrizePoolLoading(true);
    getTotalPool(customVotingAddress)
      .then(response =>
        setPrizePool(response)
      )
      .catch(e => console.log(`Getting prize pool failed: ${e.message}`))
      .finally(() => setPrizePoolLoading(false))
  }
  useEffect(() => {
    resetPrizePool()
  }, [prizePool])

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        resetEndTime()
        resetPrizePool()
      }}
    >
      <Container h={'100%'} maxW='container.sm'>
        <Table variant='simple' size="md">
          <Tbody>
            <Tr>
              <Td isNumeric><Heading as='h2' size='xl'>Time Left</Heading></Td>
              <Td>{endTimeLoading ? <Text fontSize='lg'>Loading</Text> : <CountdownTimer endTime={endTime} />}</Td>
            </Tr>
            <Tr>
              <Td isNumeric><Heading as='h3' size='xl'>Prize Pool</Heading></Td>
              <Td><Text fontSize='lg'>{prizePoolLoading ? "Loading" : `${prizePool} ETH`}</Text></Td>
            </Tr>
          </Tbody>
        </Table>
      </Container>
    </ErrorBoundary>
  )
}