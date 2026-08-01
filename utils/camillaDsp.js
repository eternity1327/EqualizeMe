/**
 * utils/camillaDsp.js
 *
 * Wraps camilladsp.exe as a subprocess and controls it live over its
 * websocket API. Uses a File capture device (not a live audio input),
 * so it plays a bundled test-sample WAV through whatever filter settings
 * are currently pushed — no virtual audio cable needed.
 *
 * Swap TEST_SAMPLE_PATH below once the real listening-test audio is ready.
 */

const path = require('path');
const { spawn } = require('child_process');
const WebSocket = require('ws');
const yaml = require('js-yaml');

const CAMILLA_EXE = path.join(__dirname, '..', 'camilladsp.exe');
const CAMILLA_WS_PORT = 1234;

// Placeholder sample — replace this file (same name/path) once your
// friend's real listening-test audio is ready, no code changes needed.
const TEST_SAMPLE_PATH = path.join(__dirname, '..', 'data', 'audio', 'test-sample.wav');

let camillaProcess = null;
let camillaSocket = null;
let camillaReady = false;

function buildConfig({ bassGain = 0, trebleGain = 0, presenceGain = 0 }) {
  return {
    devices: {
      samplerate: 48000,
      chunksize: 1024,
      capture: {
        type: 'WavFile',
        filename: TEST_SAMPLE_PATH,
      },
      playback: { type: 'Wasapi', channels: 2, exclusive: false },
    },
    filters: {
      bass_shelf: {
        type: 'Biquad',
        parameters: { type: 'Lowshelf', freq: 100, q: 0.7, gain: bassGain },
      },
      treble_shelf: {
        type: 'Biquad',
        parameters: { type: 'Highshelf', freq: 8000, q: 0.7, gain: trebleGain },
      },
      presence_peak: {
        type: 'Biquad',
        parameters: { type: 'Peaking', freq: 3000, q: 1.4, gain: presenceGain },
      },
    },
    pipeline: [
      { type: 'Filter', channels: [0, 1], names: ['bass_shelf', 'treble_shelf', 'presence_peak'] },
    ],
  };
}

// Named presets for the three listening-test options currently in test.html
const PRESETS = {
  bass:     { bassGain: 6,  trebleGain: -2,  presenceGain: -1 },
  balanced: { bassGain: 0,  trebleGain: 0,   presenceGain: 0  },
  detail:   { bassGain: -2, trebleGain: 2,   presenceGain: 3  },
};

function start() {
  if (camillaProcess) return; // already started
  console.log('Starting CamillaDSP...');
  camillaProcess = spawn(CAMILLA_EXE, ['-p', String(CAMILLA_WS_PORT), '-w'], { stdio: 'inherit' });

  camillaProcess.on('error', (err) => console.error('Failed to start camilladsp.exe:', err.message));
  camillaProcess.on('exit', (code) => {
    console.log(`camilladsp.exe exited with code ${code}`);
    camillaProcess = null;
    camillaReady = false;
  });

  connect();
}

function connect(retries = 10) {
  const ws = new WebSocket(`ws://127.0.0.1:${CAMILLA_WS_PORT}`);

  ws.on('open', () => {
    console.log('Connected to CamillaDSP control socket');
    camillaSocket = ws;
    camillaReady = true;
  });

  ws.on('message', (msg) => console.log('CamillaDSP:', msg.toString()));

  ws.on('close', () => {
    camillaReady = false;
  });

  ws.on('error', () => {
    if (retries > 0) setTimeout(() => connect(retries - 1), 500);
    else console.error('Could not connect to CamillaDSP control socket.');
  });
}

function pushConfig(params) {
  if (!camillaReady || !camillaSocket) return false;
  const configYaml = yaml.dump(buildConfig(params));
  camillaSocket.send(JSON.stringify({ SetConfig: configYaml }));
  return true;
}

// Plays the test sample through one of the named presets (bass/balanced/detail)
function playPreset(name) {
  const params = PRESETS[name];
  if (!params) return { ok: false, error: `Unknown preset: ${name}` };
  const ok = pushConfig(params);
  return { ok, params };
}

// Plays the test sample through arbitrary filter values — used by the
// adaptive A/B test, which generates its own params each round.
function applyFilters(params) {
  const ok = pushConfig(params);
  return { ok, params };
}

function stop() {
  if (camillaProcess) camillaProcess.kill();
}

module.exports = { start, stop, playPreset, applyFilters, PRESETS };
