![Alight motioin](https://industry.twic.pics/uploads/berita/detail/54143.jpg)

# 🎬 Alight Motion API Integration

Selamat datang di dokumentasi integrasi API Alight Motion oleh **Hanssoft**. Library ini memungkinkan developer untuk menghubungkan aplikasi atau bot mereka dengan fungsi internal Alight Motion.
## 🚀 Fitur
- **Project Fetching**: Ambil data project secara real-time.
- **XML Support**: Mendukung pemrosesan file XML Alight Motion.
- **Bot Friendly**: Sangat cocok untuk bot WhatsApp (Baileys) atau Telegram.

## 🛠️ Instalasi & Penggunaan
Gunakan contoh kode berikut untuk memulai integrasi menggunakan Node.js:

```javascript
const axios = require('axios');

const apiKey = 'YOUR_API_KEY';
const projectUrl = '[https://alight.link/](https://alight.link/)...';

axios.get(`https://api.hanssoft.web.id/am?key=${apiKey}&url=${projectUrl}`)
  .then(response => {
    console.log('Data Berhasil Diterima:', response.data);
  })
  .catch(error => {
    console.error('Terjadi kesalahan:', error.message);
  });
