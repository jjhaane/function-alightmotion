const axios = require('axios');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const https = require('https');

const USERS_FILE = path.join(__dirname, '../users.json');

// ========== KONFIGURASI API YANG BENAR ==========
const API_BASE_URL = 'https://ndxhs.my.id/alightmotion';
const AKSES_KEY = 'beli-di-085141067887';

// ========== FUNGSI LAINNYA ==========
async function loadUsers() {
    try {
        const data = await fsp.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveUsers(users) {
    try {
        await fsp.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.log('Error saveUsers:', error.message);
    }
}

function loadJSON(file) {
    try {
        if (!fs.existsSync(file)) return [];
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.log('Error loadJSON:', err);
        return [];
    }
}

function saveJSON(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (err) {
        console.log('Error saveJSON:', err);
    }
}

// API Client dengan headers yang lebih lengkap
const apiClient = axios.create({
    timeout: 30000,
    httpsAgent: new https.Agent({ rejectUnauthorized: true, keepAlive: true }),
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
    }
});

// ========== FUNGSI API ==========

/**
 * Kirim link verifikasi ke email
 * GET /send?akseskey=xxx&email=xxx
 */
async function verifyEmail(email) {
    try {
        const url = `${API_BASE_URL}/send?akseskey=${AKSES_KEY}&email=${encodeURIComponent(email)}`;
        console.log(`📧 Mengirim link ke: ${email}`);
        
        const response = await apiClient.get(url);
        
        if (response.data && response.data.status === true) {
            console.log('✅ Link terkirim:', response.data.message);
            return {
                status: true,
                message: response.data.message,
                data: response.data.data,
                creator: response.data.creator,
                email: email
            };
        } else {
            throw new Error(response.data?.message || response.data?.error || 'Gagal mengirim link verifikasi');
        }
    } catch (err) {
        console.error("❌ Send error:", err.response?.data || err.message);
        throw new Error('Gagal kirim link: ' + (err.response?.data?.message || err.response?.data?.error || err.message));
    }
}

/**
 * Verifikasi link dari email
 * GET /verify?akseskey=xxx&email=xxx&link=xxx
 */
async function activateLicense(email, link) {
    try {
        if (!link || link.trim() === '') {
            throw new Error('Link verifikasi tidak boleh kosong');
        }
        if (!email || email.trim() === '') {
            throw new Error('Email tidak boleh kosong untuk verifikasi');
        }
        
        const url = `${API_BASE_URL}/verify?akseskey=${AKSES_KEY}&email=${encodeURIComponent(email)}&link=${encodeURIComponent(link)}`;
        console.log(`🔗 Verifikasi link untuk: ${email}`);
        console.log(`🔗 Link yang dikirim: ${link.substring(0, 150)}...`);
        
        const response = await apiClient.get(url);
        
        if (response.data && response.data.status === true) {
            return {
                status: true,
                message: response.data.message,
                data: response.data.data,
                creator: response.data.creator,
                email: email
            };
        } else {
            throw new Error(response.data?.message || response.data?.error || 'Gagal verifikasi link');
        }
    } catch (err) {
        console.error("❌ Verify error:", err.response?.data || err.message);
        
        if (err.response?.status === 400) {
            throw new Error('Link verifikasi tidak valid atau sudah kadaluarsa');
        }
        if (err.response?.status === 401) {
            throw new Error('Akses Key tidak valid');
        }
        
        const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
        throw new Error('Gagal verifikasi: ' + errorMsg);
    }
}

/**
 * Bulk generate akun
 * GET /bulk?akseskey=xxx&amount=xxx
 */
async function bulkSend(amount) {
    try {
        if (!amount || amount <= 0) {
            throw new Error('Jumlah lisensi tidak valid. Minimal 1.');
        }
        if (amount > 100) {
            throw new Error('Maksimal 100 lisensi dalam sekali bulk.');
        }
        
        const url = `${API_BASE_URL}/bulk?akseskey=${AKSES_KEY}&amount=${encodeURIComponent(amount)}`;
        console.log(`📦 Bulk generate ${amount} lisensi...`);
        
        const response = await apiClient.get(url);
        const data = response.data;
        
        // Cek response dari API ndxhs
        if (data && data.status === true && data.result) {
            const accounts = data.result.accounts || [];
            const successCount = data.result.success_count || accounts.length;
            const failedCount = data.result.failed_count || 0;
            const totalRequested = data.result.total_requested || amount;
            
            console.log(`✅ Berhasil membuat ${successCount} dari ${totalRequested} lisensi`);
            
            return {
                status: true,
                message: `Berhasil membuat ${successCount} dari ${totalRequested} lisensi`,
                data: {
                    accounts: accounts,
                    success_count: successCount,
                    failed_count: failedCount,
                    total_requested: totalRequested
                },
                total: totalRequested,
                creator: data.creator || 'ndxhs'
            };
        } else {
            throw new Error(data?.message || data?.error || 'Gagal melakukan bulk generate');
        }
    } catch (err) {
        console.error("❌ Bulk error:", err.response?.data || err.message);
        
        if (err.response?.status === 400) {
            throw new Error('Parameter amount tidak valid');
        }
        if (err.response?.status === 401 || err.response?.status === 403) {
            throw new Error('Akses Key tidak valid atau tidak memiliki akses bulk');
        }
        
        const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
        throw new Error('Gagal bulk generate: ' + errorMsg);
    }
}

function validateBulkAmount(amount) {
    const numAmount = parseInt(amount);
    if (isNaN(numAmount)) {
        return { valid: false, message: '❌ Jumlah harus berupa angka' };
    }
    if (numAmount < 1) {
        return { valid: false, message: '❌ Jumlah minimal 1 lisensi' };
    }
    if (numAmount > 100) {
        return { valid: false, message: '❌ Maksimal 100 lisensi per request' };
    }
    return { valid: true, amount: numAmount };
}

function extractOobCode(input) {
    if (!input) return '';
    return input;
}

// ========== EMAIL VERIFICATION MANAGER ==========
class EmailVerificationManager {
    constructor() {
        this.pendingVerifications = new Map();
    }
    
    async startVerification(userId, email) {
        try {
            if (!email || !email.includes('@')) {
                throw new Error('Email tidak valid');
            }
            
            const result = await verifyEmail(email);
            
            if (result.status) {
                this.pendingVerifications.set(userId.toString(), {
                    email: email,
                    timestamp: Date.now(),
                    expiresIn: 300000 // 5 menit
                });
                return {
                    success: true,
                    message: `✅ Link verifikasi telah dikirim ke ${email}\n⏰ Anda memiliki waktu 5 MENIT untuk verifikasi!\n\n📌 Kirimkan URL lengkap dari email ke bot ini.`,
                    email: email,
                    expiresIn: 5
                };
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
    
    async completeVerification(userId, link) {
        const pending = this.pendingVerifications.get(userId.toString());
        if (!pending) {
            throw new Error('❌ Tidak ada proses verifikasi aktif. Silakan mulai verifikasi ulang.');
        }
        if (Date.now() - pending.timestamp > pending.expiresIn) {
            this.pendingVerifications.delete(userId.toString());
            throw new Error('⏰ Waktu verifikasi habis (5 menit). Silakan mulai ulang.');
        }
        const email = pending.email;
        try {
            const result = await activateLicense(email, link);
            if (result.status) {
                this.pendingVerifications.delete(userId.toString());
                return { ...result, email: email };
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
    
    getVerificationStatus(userId) {
        const pending = this.pendingVerifications.get(userId.toString());
        if (!pending) return { active: false };
        const remainingTime = Math.max(0, pending.expiresIn - (Date.now() - pending.timestamp));
        const remainingMinutes = Math.ceil(remainingTime / 60000);
        return {
            active: true,
            email: pending.email,
            remainingTime: remainingTime,
            remainingMinutes: remainingMinutes,
            expired: remainingTime <= 0
        };
    }
    
    cancelVerification(userId) {
        return this.pendingVerifications.delete(userId.toString());
    }
    
    cleanExpired() {
        const now = Date.now();
        let cleaned = 0;
        for (const [userId, data] of this.pendingVerifications.entries()) {
            if (now - data.timestamp > data.expiresIn) {
                this.pendingVerifications.delete(userId);
                cleaned++;
            }
        }
        if (cleaned > 0) {
            console.log(`🧹 Membersihkan ${cleaned} verifikasi kadaluarsa`);
        }
        return cleaned;
    }
}

const verificationManager = new EmailVerificationManager();

// Bersihkan expired setiap 60 detik
setInterval(() => {
    verificationManager.cleanExpired();
}, 60000);

// ========== BACKUP & UTILITY ==========
async function createBackup() {
    return new Promise((resolve, reject) => {
        const backupPath = path.join(__dirname, '../backup.zip');
        const output = fs.createWriteStream(backupPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        output.on('close', () => {
            console.log('Backup selesai:', archive.pointer() + ' total bytes');
            resolve(backupPath);
        });
        
        archive.on('warning', err => {
            if (err.code === 'ENOENT') {
                console.log('Warning:', err.message);
            } else {
                reject(err);
            }
        });
        
        archive.on('error', err => reject(err));
        archive.pipe(output);
        
        const files = [
            path.join(__dirname, '../reseller.json'),
            path.join(__dirname, '../partner.json'),
            path.join(__dirname, '../users.json'),
            path.join(__dirname, '../index.js'),
            path.join(__dirname, '../package.json')
        ];
        
        files.forEach(file => {
            if (fs.existsSync(file)) {
                archive.file(file, { name: path.basename(file) });
            } else {
                console.log('File tidak ditemukan:', file);
            }
        });
        
        const functionDir = path.join(__dirname, '../function');
        if (fs.existsSync(functionDir)) {
            archive.directory(functionDir, 'function');
        } else {
            console.log('Folder function tidak ditemukan');
        }
        
        archive.finalize();
    });
}

function runtimePanel(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d} Hari ${h} Jam ${m} Menit ${s} Detik`;
}
module.exports = {
    loadUsers,
    saveUsers,
    loadJSON,
    saveJSON,
    verifyEmail,
    activateLicense,
    extractOobCode,
    createBackup,
    runtimePanel,
    verificationManager,
    bulkSend,
    validateBulkAmount
};
