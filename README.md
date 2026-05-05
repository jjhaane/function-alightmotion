# function-alightmotion
from weasyprint import HTML

html_content = """
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 0;
            background-color: #0d1117;
        }
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #c9d1d9;
            margin: 0;
            padding: 40px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .header {
            border-bottom: 1px solid #30363d;
            padding-bottom: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        h1 {
            color: #58a6ff;
            font-size: 28pt;
            margin: 0;
        }
        .badge-container {
            margin-top: 10px;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10pt;
            font-weight: bold;
            margin-right: 5px;
            background: #21262d;
            border: 1px solid #30363d;
            color: #8b949e;
        }
        h2 {
            color: #f0f6fc;
            font-size: 18pt;
            border-left: 4px solid #58a6ff;
            padding-left: 15px;
            margin-top: 40px;
        }
        pre {
            background-color: #161b22;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #30363d;
            overflow-x: auto;
            font-family: 'Courier New', Courier, monospace;
            font-size: 10pt;
            color: #d1d5da;
        }
        code {
            color: #79c0ff;
        }
        .feature-item {
            background: #161b22;
            border: 1px solid #30363d;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 10px;
        }
        .url-box {
            background: #238636;
            color: white;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
            font-weight: bold;
            margin: 30px 0;
            font-size: 14pt;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 9pt;
            color: #8b949e;
            border-top: 1px solid #30363d;
            padding-top: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            border: 1px solid #30363d;
            text-align: left;
        }
        th {
            background-color: #161b22;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Alight Motion API Integration</h1>
            <div class="badge-container">
                <span class="badge">V1.0.0</span>
                <span class="badge">Node.js Support</span>
                <span class="badge">High Uptime</span>
            </div>
        </div>

        <p>Gunakan API Alight Motion dari Hanssoft untuk mengotomatisasi proses editing, pengecekan preset, dan integrasi bot WhatsApp/Telegram dengan mudah.</p>

        <h2>Fitur Utama</h2>
        <div class="feature-item">
            <strong>Otomatisasi Project:</strong> Integrasikan fungsi Alight Motion langsung ke dalam script bot atau aplikasi Anda.
        </div>
        <div class="feature-item">
            <strong>Kecepatan Tinggi:</strong> Server yang dioptimalkan untuk menangani request API secara simultan.
        </div>
        <div class="feature-item">
            <strong>Dokumentasi Lengkap:</strong> Struktur JSON yang rapi dan mudah dipahami oleh developer.
        </div>

        <h2>Cara Penggunaan (Node.js)</h2>
        <pre>
const axios = require('axios');

async function checkProject(apiKey, link) {
    try {
        const res = await axios.get(`https://api.hanssoft.web.id/am?key=${apiKey}&url=${link}`);
        console.log(res.data);
    } catch (err) {
        console.error("Gagal mengambil data:", err.message);
    }
}
        </pre>

        <h2>Dapatkan API Key</h2>
        <p>Anda dapat membeli atau melakukan top-up API Key melalui tautan di bawah ini:</p>
        
        <div class="url-box">
            🌐 am.hanssoft.web.id
        </div>

        <h2>Parameter API</h2>
        <table>
            <tr>
                <th>Parameter</th>
                <th>Wajib</th>
                <th>Deskripsi</th>
            </tr>
            <tr>
                <td>key</td>
                <td>Ya</td>
                <td>API Key Hanssoft Anda</td>
            </tr>
            <tr>
                <td>url</td>
                <td>Ya</td>
                <td>Link project/XML Alight Motion</td>
            </tr>
        </table>

        <div class="footer">
            Dikembangkan oleh Hanssoft Digital &copy; 2026
        </div>
    </div>
</body>
</html>
"""

# Generate PDF
HTML(string=html_content).write_pdf("README_AlightMotion_API.pdf")

# Generate README.md text
readme_text = """
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
