import { ethers } from "hardhat";
import { expect } from "chai";

describe("Voting Contract", function () {
  let votingContract: any;
  let voter1: any;
  let voter2: any;

  beforeEach(async () => {
    [owner, voter1, voter2] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("YourContract");
    votingContract = await Contract.deploy();
    await votingContract.deployed();
  });

  it("should allow owner to add proposals", async () => {
    await votingContract.addProposal("Alice");
    const [name, votes] = await votingContract.getProposal(0);
    expect(name).to.equal("Alice");
    expect(votes).to.equal(0);
  });

  it("should register voters and allow them to vote", async () => {
    await votingContract.addProposal("Bob");
    await votingContract.registerVoter(voter1.address);
    await votingContract.connect(voter1).vote(0);
    const [, voteCount] = await votingContract.getProposal(0);
    expect(voteCount).to.equal(1);
  });

  it("should return the correct winner", async () => {
    await votingContract.addProposal("Bob");
    await votingContract.addProposal("Alice");

    await votingContract.registerVoter(voter1.address);
    await votingContract.registerVoter(voter2.address);

    await votingContract.connect(voter1).vote(0);
    await votingContract.connect(voter2).vote(0);

    const winner = await votingContract.getWinner();
    expect(winner[0]).to.equal("Bob");
    expect(winner[1]).to.equal(2);
  });
});
