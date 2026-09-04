export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = 'Clothsync/clothsync-tracker';

  if (req.method === 'POST') {
    const { filename, content, message } = req.body;
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${filename}`, {
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
  
  else if (req.method === 'DELETE') {
    const { path } = req.body;
    try {
      const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
        headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'ClothSync-App' }
      });
      if (!getRes.ok) return res.status(200).json({ success: true });
      const fileData = await getRes.json();
      
      const delRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'ClothSync-App'
        },
        body: JSON.stringify({
          message: 'Delete order photo via Cloth.sync',
          sha: fileData.sha
        })
      });
      const delData = await delRes.json();
      if (!delRes.ok) throw new Error(delData.message || 'GitHub delete failed');
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
