"use client";

import { useEffect, useState } from "react";
import { AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function Home() {
  const [proposalName, setProposalName] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [voteIndex, setVoteIndex] = useState<number | null>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [winner, setWinner] = useState<string>("");

  const { data: proposalsCount } = useScaffoldReadContract({
    contractName: "NewContract",
    functionName: "getProposalsCount",
  });

  const { writeContractAsync: addProposal } = useScaffoldWriteContract("NewContract");

  const { writeContractAsync: registerVoter } = useScaffoldWriteContract("NewContract");

  const { writeContractAsync: vote } = useScaffoldWriteContract("NewContract");

  const { data: winnerData, refetch: refetchWinner } = useScaffoldReadContract({
    contractName: "NewContract",
    functionName: "getWinner",
  });

  useEffect(() => {
    const fetchProposals = async () => {
      if (proposalsCount) {
        const all = [];
        for (let i = 0; i < Number(proposalsCount); i++) {
          const res = await fetch(`/api/readProposal?index=${i}`);
          const data = await res.json();
          all.push({ name: data.name, votes: data.voteCount });
        }
        setProposals(all);
      }
    };
    fetchProposals();
  }, [proposalsCount]);

  useEffect(() => {
    if (winnerData) setWinner(winnerData[0]);
  }, [winnerData]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Voting DApp</h1>

      <div className="space-y-4">
        <input
          className="border p-2"
          placeholder="Proposal name"
          value={proposalName}
          onChange={e => setProposalName(e.target.value)}
        />
        <button className="btn" onClick={() => addProposal({ functionName: "addProposal", args: [proposalName] })}>
          Add Proposal
        </button>

        <AddressInput value={voterAddress} onChange={setVoterAddress} />
        <button className="btn" onClick={() => registerVoter({ functionName: "registerVoter", args: [voterAddress] })}>
          Register Voter
        </button>

        <input
          className="border p-2"
          type="number"
          placeholder="Proposal index"
          onChange={e => setVoteIndex(Number(e.target.value))}
        />
        <button
          className="btn"
          onClick={() => voteIndex !== null && vote({ functionName: "vote", args: [BigInt(voteIndex)] })}
        >
          Vote
        </button>

        <div className="mt-6">
          <h2 className="text-xl font-semibold">Proposals</h2>
          <ul>
            {proposals.map((p, i) => (
              <li key={i}>
                #{i} — {p.name} ({p.votes} votes)
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <button className="btn" onClick={() => refetchWinner()}>
            Get Winner
          </button>
          {winner && <p className="mt-2">Winner: {winner}</p>}
        </div>
      </div>
    </div>
  );
}
