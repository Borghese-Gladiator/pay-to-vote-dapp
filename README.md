# Pay2Vote DApp
DApp to pay to win the prize pool. Each voter contributes an amount and the highestVoter takes the pool home.
- Live Demo: [https://pay-to-vote-dapp.vercel.app/](https://pay-to-vote-dapp.vercel.app/)

## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Local Setup Commands](#local-setup-commands)
- [Implementation](#implementation)

## Features
- Users vote by pawning up their ETH and at the end, the user who pawned up the most ETH wins the entire pool.
  - CountdownTimer to end of voting
  - Leaderboard of current top contenders
  - User profile
  - User past transactions

## Technologies
- Hardhat.js - Ethereum development environment
- Ether.js - Library to interact with Ethereum blockchain
- Next.js - React framework with default routing and serverless functions
- Chakra UI - Component library
- Vercel - Platform to host JAMStack apps (frontend with serverless functions)

## Local Setup Commands
- Install dependencies - ```npm install```
- Start up both smart contract local network and frontend display - ```npm run dev```
- Compile smart contracts - ```npx hardhat compile```
- Deploy to local network - ```npx hardhat run scripts/deploy.js --network localhost```

####  Deploy Steps
Since CD (Continuous Deployment) from Vercel is set up with GitHub, every pushed commit will push right to PRD.
1. Compile smart contracts - ```npx hardhat compile```
2. Deploy to Ropsten live network - ```npx hardhat run scripts/deploy.js --network ropsten```

#### Full Setup Guide
- Installed MetaMask Wallet Chrome extension - [https://metamask.io/download/](https://metamask.io/download/)
  - Changed settings to show test networks like localhost
  - Changed network to Ropsten
- Got 1 rETH with Faucet into my MetaMask wallet address (took around 3 minutes - was one of the following sites)
  - [https://faucet.metamask.io/](https://faucet.metamask.io/)
  - [https://faucet.ropsten.be/](https://faucet.ropsten.be/)
  - [https://faucet.dimensions.network/](https://faucet.dimensions.network/)
- Created account with Infura - [https://infura.io/](https://infura.io/)
  - Created Ropsten project using tutorial [https://blog.infura.io/getting-started-with-infura-28e41844cc89/](https://blog.infura.io/getting-started-with-infura-28e41844cc89/)
  - Copied MetaMask Wallet Account 1 address to "CONTRACT ADDRESSES" AllowList
  - Validated project is connected to Mainnet with curl call from WSL (NOTE - curl command did not work on Windows due to doubles quotes issue)
    - Mainnet - ```curl https://mainnet.infura.io/v3/{INFURA_PROJECT_ID} -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params": [],"id":1}'```
    - Ropsten - ```curl https://ropsten.infura.io/v3/{INFURA_PROJECT_ID} -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params": [],"id":1}'```
- Saved private key from Metamask account and Infura project ID into .env file for dotenv
- Started local network and Imported Account into MetaMask Wallet using Account#0 private key - ```npm run hardhat-dev```

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
- Connected frontend to backend
  - Loaded deployed contract addresses from .env.local with getStaticProps
  - Updated index.js to use Greeter contract and display with GreeterDisplay (uses ErrorFallback)
- Deployed GreeterContract
  - Deployed smart contracts to Ropsten
  - Deployed Next.js project to Vercel and configured ENV (add both .env and .env.local variables)
    - ACCOUNT_PRIVATE_KEY, ACCOUNT_PUBLIC_ADDRESS - saved MetaMask Account 1 where I added Ropsten Ether
    - INFURA_PROJECT_ID - created Infura project
    - SIMPLE_AUCTION_DEPLOYED_ADDRESS, GREETER_DEPLOYED_ADDRESS - saved values after running deploy to Ropsten Network command
  - Fixed frontend to load env variables by passing in getStaticProps, storing into Context Provider and loading from Context Consumer in GreeterDisplay
- Wrote smart contract CustomCashGrab.sol using SimpleAuction as reference [https://docs.soliditylang.org/en/v0.8.11/solidity-by-example.html](https://docs.soliditylang.org/en/v0.8.11/solidity-by-example.html)
  - Added to deploy.js
- Wrote src/components/UserSetup components and UserInfoContext to get User Address info globally
- Wrote Hardhat tests
  - Renamed sample-test to test-greeter
  - Wrote test-custom-cash-grab.js
  
#### Bugs
- When you have 0 ETH, check which account you are using and what network you are on. In MetaMask, name your accounts names like Local_Test_Account and Ropsten_Test_Account to clearly see which network you should be on when using them.
- ```Error: call revert exception (method="greet()", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.5.0)```
  - redeploy contract && switch to Test Account in MetaMask (one of the accounts listed when hardhat is starting up locally)
  - check .env has the correct ACCOUNT_PUBLIC_ADDRESS and ACCOUNT_PRIVATE_KEY for the local network
- ```{"code":-32602,"message":"Trying to send a raw transaction with an invalid chainId. The expected chainId is 31337"``` - fix by updating hardhat.config.js (missing ```hardhat: { chainId: 337 }```) [https://hardhat.org/metamask-issue.html](https://hardhat.org/metamask-issue.html)
- ```MetaMask - RPC Error: [ethjs-query] while formatting outputs from RPC '{"value":{"code":-32603,"data":{"code":-32000,"message":"Nonce too high. Expected nonce to be 2 but got 9. Note that transactions can't be queued when automining."}}}'``` - Reset Account (occurred when using same account but switching which app was running)
- ```Warning: Can't perform a React state update on an unmounted component.``` - Occurred after I used dynamic imports. Fix with useAsync hook

#### References
- Basis for initializing project [https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13](https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13)
- Connecting frontend to Smart Contract - [https://gist.github.com/mbvissers/ad96c21706d25194be6f30b076eb25c1](https://gist.github.com/mbvissers/ad96c21706d25194be6f30b076eb25c1) which was from this article [https://medium.com/codex/creating-a-basic-dapp-with-web3-and-nextjs-2ee94af06517](https://medium.com/codex/creating-a-basic-dapp-with-web3-and-nextjs-2ee94af06517)
- Writing smart contracts [https://solidity-by-example.org/structs/](https://solidity-by-example.org/structs/)
- useLocalStorage and useAsync [https://usehooks.com/useAsync/](https://usehooks.com/useAsync/)
- [https://hardhat.org/tutorial/testing-contracts.html](https://hardhat.org/tutorial/testing-contracts.html)

#### Notes
Flow of Application
1. deploy Smart Contract to local
2. validate UI on local in local network using MetaMask
3. deploy Smart Contract to Ropsten Testnet
4. validate UI on Vercel in Ropsten using MetaMask

User simply uses frontend and changes accounts with MetaMask as needed between Mainnet and Testnet

#### Retrospective
- MetaMask + Next.js do not work well together since calls to Ether.js require window.ethereum to be present which is not present on the Server Side, therefore Next.js cannot SSR nor perform static site generation.
- Frontend takes way more time than I expected even with a component library. Also, I should use component libraries I'm more familiar with.
- Challenging to write solidity code - I moved most of my logic into JS utils but in hindsight, if I knew Solidity better, I wouldn't need to
  - For Example, I kept trying to return an array of structs but then realized that it won't work since it's dynamic data.

#### Next Steps
- Remove all instances of SimpleAuction
- Learn Solidity for a proper insertion - improve runtime by not running findHighestVoter each time vote is called
  - learn Mapping vs Array
- Add toggle to display address for table (chakra ui + react-table)

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
