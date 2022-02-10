/**
 * All information contained in functions because window.ethereum must be defined
 */
import { ethers } from 'ethers';
import { getVoterList, getEndTime, getContributionTotal } from "./contractUtils";

const dev = process.env.NODE_ENV !== 'production';
const server = dev ? 'http://localhost:3000' : process.env.VERCEL_URL;

function fetchGetWrapper(url, params) {
  return fetch(`${server}/${url}` + new URLSearchParams(params), {
    method: 'GET'
  })
  .then(data => data.json())
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
    return data
  });
}

function fetchPostWrapper(url, body) {
  return fetch(`${server}/${url}`, {
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

export function setNewUsername(address, username) {
  return fetchPostWrapper("profile", { address: address, username: username })
}

export function setVote() {
  return fetchPostWrapper("vote", { address: address, username: username })
}

export function getProfile() {
  return fetchGetWrapper("profile")
}

export function getTransactionList() {
  return fetchGetWrapper("profile").then((profile) => {
    return profile.transactionList
  })
}

export function getLeaderList(contractAddress) {
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

export function getVotingEndTime(contractAddress) {
  return await getEndTime();
}

export function getContributionTotal(contractAddress) {
  return await getContributionTotal();
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