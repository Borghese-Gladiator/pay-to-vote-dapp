/**
 * Table for User's Past Transactions
 */
import { useState, useEffect, useContext } from 'react';
import UserInfoContext from "../context/UserInfoContext";

import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "./ErrorFallback";

import {
  Spinner,
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

import { fetchTransactionList } from "../utils";

export default function TransactionTable() {
  const { userInfo, setUserInfo } = useContext(UserInfoContext);
  const { address, transactionList } = userInfo;

  const [txnList, setTxnList] = useState(transactionList);
  const [loading, setLoading] = useState(false);
  function resetTransactionList() {
    setLoading(true);
    fetchTransactionList(address)
      .then(response =>
        setTxnList(response)
      )
      .catch(e => console.log(`Getting data failed: ${e.message}`))
      .finally(() => setLoading(false))
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => resetTransactionList()}
    >
      <Center><Heading as='h3' size='md' m={2}>Past Transactions</Heading></Center>
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
        txnList.length === 0
          ? <Center>No Transactions Found</Center>
          : <Table size='sm'>
            <Thead>
              <Tr>
                <Th>Order</Th>
                <Th>Date</Th>
                <Th>Contribution</Th>
                <Th>TXN Link</Th>
              </Tr>
            </Thead>
            <Tbody>
              {txnList
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
                })}
            </Tbody>
          </Table>
      }
    </ErrorBoundary>
  )
}
