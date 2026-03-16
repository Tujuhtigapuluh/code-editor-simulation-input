# ⌨️ Auto Code Typer — VS Code Style

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <b>Simulasi auto-typing code yang terlihat seperti manusia sedang coding di VS Code.</b><br/>
  Paste script anda, lalu tampilkan seolah-olah anda mengetik secara manual — lengkap dengan typo, koreksi, IntelliSense popup, dan syntax highlighting!
</p>

---

## 🎥 Demo

Aplikasi ini menampilkan interface persis seperti VS Code dengan kemampuan auto-typing yang sangat realistis. Cocok untuk:

- 📹 **Membuat video tutorial coding** — tampilkan seakan-akan Anda sedang mengetik langsung
- 🎬 **Screen recording** — buat konten yang terlihat natural
- 📊 **Presentasi** — demo coding secara live
- 🎓 **Edukasi** — tunjukkan proses menulis code step-by-step

---

## ✨ Fitur-Fitur

### 🖥️ Tampilan VS Code yang Akurat
| Komponen | Deskripsi |
|----------|-----------|
| **Title Bar** | Bar atas dengan tombol traffic light (merah/kuning/hijau) |
| **Menu Bar** | Menu File, Edit, Selection, View, Go, Run, Terminal, Help |
| **Activity Bar** | Sidebar icon untuk Explorer, Search, Git, Extensions |
| **Explorer Panel** | Panel file tree dengan folder structure |
| **Tab Editor** | Tab file yang sedang aktif dengan icon |
| **Breadcrumb** | Path navigasi file |
| **Line Numbers** | Nomor baris yang mengikuti jumlah baris code |
| **Minimap** | Preview minimap code di sisi kanan |
| **Status Bar** | Bar bawah biru dengan informasi Ln/Col, encoding, bahasa |

### ⌨️ Efek Ketikan Human-Like
| Fitur | Deskripsi |
|-------|-----------|
| **Typo & Auto-Koreksi** | Kadang salah ketik (1-3 karakter), jeda seakan sadar, lalu backspace dan tulis ulang — persis seperti manusia! |
| **Variasi Kecepatan** | Setiap karakter diketik dengan kecepatan berbeda-beda |
| **Pause After Punctuation** | Jeda lebih lama setelah `.` `,` `;` `:` `{` `}` `(` `)` |
| **Thinking Pause** | Sesekali jeda panjang seakan sedang berpikir |
| **Fast Spaces** | Spasi berulang (indentasi) diketik lebih cepat |
| **Newline Delay** | Jeda setelah Enter seakan membaca baris berikutnya |
| **Nearby-Key Typos** | Karakter salah ketik sesuai posisi keyboard QWERTY yang berdekatan |

### 💡 IntelliSense / Autocomplete
| Fitur | Deskripsi |
|-------|-----------|
| **Popup Saran Code** | Muncul otomatis saat mengetik, persis seperti IntelliSense VS Code |
| **Multi-Kategori** | Menampilkan keyword, function, method, variable, class, constant, module |
| **Icon Per Tipe** | Setiap saran memiliki icon sesuai kategorinya |
| **Detail Panel** | Panel detail di bawah popup menampilkan signature/type |
| **Kontekstual** | Saran berdasarkan kata yang sedang diketik + identifier dari code |
| **Database Lengkap** | 100+ saran built-in: JS/TS keywords, React hooks, DOM API, Array/String methods |
| **Dynamic Suggestions** | Mendeteksi variabel/fungsi dari code yang sedang diketik |
| **On/Off Toggle** | Bisa diaktifkan/nonaktifkan sesuai kebutuhan |

### 🎨 Syntax Highlighting
| Token | Warna | Contoh |
|-------|-------|--------|
| **Keywords** | 🔵 Biru | `const`, `function`, `return`, `import` |
| **Strings** | 🟠 Orange | `"hello"`, `'world'`, `` `template` `` |
| **Comments** | 🟢 Hijau | `// comment`, `/* block */` |
| **Numbers** | 🟢 Hijau Muda | `42`, `3.14`, `0xFF` |
| **Functions** | 🟡 Kuning | `console.log()`, `fetch()` |
| **Booleans** | 🔵 Biru | `true`, `false`, `null`, `undefined` |
| **Decorators** | 🟡 Kuning | `@Component`, `@Injectable` |
| **JSX Tags** | 🔵 Biru | `<div>`, `<Component />` |

### 🎮 Kontrol Lengkap
| Tombol | Fungsi |
|--------|--------|
| ▶️ **Start** | Mulai mengetik dari awal |
| ⏸️ **Pause** | Jeda pengetikan |
| ▶️ **Resume** | Lanjutkan dari jeda |
| ⏹️ **Stop** | Berhenti mengetik |
| ↺ **Reset** | Reset semua ke awal |

