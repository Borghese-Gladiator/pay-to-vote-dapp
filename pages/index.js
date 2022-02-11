import { useEffect, useState } from "react";
import UserInfoContext from "../src/context/UserInfoContext";
import ContractAddressesContext from "../src/context/ContractAddressesContext";

import RootLayout from "../src/components/_layouts/RootLayout";
import UserSetup from "../src/components/UserSetup";
import VotingCountdown from "../src/components/VotingCountdown";
import LeaderTable from "../src/components/LeaderTable";
import UserProfile from "../src/components/UserProfile";
import TransactionTable from "../src/components/TransactionTable";
import {
  Container,
  Grid,
  GridItem
} from '@chakra-ui/react';

export default function Home({ greeterAddress, simpleAuctionAddress, customVotingAddress }) {
  const [userInfo, setUserInfo] = useState({});
  const [setupComplete, setSetupComplete] = useState(false);
  function handleAccountsChanged() {
    // Reloads account after account change
    setSetupComplete(false);
  }
  useEffect(() => {
    if (setupComplete) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
  }, [])

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      <ContractAddressesContext.Provider value={{ greeterAddress, simpleAuctionAddress, customVotingAddress }}>
        <RootLayout>
          {
            // Go through checks for user to setup MetaMask, connect account, and write username
            // Otherwise, everything is loaded and render application
            !setupComplete
              ? (
                <UserSetup setSetupComplete={setSetupComplete} />
              )
              : (
                <Container h={'100%'} maxW='container.lg'>
                  <Grid
                    h={'100%'}
                    templateRows='repeat(4, 1fr)'
                    templateColumns='repeat(5, 1fr)'
                    gap={8}
                  >
                    <GridItem colSpan={1} />
                    <GridItem colSpan={3}>
                      <VotingCountdown />
                    </GridItem>
                    <GridItem colSpan={1} />
                    <GridItem colSpan={2}>
                      <LeaderTable />
                    </GridItem>
                    <GridItem colSpan={3}>
                      <UserProfile />
                    </GridItem>
                    <GridItem colSpan={5}>
                      <TransactionTable />
                    </GridItem>
                  </Grid>
                </Container>
              )
          }
        </RootLayout>
      </ContractAddressesContext.Provider>
    </UserInfoContext.Provider>
  )
}

export async function getStaticProps() {
  return {
    props: {
      greeterAddress: process.env.GREETER_DEPLOYED_ADDRESS,
      simpleAuctionAddress: process.env.SIMPLE_AUCTION_DEPLOYED_ADDRESS,
      customVotingAddress: process.env.CUSTOM_VOTING_DEPLOYED_ADDRESS
    }
  }
}