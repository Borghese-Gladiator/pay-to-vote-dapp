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
} from '@chakra-ui/react';

// Context
import ContractAddressesContext from "../context/ContractAddressesContext";

import { getLeaders } from "../utils";

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
      <Center><Heading as='h3' size='lg'>Leaderboard</Heading></Center>
      <Table variant='simple'>
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Address</Th>
            <Th isNumeric>Contribution</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading
            ? <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
            : leaders
              .sort((playerA, playerB) => playerA.contribution - playerB.contribution)
              .slice(0, 3)
              .map(({ name, address, contribution }, idx) => {
                return (
                  <Tr key={`leader-row-${idx}`}>
                    <Td>{idx + 1}</Td>
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