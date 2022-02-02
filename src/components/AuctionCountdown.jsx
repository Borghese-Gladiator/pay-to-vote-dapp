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
  const [prizePool, setPrizePool] = useState("");
  /*
  useEffect(async () => {
    setEndTime(await getVotingEndTime())
  }, [prizePool])

  useEffect(async () => {
    setPrizePool(await getTotalContribution())
  }, [prizePool])
  */
  return (
    <>
    <Container h={'100%'} maxW='container.sm'>
      <Table size='sm' variant='simple'>
        <Tbody>
          <Tr>
          <Td isNumeric><Heading as='h2' size='xl'>Time Left</Heading></Td>
            <Td><Text fontSize='lg'>{endTime === "" ? "Loading" : <CountdownTimer endTime={endTime} />}</Text></Td>
          </Tr>
          <Tr>
            <Td isNumeric><Heading as='h3' size='xl'>Prize Pool</Heading></Td>
            <Td><Text fontSize='lg'>{prizePool === "" ? "Loading" : `${prizePool} ETH`}</Text></Td>
          </Tr>
        </Tbody>
      </Table>
      </Container>
    </>
  )
}