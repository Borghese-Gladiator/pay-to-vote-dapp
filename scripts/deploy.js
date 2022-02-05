require('dotenv').config()
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const ONE_DAY_IN_SECONDS = 86400;
const dateUINT = 1345619256308 // Value of Date: Wed Aug 22 16:37:36 CST 2012

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const SimpleAuction = await hre.ethers.getContractFactory("SimpleAuction");
  const CustomVoting = await hre.ethers.getContractFactory("CustomVoting");
  
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  const simpleAuction = await SimpleAuction.deploy(dateUINT, process.env.ACCOUNT_PUBLIC_ADDRESS);
  const customVoting = await CustomVoting.deploy(ONE_DAY_IN_SECONDS); // voting ends one day from now
  
  await greeter.deployed();
  await simpleAuction.deployed();
  await customVoting.deployed();

  console.log("Greeter deployed to:", greeter.address);
  console.log("Simple Auction deployed to:", simpleAuction.address);
  console.log("Custom Voting deployed to:", customVoting.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
