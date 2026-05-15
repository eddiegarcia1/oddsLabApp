#!/usr/bin/env node
/**
 * Save OddsLab Mobile only — validates project identity before push.
 * Usage: npm run save
 *        npm run save -- "Your commit message"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const configPath = path.join(root, 'project.config.json');

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: 'inherit', cwd: root });
}

function runCapture(command) {
  return execSync(command, { cwd: root, encoding: 'utf8' }).trim();
}

function fail(message) {
  console.error(`\nSave blocked: ${message}`);
  console.error('Open the oddslab-mobile folder only. Do not run save from another project.\n');
  process.exit(1);
}

function normalizeRemote(url) {
  return url.replace(/\.git$/, '').replace(/\/$/, '').toLowerCase();
}

// --- Validate this is the correct OddsLab project ---
if (!fs.existsSync(configPath)) {
  fail('project.config.json is missing. Wrong folder or corrupted project.');
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

if (pkg.name !== config.packageName) {
  fail(`package.json name is "${pkg.name}" but expected "${config.packageName}".`);
}

let remoteUrl = '';
try {
  remoteUrl = runCapture('git remote get-url origin');
} catch {
  fail('No git remote "origin". This folder is not linked to GitHub yet.');
}

const expectedRemote = normalizeRemote(config.github.remote);
const actualRemote = normalizeRemote(remoteUrl);

if (actualRemote !== expectedRemote) {
  fail(
    `Git remote does not match OddsLab.\n  Expected: ${config.github.remote}\n  Found:    ${remoteUrl}`,
  );
}

const branch = runCapture('git branch --show-current');
if (branch !== config.github.branch) {
  fail(`On branch "${branch}" but OddsLab uses "${config.github.branch}".`);
}

const customMessage = process.argv.slice(2).join(' ').trim();
const defaultMessage = `Save progress (${new Date().toLocaleString('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})})`;
const message = customMessage || defaultMessage;

console.log(`\n${config.displayName}`);
console.log(`Folder: ${config.id}  →  GitHub: ${config.github.owner}/${config.github.repo}\n`);

try {
  run('git add -A');
  const changes = runCapture('git status --porcelain');
  if (!changes) {
    console.log('Nothing new to save — GitHub is already up to date.\n');
    process.exit(0);
  }
  run(`git commit -m ${JSON.stringify(message)}`);
  run(`git push origin ${config.github.branch}`);
  console.log(`\nSaved to: ${config.github.remote}\n`);
} catch {
  process.exit(1);
}
