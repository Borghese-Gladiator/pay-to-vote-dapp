/**
 * All information contained in functions because window.ethereum must be defined.
 * Therefore, this utils controls when to make calls to backend and when to make calls to Smart Contract
 */
import { ethers } from 'ethers';
import { setVote, getVoterList, getUserRank, getEndTime, getContributionTotal } from "./contractUtils";

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000/' : ""; // process.env.VERCEL_URL

async function fetchGetWrapper(url, params) {
  return await fetch(`${server}${url}?` + new URLSearchParams(params), {
    method: 'GET'
  })
    .then(response => {
      if (!response.ok) {
        // make the promise be rejected if we didn't get a 2xx response
        const err = new Error("Not 2xx response");
        err.response = response;
        throw err;
      }
      return response
    })
    .then(data => data.json())
    .then(data => {
      return data
    })
}

async function fetchPostWrapper(url, body) {
  return await fetch(`${server}${url}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => {
      if (!response.ok) {
        // make the promise be rejected if we didn't get a 2xx response
        const err = new Error("Not 2xx response");
        err.response = response;
        throw err;
      }
      return response
    })
    .then(data => data.json())
    .then(data => {
      return data;
    })
}

export async function fetchPostProfile(address, username) {
  address = address.toLowerCase();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let uniqueSignature = await signer.signMessage(username);
  
  return await fetchPostWrapper("api/profile", { uniqueSignature, address, username });
}

export async function fetchVote(contractAddress, address, username, contribution) {
  address = address.toLowerCase();
  const transactionObj = await setVote(contractAddress, address, username, contribution);
  const rank = await getUserRank(contractAddress, address);
  const response = await fetchPostWrapper("api/vote", { address, contribution, transactionObj, rank });
  return true;
}

export async function fetchGetProfile(address) {
  address = address.toLowerCase();
  
  const profile = await fetchGetWrapper("api/profile", { address }); // throw 404 here

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let uniqueSignature = await signer.signMessage(profile.username);
  if (profile.uniqueSignature !== uniqueSignature) {
    throw new Error({username: profile.username, msg: "Incorrect signature"})
  }
  return profile;
}

export async function fetchTransactionList(address) {
  const { transactionList } = await fetchGetProfile(address);
  return transactionList;
}

export async function getLeaderList(contractAddress) {
  const voterList = await getVoterList(contractAddress);
  voterList.sort((a, b) => {
    // sort highest to lowest (normally b - a, but fixed for BigNumber object subtraction)
    a.voter.contribution.sub(b.voter.contribution)
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
  const endBigNumber = await getEndTime(contractAddress);
  const nowBigNumber = ethers.BigNumber.from(Math.floor(Date.now() / 1000));
  const diffBigNumber = endBigNumber.sub(nowBigNumber);
  let diffInt = parseInt(diffBigNumber.toString(), 10);
  return {
    hours: Math.floor(diffInt / 60),
    minutes: Math.floor(diffInt / (60 * 60)),
    seconds: Math.floor(diffInt / (60 * 60 * 60)),
  }
}

export async function getTotalPool(contractAddress) {
  const totalBigNumber = await getContributionTotal(contractAddress);
  return totalBigNumber.toString();
}

// UTILS
const animationDelay = 2000; // ms
export function timeout() {
  return new Promise(resolve => setTimeout(resolve, animationDelay));
}

// UTILS for Display
export function convertWeiToEther(wei) {
  /**
   * 
   * @param {BigNumber} wei
   * @return {string}
   */
  console.log(wei);
  console.log(typeof wei);
  if (typeof wei === "number") {
    console.log("wei is number");
    wei = ethers.BigNumber.from(wei);
    return (+ethers.utils.formatEther(wei)).toFixed(18);
  } else if (typeof wei === "string" && isNumericStr(wei)) {
    // https://stackoverflow.com/questions/10575624/java-string-see-if-a-string-contains-only-numbers-and-not-letters
    console.log("wei is string");
    wei = ethers.BigNumber.from(wei);
    return (+ethers.utils.formatEther(wei)).toFixed(18);
  } else {
    return `Cannot convert WEI value: ${wei}`
  }
}
function isNumericStr(str) {
  // https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
  return /^-?\d+$/.test(str);
}
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
export const aboutText = "Money Auction DApp. Every voter contributes an amount to play and the voter with the highest contribution takes the whole pool home at the end of the auction! Smart contract deployed to Ropsten Testnet"