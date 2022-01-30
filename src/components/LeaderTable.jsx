import { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Center,
  IconButton,
  Collapse
} from '@chakra-ui/react';
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

export default function LeaderTable({ players }) {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);
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
          {players
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