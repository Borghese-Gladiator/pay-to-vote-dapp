const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("CustomCashGrab", function () {
  const ONE_DAY_SECONDS = 86400;
  let addr1;
  let addr2;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    CustomCashGrab = await ethers.getContractFactory("CustomCashGrab");
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy contract to local network
    contract = await CustomCashGrab.deploy(ONE_DAY_SECONDS);
  });

  describe("Voting", function () {
    it("Should have correct total contributions amount", async function() {
      console.log(`APIConsumer deployed to: ${contract.address}`);
      
      // Validate initial
      expect(await contract.getContributionTotal()).to.equal(0);
      
      // Vote twice
      await contract.vote("James", { from: addr1, value: 500 });
      await contract.vote("Jerry", { from: addr2, value: 500 });
      
      // Validate end amount
      expect(await contract.getContributionTotal()).to.equal(1000);
    });
    it("Should transfer between accounts at end", async function() {

    })
  });
  describe("Timing", function () {
    it("Should end at correct time", async function() { 
    });
  });
});
