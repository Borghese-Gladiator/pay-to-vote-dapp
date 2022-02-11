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
import { rankOrdinalSuffix, getProfile, vote } from "../utils";

export default function UserProfile() {
  const { customVotingAddress } = useContext(ContractAddressesContext);
  // Get and Display Profile
  const [profile, setProfile] = useState();
  const [profileLoading, setProfileLoading] = useState(true);
  function resetProfile() {
    setProfileLoading(true);
    getProfile(customVotingAddress, userInfo.address)
      .then(response =>
        setProfile(response) // { username, address, rank, contribution }
      )
      .catch(e => {
        console.log(`Getting profile failed: ${e.message}`)
        setProfile({
          ...profile,
          contribution: 0,
          rank: "User has not voted"
        })
      })
      .finally(() => setProfileLoading(false))
  }
  // Call once on initial load
  useEffect(() => {
    resetProfile()
  }, [])

  // Set contribution through voting
  const [contribution, setContribution] = useState('');
  const handleChange = (event) => setContribution(event.target.value);
  const [contributionLoading, setContributionLoading] = useState(false);
  async function handleSubmit() {
    setContributionLoading(true);
    // check contribution is a whole number
    if (contribution % 1 != 0) {
      vote(customVotingAddress, userInfo.address, userInfo.username, contribution)
        .then(response => {
          resetProfile(); // reset profile to refresh contribution amount
        })
        .catch(e => console.log(`Sending failed: ${e.message}`))
        .finally(() => setContributionLoading(false))
    }
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
              <Heading as='h4' size='md'>{`${profile.username}`}</Heading>
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
            <Td>
              <Text fontSize='md' noOfLines={1}>
                {profileLoading
                  ? "Loading"
                  : typeof profile.rank === 'number'
                    ? rankOrdinalSuffix(profile.rank)
                    : profile.rank}
              </Text>
            </Td>
          </Tr>
          <Tr>
            <Td><Text fontSize='md'>Current Contribution</Text></Td>
            <Td><Text fontSize='md' noOfLines={1}>{profileLoading ? "Loading" : `${profile.contribution} ETH`}</Text></Td>
          </Tr>
          <Tr>
            <Td><Text fontSize='md' noOfLines={1}>Enter New Amount (Wei)</Text></Td>
            <Td><Input value={contribution} onChange={handleChange} /></Td>
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