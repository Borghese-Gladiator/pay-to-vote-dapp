import { useState, useEffect } from "react";
import CountdownTimer from "./CountdownTimer";
import {
  Table,
  Tbody,
  Tr,
  Td,
  Heading
} from '@chakra-ui/react';
import { getTotalContribution, getVotingEndTime } from "../utils";

export default function AuctionCountdown() {
  const blah = { hours: 0, minutes: 60, seconds: 0 }
  const [endTime, setEndTime] = useState(0);
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
      <Table size='sm' variant='unstyled'>
        <Tbody>
          <Tr>
            <Td isNumeric><Heading as='h2' size='2xl'>Time Left</Heading></Td>
            <Td>{endTime === "" ? "Loading" : <CountdownTimer endTime={blah} />}</Td>
          </Tr>
          <Tr>
            <Td isNumeric><Heading as='h2' size='2xl'>Prize Pool</Heading></Td>
            <Td>{prizePool === "" ? "Loading" : `${prizePool} ETH`}</Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  )
}