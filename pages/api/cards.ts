import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Your Google Sheets integration code here
    const cards = []; // Fetch from Google Sheets
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cards' });
  }
}
