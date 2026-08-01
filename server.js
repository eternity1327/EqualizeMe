require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');

const profileRouter = require('./routes/profile');
const recommendationsRouter = require('./routes/recommendations');
const settingsRouter = require('./routes/settings');
const testRouter = require('./routes/test');
const dspRouter = require('./routes/dsp');
const authRouter = require('./routes/auth');
const dsp = require('./utils/camillaDsp');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 days
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/test', testRouter);
app.use('/api/dsp', dspRouter);

app.listen(PORT, () => {
  console.log(`EqualizeME server listening on http://localhost:${PORT}`);
});

// Start CamillaDSP once the server is up
dsp.start();

// Clean shutdown
process.on('SIGINT', () => {
  dsp.stop();
  process.exit();
});
