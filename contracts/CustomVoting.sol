// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract CustomVoting {
    // Contract State
    uint256 public highestVote;
    uint256 public contributionTotal;
    mapping(address => uint) pendingReturns; // Allowed withdrawals of previous bids
    bool ended; // Set to true at the end, disallows any change.
    // Array of Structs - https://medium.com/robhitchens/solidity-crud-part-1-824ffa69509a
    struct Voter {
        bytes32 username;
        uint256 contribution;
        uint256 index;
    }
    mapping(address => Voter) private voterStructList;
    address[] private voterIndex;
    
    // Contract Parameters - Times are either absolute unix timestamps (seconds since 1970-01-01) or time periods in seconds
    uint public votingEndTime;

    // Events for updating state
    event VotingEnded(Voter winner);
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
    event LogUpdateContributionTotal(
        address indexed voterAddress,
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
    // Error for address already present in voter list
    error AddressIsVoter();
    // Error for contribution lower than current highest
    error ContributionNotHighEnough();
    // Error for contribution lower than current contrigbution
    error PreviousContributionWasHigher();

    // Start voting with `votingTime` seconds
    constructor(uint votingTime) {
        votingEndTime = block.timestamp + votingTime;
        highestVote = 0;
    }
    
    // Update Contribution through Vote
    /// Bid on the auction with the value sent together with this transaction.
    /// The value will only be refunded if the auction is not won.
    function vote(address voterAddress, bytes32 _username)
        external 
        payable
        returns (bool success)
    {
        uint256 _contribution = msg.value;
        if (!isVoter(voterAddress)) {
            insertVoter(voterAddress, _username, _contribution);
        }
        if (_contribution < voterStructList[voterAddress].contribution) {
            revert PreviousContributionWasHigher();
        }
        if (_contribution <= highestVote) {
            revert ContributionNotHighEnough();
        }
        if (voterIndex.length != 0) {
            // Sending back the money by simply using
            // voterAddress.send(highestBid) is a security risk
            // because it could execute an untrusted contract.
            // It is always safer to let the recipients
            // withdraw their money themselves.
            pendingReturns[voterAddress] += _contribution;
        }
        voterStructList[voterAddress].contribution = _contribution;
        emit LogUpdateVoter(
            voterAddress,
            voterStructList[voterAddress].index,
            voterStructList[voterAddress].username,
            _contribution
        );
        contributionTotal = sumContributionTotal();
        emit LogUpdateContributionTotal(
            voterAddress,
            _contribution
        );
        return true;
    }
    /// Withdraw a bid that was overbid.
    function withdraw() external returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            // It is important to set this to zero because the recipient
            // can call this function again as part of the receiving call
            // before `send` returns.
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                // No need to call throw here, just reset the amount owing
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
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
    
    // UTIL functions for CustomVoting State
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
    function sumContributionTotal() private view returns (uint256 sum) {
        // voterIndex.length is a dummy value so highestVoter can be compared with other Voter objects
        uint256 result = 0;
        for (uint i = 0; i < voterIndex.length; i++) {
            address voterAddress = getVoterAtIndex(i);
            (
                bytes32 username,
                uint256 contribution,
                uint256 index
            ) = getVoter(voterAddress);
            result += contribution;
        }
        return result;
    }
    function isVoter(address voterAddress)
        public
        view
        returns (bool isIndeed)
    {
        if (voterIndex.length == 0) return false;
        return (voterIndex[voterStructList[voterAddress].index] == voterAddress);
    }
    // SET functions for CustomVoting State
    function insertVoter(
        address voterAddress,
        bytes32 username,
        uint256 contribution
    ) private returns (uint256 index) {
        if (isVoter(voterAddress)) revert AddressIsVoter();
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
    
    // GET functions for CustomVoting State
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
    function getVoterCount() public view returns (uint256 count) {
        return voterIndex.length;
    }
    function getVoterAtIndex(uint256 index) public view returns (address)
    {
        return voterIndex[index];
    }
    function getContributionTotal() public view returns (uint256) {
        return contributionTotal;
    }
    function getVotingEndTime() public view returns (uint) {
        return votingEndTime;
    }
}
