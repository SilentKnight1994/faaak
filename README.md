# 💥 Faaak! — Test Failure Sound Extension

> Plays **"Faaak!"** out loud whenever your tests fail. Because silence is not an option.

---

## Features

- 🔊 **Speaks "Faaak!"** using your system's TTS when tests fail
- 🎵 **Custom sound file** support — bring your own audio (.wav / .mp3)
- 🔇 **Toggle on/off** via status bar or command palette
- 🧪 **Works with all major test frameworks:**
  - Jest / Vitest
  - Mocha
  - Pytest
  - Go test
  - RSpec
  - PHPUnit
  - dotnet test / xUnit / MSTest
  - Any framework that writes JUnit XML results

---

## Installation

### Option A: Install from `.vsix` file
1. Download `faaak-1.0.0.vsix`
2. Open VS Code → Extensions (Ctrl+Shift+X)
3. Click `...` → **Install from VSIX**
4. Select the downloaded file
5. Reload VS Code

### Option B: Manual install
```bash
# Install dependencies
npm install

# Package the extension
npm run package

# Install it
code --install-extension faaak-1.0.0.vsix
```

---

## Usage

- **Just run your tests** — if they fail, you'll hear it
- **Test the sound:** `Ctrl+Shift+P` → `Faaak!: Test the sound`
- **Toggle on/off:** Click the `$(unmute) Faaak` item in the status bar (bottom right)

---

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `faaak.enabled` | `true` | Enable/disable the sound |
| `faaak.phrase` | `"Faaak!"` | What to say (TTS mode) |
| `faaak.volume` | `1.0` | Volume (0.0 to 1.0) |
| `faaak.customSoundPath` | `""` | Path to custom .wav/.mp3 file |

### Custom sound example (`settings.json`):
```json
{
  "faaak.customSoundPath": "/Users/you/sounds/faaak.mp3",
  "faaak.phrase": "Oh no no no no",
  "faaak.volume": 0.8
}
```

---

## How It Detects Test Failures

The extension uses **3 layers** of detection:

1. **VS Code Testing API** — native integration with test runners that use VS Code's built-in test panel
2. **Task exit codes** — any task with "test" in the name that exits with a non-zero code
3. **JUnit XML files** — watches for `test-results/*.xml` files with failure counts > 0

---

## Platform Support

| Platform | TTS Engine Used |
|----------|----------------|
| macOS | `say -v Ralph` |
| Windows | PowerShell SAPI |
| Linux | `espeak` or `festival` |

> **Linux users:** Make sure `espeak` is installed: `sudo apt install espeak`

---

## Tips

- Point `faaak.customSoundPath` at any WAV/MP3 for maximum drama
- Change `faaak.phrase` to `"Bloody hell"` for a classier reaction
- Keep it at `2x` leverage and maybe you'll hear it less 💀
