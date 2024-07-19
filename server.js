import express from 'express';
// import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(bodyParser.json());

// Route
app.post('/api/games', (req, res) => {
  const requestBody = req.body;
  console.log('Request body:', requestBody);

  // Handle the request and send a response
  res.json({ message: 'Request received', data: requestBody });
});

// Start server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
