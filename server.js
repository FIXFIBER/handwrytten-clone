const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;
const PAGES_DIR = path.join(__dirname, 'pages');
const ASSETS_DIR = path.join(__dirname, 'assets');

// Serve static assets
app.use('/assets', express.static(ASSETS_DIR, { maxAge: '1d' }));

// Serve pages
app.get('/', (req, res) => {
  res.sendFile(path.join(PAGES_DIR, 'www.handwrytten.com', 'index.html'));
});

app.get('/integrations/integrate-automate', (req, res) => {
  res.sendFile(path.join(PAGES_DIR, 'www.handwrytten.com', 'integrations', 'integrate-automate', 'index.html'));
});

// Catch-all for other pages
app.use((req, res) => {
  const urlPath = req.path;
  const possiblePaths = [
    path.join(PAGES_DIR, 'www.handwrytten.com', urlPath, 'index.html'),
    path.join(PAGES_DIR, 'www.handwrytten.com', urlPath + '.html'),
    path.join(PAGES_DIR, urlPath, 'index.html'),
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }
  
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
