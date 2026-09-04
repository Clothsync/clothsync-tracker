export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { filename, content, message } = req.body;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'Clothsync/clothsync-tracker'; // દાખલા તરીકે: username/clothsync

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/contents/uploads/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'ClothSync-App'
      },
      body: JSON.stringify({ message, content })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'GitHub upload failed');
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
