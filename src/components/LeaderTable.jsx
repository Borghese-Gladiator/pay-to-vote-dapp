import { useState, useEffect, useContext } from 'react';
import ContractAddressesContext from "../context/ContractAddressesContext";
import UserInfoContext from "../context/UserInfoContext";
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
import { getTopVoters, rankOrdinalSuffix } from "../utils";

export default function LeaderTable() {
  const { customVotingAddress } = useContext(ContractAddressesContext);
  const { userInfo, setUserInfo } = useContext(UserInfoContext);

  const [leaderList, setLeaderList] = useState([]);
  const [loading, setLoading] = useState(true);
  function resetLeaderList() {
    setLoading(true);
    getTopVoters(customVotingAddress)
      .then(response =>
        setLeaderList(response)
      )
      .catch(e => alert(`Getting data failed: ${e.message}`))
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    resetLeaderList()
  }, [leaderList])

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
        leaderList.length === 0
          ? <Flex mt={3} justify="center">Empty Leaderboard!!</Flex>
          :
          <Table variant='simple' size="sm">
            <Tbody>
              {
                leaderList
                  .sort((leaderA, leaderB) => leaderB.contribution - leaderA.contribution)
                  .slice(0, 3)
                  .map(({ username, address, contribution, rank }, idx) => {
                    return (
                      <Tr key={`leader-row-${idx}`}>
                        <Td isNumeric>{rankOrdinalSuffix(rank)}</Td>
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