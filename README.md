![Alight Motion](https://industry.twic.pics/uploads/berita/detail/54143.jpg)

# 🎬 Alight Motion API Integration – Node.js Library

**Library resmi** untuk mengintegrasikan layanan verifikasi dan bulk generasi akun **Alight Motion Premium** ke dalam aplikasi Node.js (bot WhatsApp, Telegram, atau backend apapun).

Dikembangkan oleh **Hanssoft Digital** – mudah digunakan, siap pakai.

---

## 📦 Instalasi

```bash
npm install axios fs-extra archiver
```

Atau jika menggunakan yarn:

```bash
yarn add axios fs-extra archiver
```

> **Catatan:** Library ini membutuhkan Node.js v14 atau lebih baru.

---

## 🚀 Fitur

- ✅ Kirim link verifikasi ke email (`verifyEmail`)
- 🔓 Verifikasi / aktivasi lisensi dari link (`activateLicense`)
- 📦 Bulk generate akun premium (maks. 100 sekaligus) (`bulkSend`)
- 🧠 Manajemen sesi verifikasi per user (`EmailVerificationManager`)
- 💾 Bantuan untuk load/save JSON, backup data, dan utility lainnya

---

## 🔧 Konfigurasi Awal

Salin file `jayhaan.js` ke proyek Anda, lalu sesuaikan konstanta di bagian atas:

```javascript
const API_BASE_URL = 'https://ndxhs.my.id/alightmotion';
const AKSES_KEY = 'beli-di-085141067887';   // Ganti dengan akses key asli Anda
```

> **Dapatkan akses key:** Hubungi [Hanssoft](https://t.me/jayhankuuh) atau WhatsApp 0851-4106-7887.

---

## 📘 Penggunaan Dasar

### 1. Kirim Link Verifikasi

```javascript
const { verifyEmail } = require('./jayhaan');

async function kirimLink() {
    try {
        const result = await verifyEmail('user@example.com');
        console.log('Status:', result.status);
        console.log('Pesan:', result.message);
    } catch (error) {
        console.error('Gagal:', error.message);
    }
}
```

### 2. Verifikasi / Aktivasi Lisensi

```javascript
const { activateLicense } = require('./jayhaan');

async function aktivasi(email, linkDariEmail) {
    try {
        const result = await activateLicense(email, linkDariEmail);
        console.log('Aktivasi sukses:', result.message);
    } catch (error) {
        console.error('Gagal aktivasi:', error.message);
    }
}
```

### 3. Bulk Generate Akun

```javascript
const { bulkSend, validateBulkAmount } = require('./jayhaan');

async function generateAkun(jumlah) {
    const validasi = validateBulkAmount(jumlah);
    if (!validasi.valid) {
        console.log(validasi.message);
        return;
    }

    try {
        const result = await bulkSend(validasi.amount);
        console.log(`✅ Berhasil: ${result.data.success_count} dari ${result.data.total_requested}`);
        console.log('Daftar akun:', result.data.accounts);
    } catch (error) {
        console.error('Bulk error:', error.message);
    }
}
```

### 4. Menggunakan `EmailVerificationManager` (Sesi per User)

Cocok untuk bot yang melayani banyak pengguna:

```javascript
const { verificationManager } = require('./jayhaan');

// Mulai verifikasi untuk user ID "12345"
await verificationManager.startVerification('12345', 'user@example.com');

// Selesai verifikasi dengan link
const hasil = await verificationManager.completeVerification('12345', 'https://...');

// Cek status
const status = verificationManager.getVerificationStatus('12345');
```

---

## 📚 Daftar Fungsi & Ekspor

| Fungsi / Class                     | Deskripsi                                                                 |
|------------------------------------|---------------------------------------------------------------------------|
| `verifyEmail(email)`               | Mengirim link verifikasi ke email. Return `{ status, message, data, creator, email }` |
| `activateLicense(email, link)`     | Verifikasi link dari email. Return `{ status, message, data, creator, email }` |
| `bulkSend(amount)`                 | Generate akun massal (1–100). Return `{ status, message, data: { accounts, success_count, failed_count, total_requested }, total, creator }` |
| `validateBulkAmount(amount)`       | Validasi input amount. Return `{ valid, message, amount }` |
| `loadUsers()` / `saveUsers(users)` | Baca/tulis file `users.json` (array of user objects) |
| `loadJSON(file)` / `saveJSON(file, data)` | Generic JSON loader/saver |
| `createBackup()`                   | Membuat file ZIP backup dari beberapa file penting |
| `runtimePanel(seconds)`            | Format detik menjadi string "X Hari Y Jam Z Menit ..." |
| `extractOobCode(input)`            | (Utility) Mengekstrak kode dari link verifikasi (opsional) |
| `verificationManager`              | Instance dari `EmailVerificationManager` untuk manajemen sesi per user |
| `EmailVerificationManager` class   | **Method:** `startVerification(userId, email)`, `completeVerification(userId, link)`, `getVerificationStatus(userId)`, `cancelVerification(userId)`, `cleanExpired()` |

---

## 🧪 Contoh Integrasi dengan Bot WhatsApp (Baileys)

```javascript
const { verifyEmail, activateLicense, verificationManager } = require('./jayhaan');

// Kirim link
if (command === '.sendam') {
    const email = args[0];
    await verificationManager.startVerification(senderId, email);
    // Kirim pesan ke user
}

// Verifikasi link
if (command === '.verifam') {
    const link = args[0];
    try {
        const result = await verificationManager.completeVerification(senderId, link);
        await sock.sendMessage(from, { text: `✅ ${result.email} berhasil diaktifkan!` });
    } catch (err) {
        await sock.sendMessage(from, { text: `❌ ${err.message}` });
    }
}
```

---

## ⚙️ Konfigurasi Lanjutan

Ubah nilai `API_BASE_URL` dan `AKSES_KEY` sesuai dengan endpoint yang diberikan oleh penyedia layanan. Contoh:

```javascript
const API_BASE_URL = 'https://ndxhs.my.id/alightmotion';
const AKSES_KEY = 'aks-e57ba2d1e33cc62098785bd3';
```

---

## 🛡️ Catatan Hukum & Lisensi

- **Library ini hanya untuk penggunaan yang sah** sesuai dengan ketentuan layanan Alight Motion.
- Dilarang melakukan reverse engineering, menjual ulang, atau menghapus credit developer.
- © 2026 **Hanssoft Digital** – Hak cipta dilindungi.

---

## 🤝 Dukungan & Kontak

- Telegram: [@jayhankuuh](https://t.me/jayhankuuh)
- WhatsApp: 0851-4106-7887
- Website: [Hanssoft Digital](https://hanssoft.web.id)

---

## 🙏 Ucapan Terima Kasih

Terima kasih telah menggunakan library ini. Jangan lupa ⭐ jika bermanfaat!
```

Silakan salin dan gunakan sebagai `README.md` di repository Anda. Jika perlu penyesuaian lebih lanjut (misalnya menambahkan badge, atau mengubah contoh kode), beri tahu saya.
