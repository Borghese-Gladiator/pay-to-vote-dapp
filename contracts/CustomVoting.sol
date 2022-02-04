// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract CustomVoting {
    struct Voter {
        bytes32 username;
        uint256 contribution;
        uint256 index;
    }

    mapping(address => Voter) private voterStructList;
    address[] private voterIndex;

    event LogNewVoter(
        address indexed voterAddress,
        uint256 index,
        bytes32 username,
        uint256 contribution
    );
    event LogUpdateVoter(
        address indexed voterAddress,
        uint256 index,
        bytes32 username,
        uint256 contribution
    );

    function isVoter(address voterAddress)
        public
        view
        returns (bool isIndeed)
    {
        if (voterIndex.length == 0) return false;
        return (voterIndex[voterStructList[voterAddress].index] == voterAddress);
    }

    function insertVoter(
        address voterAddress,
        bytes32 username,
        uint256 contribution
    ) public returns (uint256 index) {
        if (isVoter(voterAddress)) revert();
        voterStructList[voterAddress].username = username;
        voterStructList[voterAddress].contribution = contribution;
        voterIndex.push(voterAddress);
        voterStructList[voterAddress].index = voterIndex.length - 1;
        emit LogNewVoter(
            voterAddress,
            voterStructList[voterAddress].index,
            username,
            contribution
        );
        return voterIndex.length - 1;
    }

    function getVoter(address voterAddress)
        public
        view
        returns (
            bytes32 username,
            uint256 contribution,
            uint256 index
        )
    {
        if (!isVoter(voterAddress)) revert();
        return (
            voterStructList[voterAddress].username,
            voterStructList[voterAddress].contribution,
            voterStructList[voterAddress].index
        );
    }

    function updateVotername(address voterAddress, bytes32 username)
        public
        returns (bool success)
    {
        if (!isVoter(voterAddress)) revert();
        voterStructList[voterAddress].username = username;
        emit LogUpdateVoter(
            voterAddress,
            voterStructList[voterAddress].index,
            username,
            voterStructList[voterAddress].contribution
        );
        return true;
    }

    function updateContribution(address voterAddress, uint256 contribution)
        public
        returns (bool success)
    {
        if (!isVoter(voterAddress)) revert();
        voterStructList[voterAddress].contribution = contribution;
        emit LogUpdateVoter(
            voterAddress,
            voterStructList[voterAddress].index,
            voterStructList[voterAddress].username,
            contribution
        );
        return true;
    }

    function getVoterCount() public view returns (uint256 count) {
        return voterIndex.length;
    }

    function getVoterAtIndex(uint256 index) public view returns (address voterAddress)
    {
        return voterIndex[index];
    }
}
