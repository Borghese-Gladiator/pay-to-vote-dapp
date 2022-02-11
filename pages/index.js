import { useEffect, useState } from "react";
import ContractAddressesContext from "../src/context/ContractAddressesContext";
import UserInfoContext from "../src/context/UserInfoContext";

// Custom Components
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

const players = [
  { name: "User 1", address: "300303", contribution: 100 },
  { name: "User 1", address: "300303", contribution: 13 },
  { name: "User 1", address: "300303", contribution: 10 },
  { name: "User 1", address: "300303", contribution: 100 }
];

const playerObj = {
  username: "Trevor",
  contribution: 50,
  rank: 34
};

const transactions = [
  { date: new Date('1995-12-17T03:24:00'), username: "User 1", contribution: 10, txnHash: "0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
  { date: new Date('1997-12-17T03:24:00'), username: "User 1", contribution: 10, txnHash: "0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
  { date: new Date('1997-12-17T03:24:00'), username: "User 1", contribution: 10, txnHash: "0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
  { date: new Date('1997-12-17T03:24:00'), username: "User 1", contribution: 10, txnHash: "0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
];

export default function Home({ greeterAddress, simpleAuctionAddress, customVotingAddress }) {
  const [loadingSetup, setLoadingSetup] = useState(true);
  const [userInfo, setUserInfo] = useState({});

  function handleAccountsChanged() {
    // Reloads account after account change
    setLoadingSetup(true); 
  }

  useEffect(() => {
    if (!loadingSetup) {
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
            loadingSetup
              ? <UserSetup setLoadingSetup={setLoadingSetup} />
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
                      <LeaderTable players={players} />
                    </GridItem>
                    <GridItem colSpan={3}>
                      <UserProfile playerObj={playerObj} />
                    </GridItem>
                    <GridItem colSpan={5}>
                      <TransactionTable transactions={transactions} />
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

/*
width={[
  '100%', // 0-30em
  '50%', // 30em-48em
  '25%', // 48em-62em
  '15%', // 62em+
]}
<GridItem colSpan={1} bg='papayawhip' />
<GridItem colSpan={2} bg='tomato' />
// const dateString = date.toISOString().slice(0, 10).replace(/-/g, "");
*/