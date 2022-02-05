const { expect } = require("chai");
const { ethers } = require("hardhat");

/*
THINGS TO TEST
- test initial pool value from owner is 1 ETH
- test user A can vote
  - validate total
  - validate user A total
- test user A votes once and then twice
  - validate total
  - validate user A total
- test user A votes then user B votes
  - validate total pool
  - validate user A total
  - validate user B total
- test user A votes & user B votes and user A votes again
  - validate total pool
  - validate user A total
  - validate user B total
*/

describe("CustomVoting", function () {
  const ONE_DAY_SECONDS = 86400;
  const userAVote = 3;
  const userBVote = 10;
  const userALowVote = 1;
  const userAHighVote = 20;

  // `beforeEach` will run before each test, re-deploying the contract every time
  beforeEach(async function () {
    initialTotal = 0;
    minContribution = 0;
    // Get the ContractFactory and Signers here.
    CustomVoting = await ethers.getContractFactory("CustomVoting");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract to local network
    contract = await CustomVoting.deploy(ONE_DAY_SECONDS);

    // UTILITIES
    getVoterList = async () => {
      const voterList = []
      const count = await contract.getVoterCount();
      for (let idx=0; idx < count; idx++) {
        const address = await contract.getVoterAtIndex(idx);
        const voter = await contract.getVoter(address);
        voterList.push(voter);
      }
      return voterList;
    };
    findHighestVoter = (voterList) => {
      // Contribution is a BigNumber and requires Big Number greater than or equal comparison
      return voterList.reduce((prev, current) => 
        prev.contribution.gte(current.contribution) ? prev : current
      )
    }; 
  });
  describe("Create Voters", function() {
    it("Should Create Voter", async function() {
      const usernameA = ethers.utils.formatBytes32String("Jack");
      const usernameB = ethers.utils.formatBytes32String("Jill");
      await contract.insertVoter(addr1.address, usernameA, minContribution);
      await contract.insertVoter(addr2.address, usernameB, minContribution);
      const voterA = await contract.getVoter(addr1.address);
      const voterB = await contract.getVoter(addr2.address);
      expect(voterA.contribution).to.equal(ethers.BigNumber.from(minContribution));
      expect(voterB.contribution).to.equal(ethers.BigNumber.from(minContribution));
    });
  })
  describe("Voting", function () {
    beforeEach(async function () {
      // Create Voters
      const usernameA = ethers.utils.formatBytes32String("Jack");
      const usernameB = ethers.utils.formatBytes32String("Jill");
      await contract.insertVoter(addr1.address, usernameA, minContribution);
      await contract.insertVoter(addr2.address, usernameB, minContribution);
    })
    it("Should start with 0 ETH", async function () {
      expect(await contract.getContributionTotal()).to.equal(initialTotal);
    })
    it("Should let A vote once", async function () {
      expect(await contract.getContributionTotal()).to.equal(initialTotal);
      await contract.vote(addr1.address, userAVote);
      const highestVoter = findHighestVoter(await getVoterList());
      expect(highestVoter.contribution).to.equal(userAVote);
      expect(await contract.getContributionTotal()).to.equal(initialTotal + userAVote);
    });
    it("Should prevent second vote being lower than first", async function () {
      expect(await contract.getContributionTotal()).to.equal(initialTotal);
      try {
        await contract.vote(addr1.address, userAVote);
        await contract.vote(addr1.address, userALowVote);
      } catch (e) {
        expect(e.message).to.equal("VM Exception while processing transaction: reverted with custom error 'PreviousContributionWasHigher()'");
      }
    });
    it("Should use highest vote of A who votes twice", async function () {
      expect(await contract.getContributionTotal()).to.equal(initialTotal);
      await contract.vote(addr1.address, userAVote);
      await contract.vote(addr1.address, userAHighVote);
      const highestVoter = findHighestVoter(await getVoterList());
      expect(highestVoter.contribution).to.equal(userAHighVote);
      expect(await contract.getContributionTotal()).to.equal(initialTotal + userAHighVote);
    });
    it("Should let A vote then B vote and keep highest", async function () {
      expect(await contract.getContributionTotal()).to.equal(initialTotal);
      await contract.vote(addr1.address, userAVote);
      await contract.vote(addr2.address, userBVote);
      const highestVoter = findHighestVoter(await getVoterList());
      expect(highestVoter.contribution).to.equal(userBVote);
      expect(await contract.getContributionTotal()).to.equal(initialTotal + userAVote + userBVote);
    });
    it("Should let A vote then B Vote then A vote again to win", async function () {
      expect(await contract.getContributionTotal()).to.equal(initialTotal);
      await contract.vote(addr1.address, userAVote);
      await contract.vote(addr2.address, userBVote);
      await contract.vote(addr1.address, userAHighVote);
      const highestVoter = findHighestVoter(await getVoterList());
      expect(highestVoter.contribution).to.equal(userAHighVote);
      expect(await contract.getContributionTotal()).to.equal(initialTotal + userBVote + userAHighVote);
    });
  })
  describe("End of Auction", function () {
    it("Should end at correct time", async function () {
    });
    it("Should pay money out to people who were outbid", async function() {

    });
  });
});

/*
- way to vote - implement submit btn => submit vote btn
  - update contribution amount of your user
  - submit money on the spot to a payable account
- way to set display username
  - query list of voters for MetaMask public address
    - if present, show username stats (username & contribution)
    - else, username setup process
      - prompt for username
      - save username & MetaMask public address as new user with contribution 0
  - if MetaMask account changes, query list of voters for address again
- current contribution amount - user has certain amount contributed
  - see above flow
- list of current winners - track list of users with
  - query list of voters again. Get List and then sort it by contribution. Show top 4
- A list of the my own past contribution transactions (linking to the Etherscan transactions).
  - not sure, Etherscan? => would get all transactionsn of address, not just the ones for my app
  - track every vote of a user and save it to a list
- link = > DONE

Retrospective - I didn't account for the MetaMask account setup. Would love for your thoughts regardless. You could send payment through Venmo here.
*/