import {
  VStack,
  Text
} from '@chakra-ui/react';

export default function UserProfile({ playerObj }) {
  const {  username, highest, rank } = playerObj;
  return (
    <VStack>
      <Text fontSize='4xl'>Hi {username}</Text>
      <Text fontSize='xl'>Current Rank: <Text fontSize='2xl' as='span'>{rank}</Text></Text>
      <Text fontSize='xl'>Current Highest: <Text fontSize='2xl' as='span'>${highest}</Text></Text>
    </VStack>
  )
}