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
            <Th></Th>
            <Th>Rank</Th>
            <Th>Name</Th>
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
                  <Td>
                    <IconButton
                      ml={2}
                      size='sm'
                      aria-label='Open collapsible'
                      icon={show ? <AiFillCaretUp /> : <AiFillCaretDown />}
                      onClick={handleToggle}
                    />
                  </Td>
                  <Td>{idx + 1}</Td>
                  <Td>
                    {name}
                  </Td>
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