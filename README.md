# 💥 Faaak! — Test Failure Sound

> **Plays a sound out loud whenever your tests or tasks fail.**  
> Because staring at red text in silence is not enough.

![Faaak! in action](https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/faaak/main/icon.png)

---

## ✨ Features

- 🔊 **Speaks "Faaak!"** out loud when any task or test fails
- 🎵 **Custom sound support** — plug in your own MP3 or WAV
- 🔇 **Toggle on/off** instantly from the status bar
- 🖥️ **Cross-platform** — works on Windows, macOS, and Linux
- ⚡ **Zero config** — install and it just works

---

## 🚀 How It Works

Faaak! detects failures in 3 ways:

1. **VS Code Tasks** — any task that exits with a non-zero code (works with Jest, Pytest, Go test, Mocha, RSpec, PHPUnit, dotnet test, and more)
2. **VS Code Testing API** — native integration with test runners using VS Code's built-in test panel
3. **JUnit XML files** — watches for `test-results/*.xml` files written by your test framework

---

## 🎮 Usage

- **Run tests** via `Ctrl+Shift+P` → `Run Test Task` — sound plays on failure automatically
- **Test the sound** → `Ctrl+Shift+P` → `Faaak!: Test the sound`
- **Toggle on/off** → Click the status bar item in the bottom right, or `Ctrl+Shift+P` → `Faaak!: Toggle on/off`

---

## ⚙️ Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `faaak.enabled` | `true` | Enable or disable the sound |
| `faaak.phrase` | `"Faaak!"` | What to say when tests fail (TTS mode) |
| `faaak.volume` | `1.0` | Volume from 0.0 to 1.0 |
| `faaak.customSoundPath` | `""` | Full path to a .mp3 or .wav file |

### Custom sound example:
```json
{
  "faaak.customSoundPath": "C:/Users/you/sounds/faaak.mp3",
  "faaak.phrase": "Oh no no no no",
  "faaak.volume": 0.8
}
```

---

## 🖥️ Platform Support

| Platform | Default Sound | Custom Sound |
|----------|--------------|--------------|
| Windows | PowerShell SAPI (TTS) | WMPlayer (MP3 + WAV) |
| macOS | `say` command (TTS) | `afplay` (MP3 + WAV) |
| Linux | `espeak` (TTS) | `ffplay` / `aplay` / `paplay` |

> **Linux:** Install espeak with `sudo apt install espeak`

---

## 📋 Setting Up Tasks (Recommended)

Add a `.vscode/tasks.json` to your project so tests run as a VS Code Task:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "test",
      "type": "shell",
      "command": "npm test",
      "group": {
        "kind": "test",
        "isDefault": true
      }
    }
  ]
}
```

Then run with `Ctrl+Shift+P` → `Run Test Task`.

---

## 🤝 Contributing

Found a bug or want a feature? Open an issue on [GitHub](https://github.com/YOUR_GITHUB_USERNAME/faaak/issues).

---

## 📄 License

MIT — do whatever you want with it. Just don't blame us when your coworkers hear it. 💀
