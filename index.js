const express = require('express');
const app = express();
const PORT = 3000;

// Array to store logs
const logs = [];

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log all incoming requests
app.use((req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    query: req.query,
    ip: req.ip
  };

  // Skip logging the root URL to avoid infinite loop
  if (req.url !== '/') {
    logs.push(logEntry);

    console.log('\n=== Incoming Request ===');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query Params:', req.query);
    console.log('========================\n');
  }

  next();
});

// Root endpoint to display all logs
app.get('/', (req, res) => {
  res.json({
    totalLogs: logs.length,
    logs: logs
  });
});

// POST endpoint to receive and log data
app.post('/api/log', (req, res) => {
  console.log('=� Received data at /api/log:');
  console.log(JSON.stringify(req.body, null, 2));

  res.status(200).json({
    success: true,
    message: 'Data logged successfully',
    receivedData: req.body
  });
});

// GET endpoint for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Catch-all route for any other requests
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`\nServer is running on http://localhost:${PORT}`);
  console.log(`View logs at: http://localhost:${PORT}/`);
  console.log(`POST data to: http://localhost:${PORT}/api/log`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test\n`);
});
