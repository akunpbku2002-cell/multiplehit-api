const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support JSON body besar

// === PASTE COOKIE SESSION ASLI MU DI SINI ===
// Cara ambil: Login SIJSTK → F12 → Application → Cookies → copy value PHPSESSID & BIGipServer...
const BPJS_COOKIE =
	'PHPSESSID=ISI_PHPSESSID_KAMU; BIGipServersmile_productions.app~smile_productions_pool=ISI_BIGIP_KAMU';

const headers = {
	'Content-Type': 'application/x-www-form-urlencoded',
	Cookie: BPJS_COOKIE || '', // Kalau kosong tidak error
	'User-Agent':
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
	Origin: 'http://smile.bpjsketenagakerjaan.go.id',
	Referer: 'http://smile.bpjsketenagakerjaan.go.id/',
};

// Root route biar tidak 500 saat buka URL utama
app.get('/', (req, res) => {
	res.send(
		'BPJS Proxy API aktif! Gunakan POST /proxy dengan body { url, formData }'
	);
});

app.post('/proxy', async (req, res) => {
	const { url, formData } = req.body;

	if (!url || !formData) {
		return res.status(400).json({ error: 'Missing url or formData' });
	}

	try {
		const response = await axios.post(url, new URLSearchParams(formData), {
			headers,
			timeout: 15000, // 15 detik timeout
		});

		res.send(response.data);
	} catch (error) {
		console.error('Proxy error:', error.message);
		if (error.response) {
			res
				.status(error.response.status)
				.send(error.response.data || 'BPJS server error');
		} else {
			res
				.status(500)
				.json({ error: 'Gagal konek ke BPJS', details: error.message });
		}
	}
});

module.exports = app; // Penting untuk Vercel serverless
