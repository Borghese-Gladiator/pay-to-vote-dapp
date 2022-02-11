/**
 * VOTING API ENDPOINT
 * sets vote
 */
import { connectToDatabase } from "../../src/mongodb";
import { setVote, getUserRank } from "../../src/contractUtils";

const contractAddress = process.env.CUSTOM_VOTING_DEPLOYED_ADDRESS;
export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase();

  switch (method) {
    case 'GET':
      const { address } = req.query;
      const profile = await db
        .collection("voter_list")
        .findOne({ address: address });
      return res.status(200).json(profile);
    case 'POST':
      const { address, contribution, username } = req.body;
      const transaction = await setVote(contractAddress, address, username, contribution);
      // from transaction - need error info, need hash for txn
      console.log(transaction);
      if (!transaction) {
        return res.status(500).json({ error: "Contract failed to save vote"});
      }
      const transactionObject = {
        date: new Date().toISOString(),
        txnHash: transaction,
        contribution
      }
      const response = await db
        .collection("series_list")
        .updateOne(
          { address: address },
          { $set: { highestContribution: contribution, rank: await getUserRank(contractAddress, address) } },
          { $push: { transactionList: transactionObject }}
        )
      return res.status(200).json({ response: response, message: "Success! New vote saved"});
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
