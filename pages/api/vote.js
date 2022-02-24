/**
 * VOTING API ENDPOINT
 * sets vote
 */
import { connectToDatabase } from "../../src/mongodb";

const contractAddress = process.env.CUSTOM_VOTING_DEPLOYED_ADDRESS;
export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase();

  switch (method) {
    case 'POST': {
      const { uniqueSignature, address, contribution, rank, transactionObj } = req.body;
      const profile = await db
        .collection("voter_list")
        .findOne({ address: address });
      if (uniqueSignature !== profile.uniqueSignature) {
        return res.status(400).json({ message: `Unique signature does not match expected for address: ${address}!`})
      }
      const { hash } = transactionObj;
      const response = await db
        .collection("voter_list")
        .updateOne(
          { address: address },
          {
            $set: { contribution, rank },
            $push: {
              transactionList: {
                date: new Date().toISOString(),
                txnHash: hash,
                contribution
              }
            }
          }
        )
      return res.status(200).json({ response: response, message: "Success! New vote saved" });
    }
    default: {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
