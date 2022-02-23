/**
 * PROFILE API ENDPOINT
 * Gets profile
 * Sets profile
 */
import { connectToDatabase } from "../../src/mongodb";

export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase();

  switch (method) {
    case 'GET': {
      const { address } = req.query;
      try {
        const profile = await db
          .collection("voter_list")
          .findOne({ address });
        if (typeof profile === 'undefined' || profile === null ) {
          return res.status(404).json({ message: `User for this address was not found: ${address}`});
        }
        return res.status(200).json(profile);  
      } catch(e) {
        return res.status(500).json(e);  
      }
    }
    case 'POST': {
      const { address, username, uniqueSignature } = req.body;
      // Upsert (update if present, insert if not) MongoDB default operation
      const response = await db
        .collection("voter_list")
        .updateOne(
          { address: address },
          { $set: { uniqueSignature: uniqueSignature, username: username, contribution: 0, rank: "User has not voted", transactionList: [] } },
          { upsert: true }
        );
      return res.status(200).json({ response: response, message: "Success! Username created"});
    }
    default: {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
