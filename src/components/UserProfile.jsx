import { useState, useEffect, useContext } from 'react';
import ContractAddressesContext from "../context/ContractAddressesContext";
import UserInfoContext from "../context/UserInfoContext";

import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from "./ErrorFallback";

import {
  Box,
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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

import { fetchGetProfile, fetchVote, rankOrdinalSuffix, convertWeiToEther, getRank } from "../utils";

export default function UserProfile() {
  const { customVotingAddress } = useContext(ContractAddressesContext);
  const { userInfo, setUserInfo } = useContext(UserInfoContext);

  // Get and Display Profile
  const [profile, setProfile] = useState(userInfo); // { username, address, rank, contribution }
  const [rank, setRank] = useState(userInfo.rank);
  const [profileLoading, setProfileLoading] = useState(false);
  function resetProfile() {
    setProfileLoading(true);
    const { address } = userInfo;
    fetchGetProfile(address)
      .then(response => {
        setUserInfo(response)
      })
      .finally(() => setProfileLoading(false))
  }
  useEffect(() => {
    // Update profile when user info is updated
    setProfile(userInfo);
  }, [userInfo]);
  
  // run once on initial load
  useEffect(async () => {
    const userRank = await getRank(customVotingAddress, userInfo.address)
    setRank(userRank);
  }, [])

  // Set contribution through voting
  const [contribution, setContribution] = useState();
  const handleChange = (event) => setContribution(event.target.value);
  const [contributionLoading, setContributionLoading] = useState(false);
  const [contributionErr, setContributionErr] = useState();
  async function handleSubmit() {
    setContributionErr(null);
    if (contribution % 1 != 0) {
      setContributionErr("Error: contribution cannot be a decimal!")
    }
    if (profile.contribution >= contribution) {
      setContributionErr("Error: contribution cannot be less than current contribution!")
    }
    setContributionLoading(true);
    const { address, username } = userInfo;
    fetchVote(customVotingAddress, address, username, contribution)
      .then(response => {
        resetProfile(); // reset profile to refresh contribution amount
      })
      .catch(e => {
        setContributionErr(`Transaction Error: ${e.message}`)
        console.log(`Sending failed: ${e.message}`)
      })
      .finally(() => setContributionLoading(false))
    setRank(await getRank(customVotingAddress, userInfo.address));
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
              <Box p={2} _hover={{ bg: "teal.600" }}><Heading as='h4' size='md'>{`${profile.username}`}</Heading></Box>
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
                  : typeof rank === 'number'
                    ? rankOrdinalSuffix(rank)
                    : rank}
              </Text>
            </Td>
          </Tr>
          <Tr>
            <Td><Text fontSize='md'>Current Contribution</Text></Td>
            <Td><Text fontSize='md' noOfLines={1}>{profileLoading ? "Loading" : `${profile.contribution} WEI`}</Text></Td>
          </Tr>
          <Tr>
            <Td><Text fontSize='md' as="span">Enter New Vote (WEI)</Text></Td>
            <Td>
              <Popover trigger="hover">
                <PopoverTrigger>
                  <Input value={contribution} onChange={handleChange} />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>
                    {typeof contribution === 'undefined' || contribution === null
                      ? "Loading"
                      : `${convertWeiToEther(contribution)} ETH`
                    }
                  </PopoverHeader>
                </PopoverContent>
              </Popover>
            </Td>
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
      {typeof contributionErr === 'undefined' || contributionErr === null
        ? <></>
        :
        <Alert status='error'>
          <AlertIcon />{contributionErr}
        </Alert>
      }
    </ErrorBoundary>
  )
}