### ⚙️ Pengaturan
| Setting | Range | Deskripsi |
|---------|-------|-----------|
| ⚡ **Speed** | 10ms - 200ms | Kecepatan ketikan per karakter |
| 🖊 **Typo Rate** | 0% - 20% | Persentase kemungkinan typo |
| 💡 **IntelliSense** | On / Off | Toggle popup autocomplete |
| 📄 **File Name** | Custom | Nama file yang ditampilkan di tab & breadcrumb |

### 📊 Info Tambahan
- **Progress Bar** — Menampilkan persentase penyelesaian
- **Status Indicator** — Ready → Typing → Paused → Done
- **Ln/Col** — Posisi cursor (baris, kolom) real-time
- **Language Detection** — Otomatis mendeteksi bahasa dari ekstensi file (`.tsx`, `.ts`, `.js`, `.jsx`, `.py`, `.css`, `.html`)
- **Cursor Blinking** — Cursor berkedip realistis seperti editor asli
- **Auto Scroll** — Otomatis scroll ke bawah saat mengetik
- **Custom Scrollbar** — Scrollbar bergaya VS Code dark theme

---

## 🚀 Cara Menggunakan

### 1. Clone Repository
```bash
git clone https://github.com/username/auto-code-typer.git
cd auto-code-typer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```

### 4. Build untuk Production
```bash
npm run build
```

### 5. Gunakan Aplikasi
1. **Paste code** di textarea pada panel Explorer (kiri)
2. Atur **Speed**, **Typo Rate**, dan **IntelliSense** sesuai keinginan
3. Ubah **File Name** jika perlu (misal: `app.tsx`, `index.js`, `main.py`)
4. Klik tombol **▶️ Start** untuk mulai mengetik
5. Gunakan **⏸️ Pause** untuk jeda, **⏹️ Stop** untuk berhenti
6. Rekam layar menggunakan screen recorder favorit Anda!

---

## 🛠️ Tech Stack

| Technology | Version | Deskripsi |
|-----------|---------|-----------|
| [React](https://react.dev/) | 18.x | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type Safety |
| [Vite](https://vitejs.dev/) | 6.x | Build Tool & Dev Server |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-First CSS |

---

## 📁 Struktur Project

```
auto-code-typer/
├── public/
├── src/
│   ├── App.tsx          # Komponen utama aplikasi
│   ├── main.tsx         # Entry point React
│   └── index.css        # Tailwind CSS + custom styles
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
├── tailwind.config.js   # Tailwind config
├── README.md            # Dokumentasi (file ini)
└── LICENSE              # MIT License
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. **Fork** repository ini
2. Buat **branch** baru (`git checkout -b feature/fitur-baru`)
3. **Commit** perubahan (`git commit -m 'Tambah fitur baru'`)
4. **Push** ke branch (`git push origin feature/fitur-baru`)
5. Buat **Pull Request**

### Ide Fitur yang Bisa Ditambahkan
- [ ] Multi-tab editor (buka beberapa file sekaligus)
- [ ] Support tema Light Mode
- [ ] Export recording sebagai GIF/Video
- [ ] Keyboard shortcut (Ctrl+Enter untuk start, dll)
- [ ] Support lebih banyak bahasa (Python, Java, C++, dll)
- [ ] Terminal panel dengan fake output
- [ ] Custom font size
- [ ] Save/Load konfigurasi
- [ ] Multi-cursor simulation
- [ ] Git diff view simulation

---

## 📝 Changelog

### v1.0.0 (Initial Release)
- ✅ VS Code-like interface
- ✅ Human-like typing simulation
- ✅ Typo & auto-correction
- ✅ Syntax highlighting (tokenizer-based)
- ✅ IntelliSense / Autocomplete popup
- ✅ Adjustable speed & typo rate
- ✅ Start / Pause / Resume / Stop controls
- ✅ Progress bar & status indicator
- ✅ Custom file name
- ✅ Auto scroll
- ✅ Cursor blinking
- ✅ Minimap preview
- ✅ File tree in explorer
- ✅ Responsive layout

---

## ⚠️ Disclaimer

Aplikasi ini dibuat untuk tujuan edukasi dan pembuatan konten. Pastikan Anda:
- Tidak menggunakan untuk menipu orang lain bahwa Anda sedang live coding
- Mencantumkan kredit jika digunakan dalam video tutorial
- Menggunakan dengan etika dan bertanggung jawab

---

## 📄 License

```
MIT License

Copyright (c) 2024 Auto Code Typer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ⭐ Star This Repo

Jika project ini membantu, berikan ⭐ star di GitHub! Terima kasih! 🙏

---

<p align="center">
  Made with ❤️ and ☕ | Auto Code Typer v1.0.0
</p>
