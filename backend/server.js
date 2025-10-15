const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 5050;

// Simple CORS configuration that works
app.use(cors()); // Allow all origins for development

app.use(express.json());

// Set up multer for image upload
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024,
  }
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// POST /detect - receives image, runs MediaPipe, returns gesture
app.post('/detect', upload.single('image'), async (req, res) => {
  console.log('Received detection request');
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imagePath = req.file.path;
    console.log('Processing image:', imagePath);

    // Call Python script
    exec(`python3 controllMediapipe_detect.py "${imagePath}"`, (error, stdout, stderr) => {
      // Clean up uploaded image
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (unlinkErr) {
        console.log('Error deleting file:', unlinkErr);
      }

      if (error) {
        console.error('Python script error:', error);
        return res.status(500).json({ 
          error: 'Detection failed', 
          details: stderr || error.message
        });
      }
      
      console.log('Python output:', stdout);
      
      let gesture = stdout.trim().split('\n').pop() || 'unknown';
      const validGestures = ['rock', 'paper', 'scissors', 'unknown'];
      
      if (!validGestures.includes(gesture)) {
        gesture = 'unknown';
      }
      
      console.log('Detected gesture:', gesture);
      res.json({ 
        gesture, 
        success: true,
        timestamp: new Date().toISOString()
      });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'RPS AI Backend is running',
    endpoints: ['GET /health', 'POST /detect']
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Backend server running on http://0.0.0.0:${port}`);
  console.log(`🌐 Accessible via http://localhost:${port} or http://192.168.1.6:${port}`);
  console.log(`🔍 Health check: http://192.168.1.6:${port}/health`);
});