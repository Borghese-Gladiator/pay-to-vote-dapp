import { useState, useEffect, useContext } from 'react';
import ContractAddressesContext from "../context/ContractAddressesContext";
import UserInfoContext from "../context/UserInfoContext";

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

import { fetchGetProfile, fetchVote, rankOrdinalSuffix } from "../utils";

export default function UserProfile() {
  const { customVotingAddress } = useContext(ContractAddressesContext);
  const { userInfo, setUserInfo } = useContext(UserInfoContext);

  // Get and Display Profile
  const [profile, setProfile] = useState(userInfo); // { username, address, rank, contribution }
  const [profileLoading, setProfileLoading] = useState(false);
  function resetProfile() {
    setProfileLoading(true);
    const { address } = userInfo;
    fetchGetProfile(address)
      .then(response =>
        setProfile(response)
      )
      .catch(e => {
        console.log(`Getting profile failed: ${e.message}`);
      })
      .finally(() => setProfileLoading(false))
  }

  // Set contribution through voting
  const [contribution, setContribution] = useState('');
  const handleChange = (event) => setContribution(event.target.value);
  const [contributionLoading, setContributionLoading] = useState(false);
  async function handleSubmit() {
    setContributionLoading(true);
    // check contribution is a whole number
    if (contribution % 1 != 0) {
      const { address, username } = userInfo;
      fetchVote(customVotingAddress, address, username, contribution)
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
            <Td><Text fontSize='md' as="span">Enter New Vote (Wei)</Text></Td>
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