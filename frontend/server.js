const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const BACKEND = process.env.BACKEND || 'http://localhost:4000';
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Proxy /health and /api/* to backend
app.use(['/health', '/api'], async (req, res, next) => {
  try {
    const target = BACKEND + req.originalUrl;
    const headers = { ...req.headers };
    delete headers.host;
    const opts = { method: req.method, headers };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      opts.body = JSON.stringify(req.body);
      opts.headers['content-type'] = req.headers['content-type'] || 'application/json';
    }
    const r = await fetch(target, opts);
    const text = await r.text();
    res.status(r.status);
    r.headers.forEach((value, name) => {
      if (name.toLowerCase() === 'content-length') return;
      res.setHeader(name, value);
    });
    res.send(text);
  } catch (err) {
    next(err);
  }
});

// Serve static build folder
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Frontend static server listening on ${PORT}, proxy -> ${BACKEND}`));
