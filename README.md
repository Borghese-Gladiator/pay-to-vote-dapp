# Pay2Vote DApp
DApp to track users paying to win. Displays leaderboard, current profile, and past transactions.

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Local Setup Commands](#local-setup-commands)
- [Implementation](#implementation)

## Features

## Local Setup Commands
- Install dependencies - ```npm install```
- Start up both smart contract local network and frontend display - ```npm run dev```
- Compile smart contracts - ```npx hardhat compile```
- Deploy to local network - ```npx hardhat run scripts/deploy.js --network localhost```
- Deploy to Ropsten live network - ```npx hardhat run scripts/deploy.js --network ropsten```

#### Full Setup Guide

## Technologies
- Hardhat.js - Ethereum development environment
- Ether.js - Library to interact with Ethereum blockchain
- Next.js - React framework with default routing and serverless functions
- Chakra UI - Component library
- Vercel - Platform to host JAMStack apps (frontend with serverless functions)

## Implementation

#### Steps
- npx create-react-app pay-to-vote-dapp
- Created frontend
  - Installed Chakra UI - ```npm i @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^5```
  - Removed existing styles
  - Added ChakraProvider to _app for Next.js to load styles
  - Added src/theme.js and _document.js to show Chakra UI dark mode
  - Added icons - ```npm install react-icons @chakra-ui/icons```
  - Wrote up index.js layout and components (Navbar, LeaderTable, UserTxnTable, UserProfile)
- Created backend
  - Installed hardhat - ```npm install ethers hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers```
  - Ran hardhat setup - ```npx hardhat```
  - Added contracts - Greeter, SimpleAuction
    - SimpleAuction - [https://docs.soliditylang.org/en/v0.8.11/solidity-by-example.html](https://docs.soliditylang.org/en/v0.8.11/solidity-by-example.html)
  - Add dotenv
  - Add .env to .gitignore
  - Configure hardhat.config.js - ```npm i dotenv```
  - Update hardhat.config.js to have networks and path to artifacts
  - Rewrite sample-script to deploy.js script for both contracts
- Simplified setup by writing commands into package.json and installed concurrently to start both at same time - ```npm i -D concurrently```

#### References
- Connecting frontend to Smart Contract
  - [https://gist.github.com/mbvissers/ad96c21706d25194be6f30b076eb25c1](https://gist.github.com/mbvissers/ad96c21706d25194be6f30b076eb25c1) which was from this article [https://medium.com/codex/creating-a-basic-dapp-with-web3-and-nextjs-2ee94af06517](https://medium.com/codex/creating-a-basic-dapp-with-web3-and-nextjs-2ee94af06517)
  - [https://github.com/nomiclabs/hardhat-hackathon-boilerplate/blob/master/frontend/src/components/Dapp.js](https://github.com/nomiclabs/hardhat-hackathon-boilerplate/blob/master/frontend/src/components/Dapp.js)

## Hardhat README
This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

## Next.js README
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
