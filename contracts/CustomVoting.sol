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

    event LogNewUser(
        address indexed userAddress,
        uint256 index,
        bytes32 username,
        uint256 contribution
    );
    event LogUpdateUser(
        address indexed userAddress,
        uint256 index,
        bytes32 username,
        uint256 contribution
    );

    function isVoter(address userAddress)
        public
        view
        returns (bool isIndeed)
    {
        if (voterIndex.length == 0) return false;
        return (voterIndex[voterStructList[userAddress].index] == userAddress);
    }

    function insertUser(
        address userAddress,
        bytes32 username,
        uint256 contribution
    ) public returns (uint256 index) {
        if (isVoter(userAddress)) revert();
        voterStructList[userAddress].username = username;
        voterStructList[userAddress].contribution = contribution;
        voterIndex.push(userAddress);
        voterStructList[userAddress].index = voterIndex.length - 1;
        emit LogNewUser(
            userAddress,
            voterStructList[userAddress].index,
            username,
            contribution
        );
        return voterIndex.length - 1;
    }

    function getVoter(address userAddress)
        public
        view
        returns (
            bytes32 username,
            uint256 contribution,
            uint256 index
        )
    {
        if (!isVoter(userAddress)) revert();
        return (
            voterStructList[userAddress].username,
            voterStructList[userAddress].contribution,
            voterStructList[userAddress].index
        );
    }

    function updateUsername(address userAddress, bytes32 username)
        public
        returns (bool success)
    {
        if (!isVoter(userAddress)) revert();
        voterStructList[userAddress].username = username;
        emit LogUpdateUser(
            userAddress,
            voterStructList[userAddress].index,
            username,
            voterStructList[userAddress].contribution
        );
        return true;
    }

    function updateContribution(address userAddress, uint256 contribution)
        public
        returns (bool success)
    {
        if (!isVoter(userAddress)) revert();
        voterStructList[userAddress].contribution = contribution;
        emit LogUpdateUser(
            userAddress,
            voterStructList[userAddress].index,
            voterStructList[userAddress].username,
            contribution
        );
        return true;
    }

    function getUserCount() public view returns (uint256 count) {
        return voterIndex.length;
    }

    function getUserAtIndex(uint256 index) public view returns (address userAddress)
    {
        return voterIndex[index];
    }
}
