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
      console.log(data); // JSON data parsed by `data.json()` call
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
      console.log(data); // JSON data parsed by `data.json()` call
      return data;
    })
}

export async function fetchPostProfile(address, username) {
  address = address.toLowerCase();
  return await fetchPostWrapper("api/profile", { address: address, username: username });
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
  return await fetchGetWrapper("api/profile", { address: address });
}

export async function fetchTransactionList(address) {
  const { transactionList } = await fetchGetProfile(address);
  return transactionList;
}

export async function getLeaderList(contractAddress) {
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
  return await getEndTime(contractAddress);
}

export async function getTotalPool(contractAddress) {
  return await getContributionTotal(contractAddress);
}

// UTILS
const animationDelay = 2000; // ms
export function timeout() {
  return new Promise(resolve => setTimeout(resolve, animationDelay));
}

// UTILS for Display
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