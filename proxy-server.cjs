const express = require('express');
// استيراد node-fetch بطريقة صحيحة مع CommonJS:
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();

// إضافة الميدل وير لقراءة JSON من الـ body
app.use(express.json());

app.post('/api/send-data', async (req, res) => {
  try {
    const url = 'https://script.google.com/macros/s/AKfycbw9kAeRQ3RJ41UcBmBQVWjLemsTzwLcQ63RSAME45dPidGd6PFAVFVmC1hjRFBr36xB/exec';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.text(); // قراءة الرد كـ نص خام
    console.log('Response from Apps Script:', data);

    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      res.status(500).json({ error: 'Invalid JSON from Google Apps Script', raw: data });
    }
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
