// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract NewContract {
    address public owner;

    struct Proposal {
        string name;
        uint voteCount;
    }

    struct Voter {
        bool registered;
        bool voted;
        uint vote;
    }

    mapping(address => Voter) public voters;
    Proposal[] public proposals;

    event ProposalAdded(string name);
    event VoterRegistered(address voter);
    event Voted(address voter, uint proposalIndex);

    constructor() {
        owner = msg.sender;
        console.log("Voting contract deployed by:", owner);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyRegistered() {
        require(voters[msg.sender].registered, "Not registered to vote");
        _;
    }

    function addProposal(string memory name) public onlyOwner {
        proposals.push(Proposal(name, 0));
        emit ProposalAdded(name);
    }

    function registerVoter(address voter) public onlyOwner {
        require(!voters[voter].registered, "Already registered");
        voters[voter] = Voter(true, false, 0);
        emit VoterRegistered(voter);
    }

    function vote(uint proposalIndex) public onlyRegistered {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted");
        require(proposalIndex < proposals.length, "Invalid proposal");

        sender.voted = true;
        sender.vote = proposalIndex;

        proposals[proposalIndex].voteCount += 1;
        emit Voted(msg.sender, proposalIndex);
    }

    function getProposal(uint index) public view returns (string memory name, uint voteCount) {
        require(index < proposals.length, "Invalid index");
        Proposal storage proposal = proposals[index];
        return (proposal.name, proposal.voteCount);
    }

    function getProposalsCount() public view returns (uint) {
        return proposals.length;
    }

    function getWinner() public view returns (string memory winnerName, uint highestVotes) {
        require(proposals.length > 0, "No proposals");

        uint winningVoteCount = 0;
        uint winningIndex = 0;

        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningIndex = i;
            }
        }

        winnerName = proposals[winningIndex].name;
        highestVotes = proposals[winningIndex].voteCount;
    }
}
