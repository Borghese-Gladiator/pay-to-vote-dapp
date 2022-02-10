/**
 * PROFILE API ENDPOINT
 * Gets profile
 * Sets profile
 */
import { connectToDatabase } from "../../src/mongodb";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Process a GET request
    const profile = await db
      .collection("voter_list")
      .findOne({ address: address });
    
    res.status(200).json(profile);
  } else if (req.method === 'POST') {
    // Process a POST request
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
  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: "Only GET/POST are supported" });
  }
}
