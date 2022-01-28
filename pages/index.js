// Load smart contracts
import { ethers } from 'ethers'
import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json'
import SimpleAuction from '../src/artifacts/contracts/SimpleAuction.sol/SimpleAuction.json'
// Frontend
import { useEffect, useState } from 'react';
import RootLayout from "../src/components/_layouts/RootLayout";
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
  { date: new Date('1995-12-17T03:24:00'), username: "User 1", contribution: 10, link: "https://etherscan.io/tx/0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
  { date: new Date('1997-12-17T03:24:00'), username: "User 1", contribution: 10, link: "https://etherscan.io/tx/0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
  { date: new Date('2000-12-17T03:24:00'), username: "User 1", contribution: 10, link: "https://etherscan.io/tx/0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
  { date: new Date(), username: "User 1", contribution: 10, link: "https://etherscan.io/tx/0x88f6d02ef407d84a6a558d69a302c21c73d32b8c0ff5811aef253e3f25824563" },
];

export default function Home({ greeterAddress, simpleAuctionAddress }) {
  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  // call the smart contract, send an update
  async function updateGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  // Detect Ethereum Provider is present, render MetaMask not detected
  if (typeof window !== "undefined" && typeof window.ethereum === "undefined") {
    return (
      <RootLayout>
        <NoWalletDetected />
      </RootLayout>
    )
  }

  // Everything is loaded, render application
  return (
    <RootLayout>
      <Container h={'100%'} maxW='container.lg'>
        <Grid
          h={'100%'}
          templateRows='repeat(3, 1fr)'
          templateColumns='repeat(2, 1fr)'
          gap={2}
        >
          <GridItem colSpan={2}>
            <button onClick={fetchGreeting}>Fetch Greeting</button>
            <button onClick={updateGreeting}>Set Greeting</button>
            <input onChange={e => setGreeting(e.target.value)} placeholder="Set greeting" />
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
    </RootLayout>
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