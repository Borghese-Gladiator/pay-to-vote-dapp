/**
 * Table for User's Past Transactions
 */

import {
  Heading,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Flex,
  Text
} from '@chakra-ui/react';
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function UserTxnTable({ transactions }) {
  return (
    <>
      <Center><Heading as='h3' size='md' m={2}>Past Transactions</Heading></Center>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th>Order</Th>
            <Th>Date</Th>
            <Th>Contribution</Th>
            <Th>TXN Link</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions
            .sort((txnA, txnB) => txnB.date - txnA.date)
            .map(({ date, contribution, txnHash }, idx) => {
              const order = transactions.length - idx;
              const dateString = date
                .toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
                .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
              return (
                <Tr key={`txn-row-${order}`}>
                  <Td>{order}</Td>
                  <Td>{dateString}</Td>
                  <Td>${contribution}</Td>
                  <Td>
                    <Link
                      href={`https://etherscan.io/tx/${txnHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      isExternal
                    >
                      <Flex alignItems="center">
                        <Text as={"p"}>{txnHash}</Text>
                        <ExternalLinkIcon w={8} h={8} p={1} />
                      </Flex>
                    </Link>
                  </Td>
                </Tr>
              )
            })
          }
        </Tbody>
      </Table>
    </>
  )
}
