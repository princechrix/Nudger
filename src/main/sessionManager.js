const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const crypto = require('crypto');

const STORAGE_PATH = path.join(app.getPath('userData'), 'sessions.json');

function readSessions() {
  try {
    const data = fs.readFileSync(STORAGE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeSessions(sessions) {
  const dir = path.dirname(STORAGE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(sessions, null, 2), 'utf-8');
}

function getAllSessions() {
  return readSessions();
}

function getSession(id) {
  const sessions = readSessions();
  return sessions.find((s) => s.id === id) || null;
}

function createSession({ name, interval, nudgeDuration, message }) {
  const sessions = readSessions();
  const session = {
    id: crypto.randomUUID(),
    name: name.trim(),
    interval: Math.max(1, Number(interval)),
    nudgeDuration: Math.max(3, Number(nudgeDuration) || 5),
    message: message.trim(),
    createdAt: Date.now(),
  };
  sessions.push(session);
  writeSessions(sessions);
  return session;
}

function updateSession(id, updates) {
  const sessions = readSessions();
  const idx = sessions.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  if (updates.name !== undefined) sessions[idx].name = updates.name.trim();
  if (updates.interval !== undefined) sessions[idx].interval = Math.max(1, Number(updates.interval));
  if (updates.nudgeDuration !== undefined) sessions[idx].nudgeDuration = Math.max(3, Number(updates.nudgeDuration) || 5);
  if (updates.message !== undefined) sessions[idx].message = updates.message.trim();

  writeSessions(sessions);
  return sessions[idx];
}

function deleteSession(id) {
  const sessions = readSessions();
  const filtered = sessions.filter((s) => s.id !== id);
  if (filtered.length === sessions.length) return false;
  writeSessions(filtered);
  return true;
}

module.exports = {
  getAllSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
};
