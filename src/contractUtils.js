/**
 * Utilities to interact with Smart Contract
 * 
 * Address of contract is loaded from .env.local, passed through getStaticProps, to current utils
 */
import { ethers } from 'ethers'
import CustomVoting from "./artifacts/contracts/CustomVoting.sol/CustomVoting.json";

export async function isVoter(contractAddress, address) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider);
  return await contract.isVoter(address)
}
export async function getEndTime(contractAddress) {
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

export async function setVote(contractAddress, address, username, contribution) {
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
