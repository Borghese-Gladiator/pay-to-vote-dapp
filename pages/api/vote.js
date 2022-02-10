/**
 * Sets vote
 */
import { connectToDatabase } from "../../src/mongodb";
import { setVote } from "../../src/contractUtils";

const contractAddress = process.env.CUSTOM_VOTING_DEPLOYED_ADDRESS;
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Process a GET request
    const profile = await db
      .collection("voter_list")
      .findOne({ address: address });
    
    res.status(200).json(profile);
  } else if (req.method === 'POST') {
    // Process a POST request
    const { address, contribution } = req;

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
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Only GET/POST are supported" });
  }
}
