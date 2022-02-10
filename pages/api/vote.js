/**
 * VOTING API ENDPOINT
 * sets vote
 */
import { connectToDatabase } from "../../src/mongodb";
import { setVote } from "../../src/contractUtils";

const contractAddress = process.env.CUSTOM_VOTING_DEPLOYED_ADDRESS;
export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase();

  switch (method) {
    case 'GET':
      const profile = await db
        .collection("voter_list")
        .findOne({ address: address });
      res.status(200).json(profile);
      break
    case 'POST':
      const { address, contribution, username } = req;
      const transaction = await setVote(contractAddress, address, username, contribution);
      // from transaction - need error info, need hash for txn
      console.log(transaction);
      if (!transaction) {
        res.status(500).json({ error: "Contract failed to save vote"});
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
          { $set: { highestContribution: contribution } },
          { $push: { transactionList: transactionObject }}
        )
      res.status(200).json({ response: response, message: "Success! New vote saved"});
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
