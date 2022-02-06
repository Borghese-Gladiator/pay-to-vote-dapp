/**
 * All information contained in functions because window.ethereum must be defined
 */
import { ethers } from 'ethers'
import CustomVoting from "./artifacts/contracts/CustomVoting.sol/CustomVoting.json";

async function getVoterList(contractAddress) {
  /**
   * GET utility function to get list of voters
   */
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider);
  const voterList = []
  const count = await contract.getVoterCount();
  for (let idx = 0; idx < count; idx++) {
    const address = await contract.getVoterAtIndex(idx);
    const voter = await contract.getVoter(address);
    voterList.push({
      address: address,
      voter: voter
    });
  }
  return voterList;
};
async function getUserRank(contractAddress, address) {
  /**
   * GET rank of user relative to others by sorting array
   * - sort highest to lowest (b - a)
   * 
   * @param contractAddress
   * @param address
   * @return rank of user
   */
  const voterList = await getVoterList(contractAddress);
  voterList.sort((a, b) => {
    b.voter.contribution.sub(a.voter.contribution)
  })
  return voterList.findIndex(x => x.address.toLowerCase() === address.toLowerCase()) + 1;
}
export async function usernameTaken(contractAddress, username) {
  const voterList = await getVoterList(contractAddress);
  return voterList.filter(({ voter, address }, idx) => {
    return voter.username === username;
  }).length > 0
}
export async function isVoter(contractAddress, address) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider);
  return await contract.isVoter(address)
}
export async function getProfile(contractAddress, address) {
  /**
   * GET profile information in one object
   * - calls calculateRank
   * - converts BigNumber to string and 32 bytes string to string
   * 
   * @param contractAddress
   * @param address for user
   * @return { address, username, contribution, rank }
   */
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider);
  const voter = await contract.getVoter(address);
  const rank = await getUserRank(contractAddress, address);
  return {
    address: address,
    username: ethers.utils.parseBytes32String(voter.username),
    contribution: voter.contribution.toString(),
    rank: rank
  };
}
export async function getVoterTransactions() {
  const voterList = await getVoterList();
  return voterList.map((val, idx) => val.voter.transactions);
}
export async function getTopVoters(contractAddress) {
  /**
   * GET 4 top highest contributors to prize pool 
   */
  const voterList = await getVoterList(contractAddress);
  voterList.sort((a, b) => {
    b.voter.contribution.sub(a.voter.contribution)
  })
  const topVoters = voterList.slice(0, 5).map(({ address, voter }, idx) => {
    return {
      address: address,
      username: ethers.utils.parseBytes32String(voter.username),
      contribution: voter.contribution.toString(),
      rank: idx + 1
    }
  })
  return topVoters;
}
export async function getVotingEndTime(contractAddress) {
  /**
   * GET voting end time - convert BigNumber to object { hours, minutes, seconds}
   * @return object
   */
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider);
  const endBigNumber = await contract.votingEndTime();
  const nowBigNumber = ethers.BigNumber.from(Math.floor(Date.now() / 1000));
  const diffBigNumber = endBigNumber.sub(nowBigNumber);
  let diffInt = parseInt(diffBigNumber.toString(), 10);
  return {
    hours: Math.floor(diffInt / 60),
    minutes: Math.floor(diffInt / (60 * 60)),
    seconds: Math.floor(diffInt / (60 * 60 * 60)),
  }
}
export async function getContributionTotal(contractAddress) {
  /**
   * GET total contribution - convert BigNumber result to string
   * @return string
   */
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider);
  const total = await contract.getContributionTotal();
  return total.toString()
}

export async function vote(contractAddress, address, username, contribution) {
  /**
   * SET update contribution
   * @param contractAddress
   * @param address for user
   * @param username for user
   * @param contribution amount of vote
   * @return true for success
   */
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, signer);
  const transaction = await contract.vote(address, ethers.utils.formatBytes32String(username), ethers.BigNumber.from(contribution));
  console.log(transaction);
  return transaction
}

// UTILS
export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}
export function rankOrdinalSuffix(i) {
  // https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
  const j = i % 10, k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}
export function convertDateToStr(date) {
  const options = { day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString("en-US", options);
}