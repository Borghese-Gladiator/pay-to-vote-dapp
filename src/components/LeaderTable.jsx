import { useState, useEffect, useContext } from 'react';
import ContractAddressesContext from "../context/ContractAddressesContext";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "./ErrorFallback";
import {
  Table,
  Tbody,
  Tr,
  Td,
  Spinner,
  Heading,
  Center,
  Flex,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { getVoterList, rankOrdinalSuffix } from "../utils";

export default function LeaderTable() {
  const { customCashGrabAddress } = useContext(ContractAddressesContext);
  const [leaderList, setLeaderList] = useState([]);
  const [loading, setLoading] = useState(true);
  function resetLeaderList() {
    setLoading(true);
    getVoterList(customCashGrabAddress)
      .then(response =>
        setLeaderList(response.slice(0, 5))
      )
      .catch(e => alert(`Getting data failed: ${e.message}`))
      .finally(() => setLoading(false))
  }
  /*
  useEffect(() => {
    resetLeaderList()
  }, [leaderList])
  */

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => resetLeaderList()}
    >
      <Center><Heading as='h4' size='md'>Leaderboard</Heading></Center>
      {loading
        ?
        <Flex mt={3} justify="center">
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Flex>
        :
        <Table variant='simple' size="sm">
          <Tbody>
            {leaderList.length === 0
              ? <Flex mt={3} justify="center">Empty Leaderboard!!</Flex>
              : leaderList
                .sort((leaderA, leaderB) => leaderB.contribution - leaderA.contribution)
                .slice(0, 3)
                .map(({ name, address, contribution }, idx) => {
                  return (
                    <Tr key={`leader-row-${idx}`}>
                      <Td isNumeric>{rankOrdinalSuffix(idx + 1)}</Td>
                      <Td>
                        <Popover trigger="hover">
                          <PopoverTrigger>
                            <Box borderWidth={1} p={2} _hover={{ bg: "teal.600" }}>{name}</Box>
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Address: {address}</PopoverHeader>
                          </PopoverContent>
                        </Popover>
                      </Td>
                      <Td>${contribution}</Td>
                    </Tr>
                  )
                })}
          </Tbody>
        </Table>
      }
    </ErrorBoundary>
  )
}