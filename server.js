import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/games', async (req, res) => {
  const clientId = 'dp1e98hq1zfms5n5v4rgsahe715k4w';
  const accessToken = '3qurli4zy3mksd1c10u4er4i5j4za7';
  const url = 'https://api.igdb.com/v4/games';

  try {
    console.log('Request body:', req.body); 
    const response = await axios.post(url, req.body, {
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    console.log('Response data:', response.data);  
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from IGDB:', error);  // Log the error
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
