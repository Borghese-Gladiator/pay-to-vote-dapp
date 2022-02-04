// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract CustomVoting {
    struct Voter {
        bytes32 username;
        uint256 contribution;
        uint256 index;
    }
    
    // Voting State
    mapping(address => Voter) private voterStructList; // struct list
    address[] private voterIndex; // struct list index
    uint public contributionTotal;
    bool ended;

    // Parameters for CustomVoting - Times are either absolute unix timestamps (seconds since 1970-01-01) or time periods in seconds
    uint public votingEndTime;

    // Events for voting
    event VotingEnded(Voter winner);
    // Events for struct list
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

    // Error for voting not yet ended
    error VotingNotYetEnded();
    // Error for ended already set to True
    error VotingEndAlreadyCalled();
    // Error for voting has already ended
    error VotingAlreadyEnded();
    // Error for address not present in voter list
    error AddressNotVoter();
    // Error for contribution lower than current contribution
    error ContributionNotHighEnough();

    // Start voting with `votingTime` seconds
    constructor(uint votingTime) {
        votingEndTime = block.timestamp + votingTime;
    }
    
    // End Voting and payout to winner
    function votingEnd() external {
        // Conditions
        if (block.timestamp < votingEndTime)
            revert VotingNotYetEnded();
        if (ended)
            revert VotingEndAlreadyCalled();
        
        // Effects
        ended = true;
        (address highestVoterAddress, Voter memory highestVoter) = findHighestVoter();
        emit VotingEnded(highestVoter);

        // Payout Interaction
        address payable wallet = payable(highestVoterAddress);
        wallet.transfer(contributionTotal);
    }
    // Utility to find highest voter for end voting
    function findHighestVoter() private view returns (address _voterAddress, Voter memory) {
        // voterIndex.length is a dummy value so highestVoter can be compared with other Voter objects
        Voter memory highestVoter = Voter("Temp_User", 0, voterIndex.length);
        address highestVoterAddress;
        for (uint i = 0; i < voterIndex.length; i++) {
            address voterAddress = getVoterAtIndex(i);
            (
                bytes32 username,
                uint256 contribution,
                uint256 index
            ) = getVoter(voterAddress);
            if (highestVoter.contribution <= contribution) {
                highestVoterAddress = voterAddress;
                highestVoter = Voter(username, contribution, index);
            }
        }
        return (highestVoterAddress, highestVoter);
    }
    // Vote function
    function updateContribution(address voterAddress, uint256 _contribution)
        public
        returns (bool success)
    {
        if (!isVoter(voterAddress)) revert AddressNotVoter();
        if (_contribution <= voterStructList[voterAddress].contribution || _contribution == 0) {
            revert ContributionNotHighEnough();
        }
        voterStructList[voterAddress].contribution = _contribution;
        emit LogUpdateVoter(
            voterAddress,
            voterStructList[voterAddress].index,
            voterStructList[voterAddress].username,
            _contribution
        );
        return true;
    }
    // CRUD functions for struct list
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
        if (isVoter(voterAddress)) revert AddressNotVoter();
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
        if (!isVoter(voterAddress)) revert AddressNotVoter();
        return (
            voterStructList[voterAddress].username,
            voterStructList[voterAddress].contribution,
            voterStructList[voterAddress].index
        );
    }
    function updateUsername(address voterAddress, bytes32 username)
        public
        returns (bool success)
    {
        if (!isVoter(voterAddress)) revert AddressNotVoter();
        voterStructList[voterAddress].username = username;
        emit LogUpdateVoter(
            voterAddress,
            voterStructList[voterAddress].index,
            username,
            voterStructList[voterAddress].contribution
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
