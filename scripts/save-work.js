#!/usr/bin/env node
/**
 * One-command save: stage all changes, commit, and push to GitHub.
 * Usage: npm run save
 *        npm run save -- "Fixed home header layout"
 */

const { execSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const customMessage = process.argv.slice(2).join(' ').trim();
const defaultMessage = `Save progress (${new Date().toLocaleString('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})})`;
const message = customMessage || defaultMessage;

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: 'inherit', cwd: root });
}

function runCapture(command) {
  return execSync(command, { cwd: root, encoding: 'utf8' }).trim();
}

try {
  run('git add -A');
  const changes = runCapture('git status --porcelain');
  if (!changes) {
    console.log('\nNothing new to save — your GitHub repo is already up to date.');
    process.exit(0);
  }
  run(`git commit -m ${JSON.stringify(message)}`);
  run('git push');
  console.log('\nSaved to GitHub: https://github.com/eddiegarcia1/oddsLabApp');
} catch {
  process.exit(1);
}
