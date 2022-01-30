// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;
contract CustomCashGrab {
    struct Voter {
        address voterAddress;
        string name;
        uint contribution;
    }
    // Current state of the bidding.
    Voter[] public voterList;
    uint public contributionTotal;
    bool ended; // Set to true at the end, disallows any change. By default initialized to `false`.
    
    // Allowed withdrawals of previous bids
    mapping(address => uint) pendingReturns;

    // Parameters for CustomVoting. Times are either absolute unix timestamps (seconds since 1970-01-01) or time periods in seconds.
    uint public votingEndTime;
    
    // Events that will be emitted on changes.
    event HighestBidIncreased(Voter highestVoter);
    event VotingEnded(Voter winner);
    
    /// The auction has already ended.
    error VotingAlreadyEnded();
    /// There is already a higher or equal bid.
    error BidNotHighEnough(uint highestBid);
    /// The auction has not ended yet.
    error VotingNotYetEnded();
    /// The voting has already ended.
    error VotingEndAlreadyCalled();
    
    constructor(uint votingTime) {
        votingEndTime = block.timestamp + votingTime;
    }
    
    /// Vote with value sent together in this transaction.
    /// The value will only be refunded if the auction is not won.
    function vote(string memory _name) external payable {
        // No arguments are necessary, all
        // information is already part of
        // the transaction. The keyword payable
        // is required for the function to
        // be able to receive Ether.

        // Revert the call if the period is over.
        if (block.timestamp > votingEndTime)
            revert VotingAlreadyEnded();

        uint idx = voterList.length;
        Voter memory voter;
        voter.name = _name;
        voter.voterAddress = msg.sender; // msg.sender is always the address where the current (external) function call came from
        voter.contribution = msg.value;
        voterList.push(voter);
        
        Voter memory highestVoter = findHighestVoter();
        emit HighestBidIncreased(highestVoter);
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
    /// End the voting and send pool to winner.
    function votingEnd() external {
        // It is a good guideline to structure functions that interact
        // with other contracts (i.e. they call functions or send Ether)
        // into three phases:
        // 1. checking conditions
        // 2. performing actions (potentially changing conditions)
        // 3. interacting with other contracts
        // If these phases are mixed up, the other contract could call
        // back into the current contract and modify the state or cause
        // effects (ether payout) to be performed multiple times.
        // If functions called internally include interaction with external
        // contracts, they also have to be considered interaction with
        // external contracts.

        // 1. Conditions
        if (block.timestamp < votingEndTime)
            revert VotingNotYetEnded();
        if (ended)
            revert VotingEndAlreadyCalled();

        // 2. Effects
        ended = true;
        Voter memory highestVoter = findHighestVoter();
        emit VotingEnded(highestVoter);
        
        // 3. Interaction
        address payable wallet = payable(highestVoter.voterAddress);
        wallet.transfer(contributionTotal);
    }
    function findHighestVoter() private view returns (Voter) {
        uint highestContribution = 0;
        Voter memory highestVoter;
        for (uint i = 0; i < voterList.length; i++) {
            if (highestContribution < voterList[i].contribution) {
                highestVoter = voterList[i];
                highestContribution = voterList[i].contribution;
            }
        }
        return highestVoter;
    }
    function getVoterList() public view returns (uint[] memory) {
        return voterList;
    }
    function getContributionTotal() public view returns (uint) {
        return contributionTotal;
    }
}