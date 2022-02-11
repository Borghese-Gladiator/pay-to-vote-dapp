/**
 * All information contained in functions because window.ethereum must be defined
 */
import { ethers } from 'ethers';
import { getVoterList, getEndTime, getContributionTotal } from "./contractUtils";

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : process.env.VERCEL_URL;

async function fetchGetWrapper(url, params) {
  return await fetch(`${server}/${url}` + new URLSearchParams(params), {
    method: 'GET'
  })
  .then(data => data.json())
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
    return data
  });
}

async function fetchPostWrapper(url, body) {
  return await fetch(`${server}/${url}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(data => data.json())
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
    return data;
  });
}

export async function setNewUsername(address, username) {
  return await fetchPostWrapper("/api/profile", { address: address, username: username })
}

export async function setVote() {
  return await fetchPostWrapper("/api/vote", { address: address, username: username })
}

export async function getProfile() {
  const profile = await fetchGetWrapper("/api/profile");
  console.log(profile);
  return profile;
}

export async function getTransactionList() {
  return await fetchGetWrapper("/api/profile").then((profile) => {
    return profile.transactionList
  })
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