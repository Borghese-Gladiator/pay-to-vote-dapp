import Head from 'next/head';
import Navbar from "../src/components/Navbar";
import LeaderTable from "../src/components/LeaderTable";
import UserProfile from "../src/components/UserProfile";
import UserTxnTable from "../src/components/UserTxnTable";
import {
  Container,
  Grid,
  GridItem
} from '@chakra-ui/react'

const players = [
  { name: "User 1", address: "300303", contribution: 100 },
  { name: "User 1", address: "300303", contribution: 100 },
  { name: "User 1", address: "300303", contribution: 100 },
  { name: "User 1", address: "300303", contribution: 100 }
]

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
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
            <GridItem colSpan={1}><LeaderTable players={players} /></GridItem>
            <GridItem colSpan={1} bg='papayawhip'><UserTxnTable /></GridItem>
            <GridItem colSpan={2} bg='tomato' />
          </Grid>
        </Container>
      </main>

      <footer>
      </footer>
    </div>
  )
}
/*
width={[
  '100%', // 0-30em
  '50%', // 30em-48em
  '25%', // 48em-62em
  '15%', // 62em+
]}
*/