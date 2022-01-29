import { useState } from "react";
import ContractContext from "../src/context/ContractContext";
import UserInfoContext from "../src/context/UserInfoContext";

// Custom Components
import RootLayout from "../src/components/_layouts/RootLayout";
import UserSetup from "../src/components/UserSetup";
import GreeterDisplay from "../src/components/GreeterDisplay";
import LeaderTable from "../src/components/LeaderTable";
import UserProfile from "../src/components/UserProfile";
import UserTxnTable from "../src/components/UserTxnTable";
import {
  Container,
  Grid,
  GridItem
} from '@chakra-ui/react';

const players = [
  { name: "User 1", address: "300303", contribution: 100 },
  { name: "User 1", address: "300303", contribution: 100 },
  { name: "User 1", address: "300303", contribution: 100 },
  { name: "User 1", address: "300303", contribution: 100 }
];

const playerObj = {
  username: "Trevor",
  highest: 50,
  rank: 34
};

const transactions = [
  { date: new Date('1995-12-17T03:24:00'), username: "User 1", contribution: 10, txnHash: "0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
  { date: new Date('1997-12-17T03:24:00'), username: "User 1", contribution: 10, txnHash: "0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
  { date: new Date('1997-12-17T03:24:00'), username: "User 1", contribution: 10, txnHash: "0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
  { date: new Date('1997-12-17T03:24:00'), username: "User 1", contribution: 10, txnHash: "0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
];

export default function Home({ greeterAddress, simpleAuctionAddress }) {
  const [loadingSetup, setLoadingSetup] = useState(true);
  const [userInfo, setUserInfo] = useState({});

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      <ContractContext.Provider value={{ greeterAddress, simpleAuctionAddress }}>
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
                    templateRows='repeat(3, 1fr)'
                    templateColumns='repeat(2, 1fr)'
                    gap={2}
                  >
                    <GridItem colSpan={2}>
                      <GreeterDisplay />
                    </GridItem>
                    <GridItem colSpan={1}>
                      <LeaderTable players={players} />
                    </GridItem>
                    <GridItem colSpan={1}>
                      <UserProfile playerObj={playerObj} />
                    </GridItem>
                    <GridItem colSpan={2}>
                      <UserTxnTable transactions={transactions} />
                    </GridItem>
                  </Grid>
                </Container>
              )
          }
        </RootLayout>
      </ContractContext.Provider>
    </UserInfoContext.Provider>
  )
}

export async function getStaticProps() {
  return {
    props: {
      greeterAddress: process.env.GREETER_DEPLOYED_ADDRESS,
      simpleAuctionAddress: process.env.SIMPLE_AUCTION_DEPLOYED_ADDRESS
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