import { useState, useEffect, useContext } from 'react';
import ContractAddressesContext from "../context/ContractAddressesContext";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "./ErrorFallback";
import {
  Flex,
  Text,
  Input,
  Table,
  Tbody,
  Tr,
  Td,
  Button,
  Heading,
  Spinner
} from '@chakra-ui/react';
import { rankOrdinalSuffix, toTitleCase, textOneLineStyle, getUserProfile, setUserContribution } from "../utils";

export default function UserProfile() {
  const { customCashGrabAddress } = useContext(ContractAddressesContext);
  const [profile, setProfile] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  /*
  useEffect(() => {
    setProfileLoading(true);
    getUserProfile(customCashGrabAddress)
      .then(response =>
        setProfile(response) // { username, rank, contribution }
      )
      .catch(e => alert(`Getting profile failed: ${e.message}`))
      .finally(() => setProfileLoading(false))
  }, [profile])
  */

  const [contributionLoading, setContributionLoading] = useState(false);
  /*
  async function handleSubmit() {
    setContributionLoading(true);
    submitUserContribution(customCashGrabAddress)
      .then(response => {
        setProfile(""); // reset profile to refresh contribution amount
      })
      .catch(e => alert(`Sending failed: ${e.message}`))
      .finally(() => setContributionLoading(false))
  }
  */

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setGreeting(defaultGreeting)}
    >
      <Flex justify="center"><Heading as='h4' size='md'>{profileLoading ? "Loading Stats" : `${toTitleCase(profile.username)}  Stats`}</Heading></Flex>
      <Table size='sm' variant='unstyled'>
        <Tbody>
          <Tr>
            <Td><Text fontSize='md'>Current Rank</Text></Td>
            <Td><Text fontSize='md' noOfLines={1}>{profileLoading ? "Loading" : rankOrdinalSuffix(profile.rank)}</Text></Td>
          </Tr>
          <Tr>
            <Td><Text fontSize='md'>Current Contribution</Text></Td>
            <Td><Text fontSize='md' noOfLines={1}>{profileLoading ? "Loading" : `${profile.contribution} ETH`}</Text></Td>
          </Tr>
          <Tr>
            <Td><Text fontSize='md' style={textOneLineStyle}>Enter New Amount</Text></Td>
            <Td><Input /></Td>
            <Td>
              <Flex alignItems="center">
                <Button onClick={handleSubmit}>Submit</Button>
                {
                  contributionLoading
                    ? <Spinner
                      thickness='4px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='blue.500'
                      size='xl'
                    />
                    : <></>
                }
              </Flex>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </ErrorBoundary>
  )
}