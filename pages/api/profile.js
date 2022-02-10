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
    case 'GET':
      const profile = await db
        .collection("voter_list")
        .findOne({ address: address });
      res.status(200).json(profile);
      break
    case 'POST':
      const { address, username } = req;
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
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
