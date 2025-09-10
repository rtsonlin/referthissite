import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { event, data } = req.body;
    // Your analytics tracking code here
    // Update Google Sheets with analytics data
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking event' });
  }
}
