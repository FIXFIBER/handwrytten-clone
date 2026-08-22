const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8899;
const PAGES_DIR = path.join(__dirname, 'pages');
const ASSETS_DIR = path.join(__dirname, 'assets');

// Serve static assets from /wp-content
app.use('/wp-content', express.static(path.join(ASSETS_DIR, 'wp-content')));
app.use('/wp-includes', express.static(path.join(ASSETS_DIR, 'wp-includes')));

// Serve static files inside pages/ (e.g. /samples/assets/*.json)
app.use(express.static(PAGES_DIR));

// Serve pages
app.get('/', (req, res) => {
  res.sendFile(path.join(PAGES_DIR, 'index.html'));
});

// Catch-all for other pages
app.use((req, res) => {
  const urlPath = req.path.replace(/\/$/, '');
  const possiblePaths = [
    path.join(PAGES_DIR, urlPath, 'index.html'),
    path.join(PAGES_DIR, urlPath + '.html'),
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
