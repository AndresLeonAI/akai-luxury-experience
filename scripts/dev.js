import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const isWin = process.platform === 'win32';
const cmdExe = process.env.ComSpec || 'cmd.exe';

function spawnNpm({ name, cwd, npmArgs }) {
  const spawnCmd = isWin ? cmdExe : 'npm';
  const spawnArgs = isWin ? ['/d', '/s', '/c', 'npm', ...npmArgs] : npmArgs;

  const child = spawn(spawnCmd, spawnArgs, {
    cwd,
    stdio: 'inherit',
    windowsHide: false,
    detached: !isWin,
  });

  child.on('error', (err) => {
    console.error(`[dev] failed to start ${name}:`, err);
    shutdown({ reason: `${name} failed to start`, code: 1 });
  });

  return child;
}

const children = new Map();
let shuttingDown = false;
let shutdownCode = 0;
let shutdownReason = 'unknown';
let forceExitTimer;

function allExited() {
  for (const child of children.values()) {
    if (child.exitCode === null) return false;
  }
  return true;
}

function shutdown({ reason, code = 0 }) {
  if (shuttingDown) return;
  shuttingDown = true;
  shutdownCode = code;
  shutdownReason = reason;

  console.log(`[dev] shutting down (${reason})...`);

  for (const [name, child] of children.entries()) {
    if (child.exitCode !== null) continue;
    try {
      if (isWin) {
        // Best-effort: terminate the full process tree (npm -> node -> vite/tsx).
        if (typeof child.pid === 'number') {
          spawn('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true });
        } else {
          child.kill('SIGTERM');
        }
      } else if (typeof child.pid === 'number') {
        // Kill the entire process group.
        process.kill(-child.pid, 'SIGINT');
      } else {
        child.kill('SIGINT');
      }
    } catch (err) {
      console.error(`[dev] failed to stop ${name}:`, err);
    }
  }

  forceExitTimer = setTimeout(() => {
    for (const [name, child] of children.entries()) {
      if (child.exitCode !== null) continue;
      try {
        child.kill('SIGKILL');
      } catch (err) {
        console.error(`[dev] failed to force-stop ${name}:`, err);
      }
    }
    process.exit(shutdownCode);
  }, 5000);
  forceExitTimer.unref();

  process.exitCode = shutdownCode;
}

function registerChild(name, child) {
  children.set(name, child);
  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    const exitCode = typeof code === 'number' ? code : 0;
    const reason = signal ? `${name} exited (${signal})` : `${name} exited (${exitCode})`;
    shutdown({ reason, code: exitCode });
  });
  child.on('exit', () => {
    if (!shuttingDown) return;
    if (allExited()) {
      if (forceExitTimer) clearTimeout(forceExitTimer);
      process.exit(shutdownCode);
    }
  });
}

const serverCwd = resolve('server');
registerChild('server', spawnNpm({ name: 'server', cwd: serverCwd, npmArgs: ['run', 'dev'] }));
registerChild('client', spawnNpm({ name: 'client', cwd: process.cwd(), npmArgs: ['run', 'dev:client'] }));

process.on('SIGINT', () => shutdown({ reason: 'SIGINT', code: 0 }));
process.on('SIGTERM', () => shutdown({ reason: 'SIGTERM', code: 0 }));
