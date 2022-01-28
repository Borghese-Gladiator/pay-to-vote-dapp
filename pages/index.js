import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from "../src/components/Navbar";
import NoWalletDetected from "../src/components/NoWalletDetected";
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
  { date: new Date('1995-12-17T03:24:00'), username: "User 1", contribution: 10, link: "https://etherscan.io/tx/0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563"},
  { date: new Date('1997-12-17T03:24:00'), username: "User 1", contribution: 10, link: "https://etherscan.io/tx/0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563"},
  { date: new Date('2000-12-17T03:24:00'), username: "User 1", contribution: 10, link: "https://etherscan.io/tx/0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563"},
  { date: new Date(), username: "User 1", contribution: 10, link: "https://etherscan.io/tx/0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563"},
];

export default function Home() {
  // Detect Ethereum Provider is present
  if (typeof window !== "undefined" && typeof window.ethereum === "undefined") {
    return <NoWalletDetected />;
  }
  else {
    return (
      <div>
        <Head>
          <title>Pay2Vote</title>
          <meta name="description" content="DApp for users to pay Test Ether to vote and highest voter takes all" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main style={{ height: "80vh" }}>
          <Navbar />
          <Container h={'100%'} maxW='container.lg'>
            <Grid
              h={'100%'}
              templateRows='repeat(2, 1fr)'
              templateColumns='repeat(2, 1fr)'
              gap={4}
            >
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
        </main>
  
        <footer>
        </footer>
      </div>
    )
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