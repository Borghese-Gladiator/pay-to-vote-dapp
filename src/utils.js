import { ethers } from 'ethers'
import CustomCashGrabAddress from "./artifacts/contracts/CustomCashGrab.sol/CustomCashGrab.json";

export async function getLeaders(address) {
  // @return First, Second, Third, Fourth palces
  console.log(`ADDRESS: ${address}`);
  const voterList = await getVoterList(address);
  return voterList.slice(0, 5)
}

async function getVoterList(contractAddress) {
  // @precondition window.ethereum is defined
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(contractAddress, CustomCashGrabAddress.abi, provider)
  try {
    const n = await contract.getVoterCount();
    console.log(`Voter Count: ${n}`);
    const voterList = [];
    for (let i = 0; i < n; i++) {
      voterList.push(await contract.getVoter(i));
    }
    console.log(`Voter List: ${voterList.toString()}`);
    return voterList
  } catch (err) {
    console.log("Error: ", err)
  }
}