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
          res.status(404).json({ message: `User for this address was not found: ${address}`});
        }
        res.status(200).json(profile);  
      } catch(e) {
        res.status(500).json(e);  
      }
      break;
    }
    case 'POST': {
      const { address, username } = req.body;
      // Upsert (update if present, insert if not) MongoDB default operation
      const response = await db
        .collection("voter_list")
        .updateOne(
          { address: address },
          { $set: { username: username } },
          { upsert: true }
        );
      res.status(200).json({ response: response, message: "Success! Username created"});
      break
    }
    default: {
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}
