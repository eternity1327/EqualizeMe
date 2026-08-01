const STEP_ROUNDS = 4;
const PARAMS = ['bassGain', 'trebleGain', 'presenceGain'];
const RANGE = { low: -6, high: 6 };

let session = null;

function startSession() {
  session = {
    paramIndex: 0,
    round: 0,
    bounds: { low: RANGE.low, high: RANGE.high },
    finalized: { bassGain: 0, trebleGain: 0, presenceGain: 0 },
    history: [],
  };
  return getCurrentPair();
}

function currentParam() {
  return PARAMS[session.paramIndex];
}

function getCurrentPair() {
  if (!session) return null;
  if (session.paramIndex >= PARAMS.length) return null;

  const { low, high } = session.bounds;
  const param = currentParam();

  return {
    done: false,
    param,
    round: session.round + 1,
    totalRoundsForParam: STEP_ROUNDS,
    paramNumber: session.paramIndex + 1,
    totalParams: PARAMS.length,
    A: { ...session.finalized, [param]: low },
    B: { ...session.finalized, [param]: high },
  };
}

function recordAnswer(preferred) {
  if (!session) return { error: 'No active session. Call startSession first.' };
  if (preferred !== 'A' && preferred !== 'B') return { error: 'preferred must be "A" or "B"' };

  const { low, high } = session.bounds;
  const mid = (low + high) / 2;
  const param = currentParam();

  session.history.push({ param, round: session.round + 1, low, high, preferred });

  if (preferred === 'A') {
    session.bounds.high = mid;
  } else {
    session.bounds.low = mid;
  }

  session.round += 1;

  if (session.round >= STEP_ROUNDS) {
    const finalValue = (session.bounds.low + session.bounds.high) / 2;
    session.finalized[param] = Math.round(finalValue * 10) / 10;
    session.paramIndex += 1;
    session.round = 0;
    session.bounds = { low: RANGE.low, high: RANGE.high };
  }

  if (session.paramIndex >= PARAMS.length) {
    return { done: true, profile: session.finalized, history: session.history };
  }

  return { done: false, next: getCurrentPair() };
}

module.exports = { startSession, getCurrentPair, recordAnswer, PARAMS };