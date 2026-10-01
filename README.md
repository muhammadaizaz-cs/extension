# QuickQR – Chrome Extension

> **Generate QR codes instantly from any text, URL, email, phone number, or Wi-Fi info. Download as PNG with one click.**

---

## ✨ Features

- ⚡ **Instant QR generation** – supports URLs, text, emails, phone numbers, Wi-Fi credentials, and more
- 📥 **One-click PNG download** – saves as `quickqr.png`
- 🌙 **Dark minimal UI** – polished, modern design
- 🔒 **100% offline** – no backend, no tracking, no data stored
- ⌨️ **Keyboard friendly** – press `Enter` to generate

---

## 📁 Project Structure

```
quickqr/
├── manifest.json      ← Chrome Extension Manifest V3
├── popup.html         ← Extension popup UI
├── style.css          ← Styling
├── popup.js           ← QR logic (generate + download)
├── qrcode.min.js      ← Bundled QR library (offline, no CDN)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md          ← This file
```

---

## 🚀 How to Load in Chrome (Developer Mode)

1. Open **Google Chrome**
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **"Load unpacked"**
5. Select the **`quickqr/`** folder (the directory containing `manifest.json`)
6. The **QuickQR** extension icon will appear in your browser toolbar
7. Click the icon to open the popup and start generating QR codes!

---

## 📦 How to Package for Submission

To create a `.zip` for the Chrome Web Store:

```bash
# From the parent directory
zip -r quickqr.zip quickqr/ --exclude "*.DS_Store" --exclude "__MACOSX"
```

Or on Windows (PowerShell):
```powershell
Compress-Archive -Path .\quickqr\* -DestinationPath .\quickqr.zip
```

---

## 🔧 Technical Details

| Property        | Value                            |
|-----------------|----------------------------------|
| Manifest        | Version 3 (MV3)                  |
| Permissions     | None required                    |
| External calls  | None (fully offline)             |
| QR Library      | qrcodejs v1.0.0 (bundled locally)|
| QR Error Level  | H (High – 30% damage tolerance)  |
| Download format | PNG (`quickqr.png`)              |

---

## 🎯 Supported Input Types

| Type        | Example                                          |
|-------------|--------------------------------------------------|
| URL         | `https://example.com`                            |
| Email       | `mailto:hello@example.com`                       |
| Phone       | `tel:+1234567890`                                |
| SMS         | `sms:+1234567890?body=Hello`                     |
| Wi-Fi       | `WIFI:T:WPA;S:MyNetwork;P:MyPassword;;`          |
| Plain text  | `Hello, World!`                                  |
| vCard       | `BEGIN:VCARD\nFN:John Doe\nEND:VCARD`            |

---

## 📄 License

MIT License – free to use, modify, and distribute.
