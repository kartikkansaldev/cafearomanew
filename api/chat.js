export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // The user will add this in Vercel Environment Variables as GROQ_API_KEY
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not set in Vercel Environment Variables.' });
  }

  const { interest } = req.body;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { 
            role: 'system', 
            content: 'You are a friendly barista at Café Aroma in Chandigarh. You give short, punchy coffee recommendations based on user interests. Limit your response to 2-3 sentences.' 
          },
          { 
            role: 'user', 
            content: interest 
          }
        ]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Error from Groq API', fullError: data });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch recommendation from Groq.' });
  }
}
