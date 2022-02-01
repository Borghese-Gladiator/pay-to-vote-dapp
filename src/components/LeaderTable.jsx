import { useState, useContext, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Center,
  Flex,
} from '@chakra-ui/react';

// Context
import ContractAddressesContext from "../context/ContractAddressesContext";

// Utils
import { getLeaders, rankOrdinalSuffix } from "../utils";

export default function LeaderTable({ players }) {
  const { customCashGrabAddress } = useContext(ContractAddressesContext);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getLeaders(customCashGrabAddress).then((val) => {
      setLeaders(val);
    })
      .catch(e => alert(`Getting data failed: ${e.message}`))
      .finally(() => setLoading(false))
  }, []);

  return (
    <>
      <Center><Heading as='h4' size='md'>Leaderboard</Heading></Center>
      <Table variant='unstyled'>
        <Tbody>
          {loading
            ? <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
            : leaders.length === 0 
            ? <Flex mt={3} justify="center">No Voters Found</Flex>
            : leaders
                .sort((playerA, playerB) => playerA.contribution - playerB.contribution)
                .slice(0, 3)
                .map(({ name, address, contribution }, idx) => {
                  return (
                    <Tr key={`leader-row-${idx}`}>
                      <Td>{rankOrdinalSuffix(idx + 1)}</Td>
                      <Td>{name}</Td>
                      <Td>{address}</Td>
                      <Td isNumeric>${contribution}</Td>
                    </Tr>
                  )
                })
          }
        </Tbody>
      </Table>
    </>
  )
}