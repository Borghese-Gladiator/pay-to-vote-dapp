import { useState, useEffect } from "react";
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
import { getTotalContribution, getVotingEndTime } from "../utils";

export default function AuctionCountdown() {
  const [endTime, setEndTime] = useState("");
  const [endTimeLoading, setEndTimeLoading] = useState(true);
  /*
  useEffect(() => {
    setEndTimeLoading(true);
    getVotingEndTime(customCashGrabAddress)
      .then(response =>
        setEndTime(response)
      )
      .catch(e => alert(`Getting end time failed: ${e.message}`))
      .finally(() => setEndTimeLoading(false))
  }, [endTime])
  */
  const [prizePool, setPrizePool] = useState("");
  const [prizePoolLoading, setPrizePoolLoading] = useState(true);
  /*
  useEffect(() => {
    setPrizePoolLoading(true);
    getVotingEndTime(customCashGrabAddress)
      .then(response =>
        setPrizePool(response)
      )
      .catch(e => alert(`Getting prize pool failed: ${e.message}`))
      .finally(() => setPrizePoolLoading(false))
  }, [endTime])
  */

  return (
    <>
      <Container h={'100%'} maxW='container.sm'>
        <Table size='sm' variant='simple'>
          <Tbody>
            <Tr>
              <Td isNumeric><Heading as='h2' size='xl'>Time Left</Heading></Td>
              <Td><Text fontSize='lg'>{endTimeLoading ? "Loading" : <CountdownTimer endTime={endTime} />}</Text></Td>
            </Tr>
            <Tr>
              <Td isNumeric><Heading as='h3' size='xl'>Prize Pool</Heading></Td>
              <Td><Text fontSize='lg'>{prizePoolLoading ? "Loading" : `${prizePool} ETH`}</Text></Td>
            </Tr>
          </Tbody>
        </Table>
      </Container>
    </>
  )
}