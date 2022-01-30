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
} from '@chakra-ui/react';

export default function LeaderTable({ players }) {
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