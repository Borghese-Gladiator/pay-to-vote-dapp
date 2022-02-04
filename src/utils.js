import { ethers } from 'ethers'
import CustomVoting from "./artifacts/contracts/CustomVoting.sol/CustomVoting.json";

export async function getUserTransactions(contractAddress) {
  return []
}

export async function getUserProfile(contractAddress) {
  // @precondition window.ethereum is defined
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider)
  try {
    return await contract.getUserProfile();
  } catch(err) {
    console.log("Error: ", err);
  }
}

export async function getUserContribution(contractAddress) {
  // @precondition window.ethereum is defined
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider)
  try {
    return await contract.getContribution();
  } catch(err) {
    console.log("Error: ", err);
  }
}

export async function getVotingEndTime() {
  // @precondition window.ethereum is defined
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider)
  try {
    return await contract.getVotingEndTime();
  } catch(err) {
    console.log("Error: ", err);
  }
  
}

export async function submitUserContribution(contractAddress, contribution) {
  // @precondition window.ethereum is defined
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider)
  try {
    const newValue = await contract.setContribution(contribution);
    return newValue;
  } catch(err) {
    console.log("Error: ", err);
  }
}

export async function getTotalContribution(contractAddress) {
  // @precondition window.ethereum is defined
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider)
  try {
    return await contract.getTotalContribution();
  } catch(err) {
    console.log("Error: ", err);
  }
}

export async function getVoterList(contractAddress) {
  // @precondition window.ethereum is defined
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(contractAddress, CustomVoting.abi, provider)
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

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
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

export const textOneLineStyle = { whiteSpace: "nowrap" }

export function convertDateToStr(date) {
  const options = { day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString("en-US", options);
}
