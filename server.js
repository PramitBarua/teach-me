#!/usr/bin/env node
/* Local server for the exam and practice question banks.

   Serves this workspace over http://127.0.0.1 and accepts PUT requests that
   write each question set's progress file
   (exam-question-bank/data/part-N.json or
   practice-question-bank/data/part-N.json). The JSON files are the source of
   truth for answers, display order and comments — a browser page opened via
   file:// cannot write to disk, so the pages must be opened through here.

   Usage:  npm start            (default port 8000)
           PORT=9000 npm start */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
// Each bank keeps its own progress files, so the two never share state.
const DATA_PATH = /^\/(exam-question-bank|practice-question-bank)\/data\/(part-\d+)\.json$/;
const MAX_BODY = 5 * 1024 * 1024;
const PORT = parseInt(process.env.PORT, 10) || 8000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function sendError(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
}

function serveStatic(req, res, urlPath) {
  let filePath = path.join(ROOT, urlPath);
  // Refuse anything that resolves outside the workspace (e.g. /../../etc).
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    return sendError(res, 403, 'Forbidden');
  }
  fs.stat(filePath, function (err, stat) {
    if (!err && stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    fs.readFile(filePath, function (readErr, body) {
      if (readErr) return sendError(res, 404, 'Not found');
      const headers = { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' };
      // Progress files change constantly; never let the browser serve a stale copy.
      if (DATA_PATH.test(urlPath)) headers['Cache-Control'] = 'no-store';
      res.writeHead(200, headers);
      res.end(req.method === 'HEAD' ? undefined : body);
    });
  });
}

function saveData(req, res, bank, name) {
  const chunks = [];
  let size = 0;
  let aborted = false;
  req.on('data', function (chunk) {
    size += chunk.length;
    if (size > MAX_BODY) {
      aborted = true;
      sendError(res, 413, 'Body too large');
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on('end', function () {
    if (aborted) return;
    let data;
    try {
      data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch (e) {
      return sendError(res, 400, 'Body is not valid JSON');
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return sendError(res, 400, 'Body must be a JSON object');
    }

    try {
      const dataDir = path.join(ROOT, bank, 'data');
      fs.mkdirSync(dataDir, { recursive: true });
      const target = path.join(dataDir, name + '.json');
      const tmp = target + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n');
      fs.renameSync(tmp, target); // atomic: a crash never leaves a half-written file
    } catch (e) {
      return sendError(res, 500, 'Write failed: ' + e.message);
    }
    res.writeHead(204);
    res.end();
  });
}

const server = http.createServer(function (req, res) {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (e) {
    return sendError(res, 400, 'Bad URL');
  }

  if (req.method === 'PUT') {
    const match = DATA_PATH.exec(urlPath);
    if (!match) return sendError(res, 404, 'Only exam-question-bank/ and practice-question-bank/ data/part-N.json files are writable');
    return saveData(req, res, match[1], match[2]);
  }
  if (req.method === 'GET' || req.method === 'HEAD') {
    return serveStatic(req, res, urlPath);
  }
  sendError(res, 405, 'Method not allowed');
});

server.listen(PORT, '127.0.0.1', function () {
  console.log('Serving ' + ROOT);
  console.log('Open http://127.0.0.1:' + PORT + '/exam-question-bank/part-1.html');
  console.log('  or http://127.0.0.1:' + PORT + '/practice-question-bank/part-1.html');
});
