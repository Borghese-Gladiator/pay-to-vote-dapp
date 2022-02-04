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
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { rankOrdinalSuffix, toTitleCase, textOneLineStyle, getUserProfile, setUserContribution } from "../utils";

export default function UserProfile() {
  const { customVotingAddress } = useContext(ContractAddressesContext);
  const [profile, setProfile] = useState({ username: "Username A", address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" });
  const [profileLoading, setProfileLoading] = useState(true);

  function resetProfile() {
    setProfileLoading(true);
    getUserProfile(customVotingAddress)
      .then(response =>
        setProfile(response) // { username, address, rank, contribution }
      )
      .catch(e => alert(`Getting profile failed: ${e.message}`))
      .finally(() => setProfileLoading(false))
  }
  /*
  useEffect(() => {
    resetProfile()
  }, [profile])
  */

  const [contributionLoading, setContributionLoading] = useState(false);
  async function handleSubmit() {
    setContributionLoading(true);
    submitUserContribution(customVotingAddress)
      .then(response => {
        setProfile(""); // reset profile to refresh contribution amount
      })
      .catch(e => alert(`Sending failed: ${e.message}`))
      .finally(() => setContributionLoading(false))
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => resetProfile()}
    >
      <Flex justify="center">
        {profileLoading
          ?
          <Heading as='h4' size='md'>Loading Stats</Heading>
          :
          <Popover trigger="hover">
            <PopoverTrigger>
              <Heading as='h4' size='md'>{`${toTitleCase(profile.username)} Stats`}</Heading>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Address: {profile.address}</PopoverHeader>
            </PopoverContent>
          </Popover>
        }
      </Flex>
      <Table variant='simple' size='md'>
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