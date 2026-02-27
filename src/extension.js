const vscode = require('vscode');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

let statusBarItem;

async function playFaaak() {
  const config = vscode.workspace.getConfiguration('faaak');
  const enabled = config.get('enabled', true);
  if (!enabled) return;

  const customSoundPath = config.get('customSoundPath', '').trim();
  const phrase = config.get('phrase', 'Faaak!');
  const volume = config.get('volume', 1.0);

  const bundledSound = path.join(__dirname, '..', 'faaah.mp3');

  if (customSoundPath && fs.existsSync(customSoundPath)) {
    playCustomSound(customSoundPath, volume, phrase);
  } else if (fs.existsSync(bundledSound)) {
    playCustomSound(bundledSound, volume, phrase);
  } else {
    playTTS(phrase, volume);
  }

  updateStatusBar('💥 FAAAK!', true);
  setTimeout(() => updateStatusBar(), 3000);
}

function playCustomSound(filePath, volume, phrase) {
  const platform = process.platform;
  const normalizedPath = filePath.replace(/\\/g, '/');
  let cmd;

  if (platform === 'darwin') {
    cmd = `afplay "${filePath}"`;
  } else if (platform === 'win32') {
    cmd = `powershell -NoProfile -Sta -Command "Add-Type -AssemblyName presentationCore; $mp = New-Object System.Windows.Media.MediaPlayer; $mp.Open([Uri]'file:///${normalizedPath}'); $mp.Play(); Start-Sleep -s 4"`;
  } else {
    cmd = `ffplay -nodisp -autoexit "${filePath}" 2>/dev/null || aplay "${filePath}" 2>/dev/null || paplay "${filePath}" 2>/dev/null`;
  }

  exec(cmd, (err) => {
    if (err) {
      console.warn('[Faaak!] Custom sound failed, falling back to TTS:', err.message);
      playTTS(phrase, volume);
    }
  });
}

function playTTS(phrase, volume) {
  const platform = process.platform;
  const safePhraseWin = phrase.replace(/'/g, "''");
  const safePhraseUnix = phrase.replace(/"/g, '\\"');
  let cmd;

  if (platform === 'darwin') {
    cmd = `say "${safePhraseUnix}"`;
  } else if (platform === 'win32') {
    const vol = Math.round(volume * 100);
    cmd = `powershell -NoProfile -Command "Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.Volume = ${vol}; $s.Speak('${safePhraseWin}')"`;
  } else {
    cmd = `espeak "${safePhraseUnix}" 2>/dev/null || echo "${safePhraseUnix}" | festival --tts 2>/dev/null`;
  }

  exec(cmd, (err) => {
    if (err) console.error('[Faaak!] TTS failed:', err.message);
  });
}

function updateStatusBar(text, alert = false) {
  if (!statusBarItem) return;
  if (alert) {
    statusBarItem.text = text;
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
  } else {
    const config = vscode.workspace.getConfiguration('faaak');
    const isEnabled = config.get('enabled', true);
    statusBarItem.text = isEnabled ? '$(unmute) Faaak' : '$(mute) Faaak';
    statusBarItem.backgroundColor = undefined;
  }
}

function watchForFailures(context) {
  // Method 1: ANY task with non-zero exit code
  context.subscriptions.push(
    vscode.tasks.onDidEndTaskProcess((e) => {
      if (e.exitCode !== undefined && e.exitCode !== 0) {
        playFaaak();
      }
    })
  );

  // Method 2: VS Code native Testing API
  if (vscode.tests && vscode.tests.onDidChangeTestResults) {
    context.subscriptions.push(
      vscode.tests.onDidChangeTestResults((results) => {
        if (!results) return;
        let hasFailed = false;
        if (results.results) {
          for (const result of results.results) {
            if (result.children) {
              for (const [, item] of result.children) {
                if (
                  item.state === vscode.TestResultState?.Failed ||
                  item.state === vscode.TestResultState?.Errored
                ) hasFailed = true;
              }
            }
          }
        }
        if (hasFailed) playFaaak();
      })
    );
  }

  // Method 3: JUnit XML result files
  const xmlWatcher = vscode.workspace.createFileSystemWatcher(
    '**/{test-results,junit,coverage,reports}/**/*.xml'
  );
  const checkXml = async (uri) => {
    try {
      const content = await vscode.workspace.fs.readFile(uri);
      const text = Buffer.from(content).toString('utf8');
      if (
        (text.includes('failures="') && !text.includes('failures="0"')) ||
        (text.includes('errors="') && !text.includes('errors="0"'))
      ) playFaaak();
    } catch {}
  };
  xmlWatcher.onDidChange(checkXml);
  xmlWatcher.onDidCreate(checkXml);
  context.subscriptions.push(xmlWatcher);
}

function activate(context) {
  console.log('[Faaak!] Activated 💥');

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'faaak.toggle';
  statusBarItem.tooltip = 'Faaak! — Click to toggle on/off';
  updateStatusBar();
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  context.subscriptions.push(
    vscode.commands.registerCommand('faaak.test', () => {
      vscode.window.showInformationMessage('🔊 Testing Faaak! sound...');
      playFaaak();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('faaak.toggle', () => {
      const config = vscode.workspace.getConfiguration('faaak');
      const current = config.get('enabled', true);
      config.update('enabled', !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`Faaak! is now ${!current ? '🔊 ON' : '🔇 OFF'}`);
      updateStatusBar();
    })
  );

  watchForFailures(context);
  vscode.window.showInformationMessage('💥 Faaak! is active. Your tests better pass.');
}

function deactivate() {}

module.exports = { activate, deactivate };