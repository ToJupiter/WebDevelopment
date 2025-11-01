const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const prisma = require('./db');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get('/health', (_req, res) => res.json({ status: 'ok', database: 'MySQL + Prisma' }));

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const user = await prisma.users.create({
      data: { email, password_hash: password, full_name }
    });
    
    res.status(201).json({ message: 'User registered successfully', user_id: user.user_id });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }
    
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.cookie('token', user.user_id, { httpOnly: true });
    res.json({ message: 'Login successful', user_id: user.user_id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('token');
  res.status(204).send();
});

// ==================== USERS ROUTES ====================

app.get('/api/users/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.cookies.token;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/users/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.cookies.token;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const updated = await prisma.users.update({
      where: { user_id: userId },
      data: req.body
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== ROADMAPS ROUTES ====================

app.get('/api/roadmaps', async (req, res) => {
  try {
    const status = req.query.status || 'published';
    const roadmaps = await prisma.roadmaps.findMany({
      where: { status },
      include: { Modules: true }
    });
    res.json({ roadmaps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/roadmaps/:roadmapId', async (req, res) => {
  try {
    const roadmap = await prisma.roadmaps.findUnique({
      where: { roadmap_id: req.params.roadmapId },
      include: { Modules: true }
    });
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/roadmaps', async (req, res) => {
  try {
    const roadmap = await prisma.roadmaps.create({ data: req.body });
    res.status(201).json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== MODULES ROUTES ====================

app.post('/api/modules', async (req, res) => {
  try {
    const module = await prisma.modules.create({ data: req.body });
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/modules/:moduleId', async (req, res) => {
  try {
    const module = await prisma.modules.update({
      where: { module_id: req.params.moduleId },
      data: req.body
    });
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/modules/:moduleId', async (req, res) => {
  try {
    await prisma.modules.delete({ where: { module_id: req.params.moduleId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== PROGRESS ROUTES ====================

app.get('/api/progress/overview', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.cookies.token;
    const overview = await prisma.userProgress.groupBy({
      by: ['status'],
      where: { user_id: userId },
      _count: { progress_id: true }
    });
    res.json({ overview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/progress/modules/:moduleId/update', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.cookies.token;
    const progress = await prisma.userProgress.upsert({
      where: { user_id_module_id: { user_id: userId, module_id: req.params.moduleId } },
      update: { status: req.body.status },
      create: { user_id: userId, module_id: req.params.moduleId, status: req.body.status }
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== CALENDAR ROUTES ====================

app.get('/api/calendar/events', async (req, res) => {
  try {
    const events = await prisma.learningEvents.findMany();
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/calendar/events', async (req, res) => {
  try {
    const event = await prisma.learningEvents.create({ data: req.body });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== NOTES ROUTES ====================

app.get('/api/modules/:moduleId/notes', async (req, res) => {
  try {
    const notes = await prisma.aiNotes.findMany({
      where: { module_id: req.params.moduleId }
    });
    res.json({ notes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/modules/:moduleId/ask', async (req, res) => {
  try {
    res.json({ answer: `Answer for: ${req.body.question}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== INTERVIEWS ROUTES ====================

app.get('/api/interviews', async (req, res) => {
  try {
    const sessions = await prisma.interviewSessions.findMany();
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/interviews/start', async (req, res) => {
  try {
    const session = await prisma.interviewSessions.create({
      data: { title: 'Interview Session', questions: '[]' }
    });
    res.json({ sessionId: session.session_id, firstQuestion: 'Giới thiệu về bản thân?' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== CVS ROUTES ====================

app.get('/api/cvs', async (req, res) => {
  try {
    const cvs = await prisma.CVs.findMany();
    res.json({ cvs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== CERTIFICATES ROUTES ====================

app.get('/api/certificates', async (req, res) => {
  try {
    const certificates = await prisma.certificates.findMany();
    res.json({ certificates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/certificates', async (req, res) => {
  try {
    const certificate = await prisma.certificates.create({ data: req.body });
    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== EXERCISES ROUTES ====================

app.get('/api/exercises', async (req, res) => {
  try {
    const exercises = await prisma.exercises.findMany();
    res.json({ exercises });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend listening on port ${PORT}`);
  console.log(`📊 Connected to: ${process.env.DATABASE_URL}`);
});
