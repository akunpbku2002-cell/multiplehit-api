const axios = require('axios');

module.exports = async (req, res) => {
	// CORS headers - allow frontend Angular-mu
	res.setHeader(
		'Access-Control-Allow-Origin',
		'https://multiplehit.vercel.app'
	);
	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	// Handle preflight request
	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	// Hanya izinkan POST
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed' });
	}

	const { url, formData } = req.body;

	if (!url || !formData) {
		return res.status(400).json({ error: 'Missing url or formData' });
	}

	// === GANTI DENGAN COOKIE SESSION ASLI KAMU ===
	// Cara ambil: Login SIJSTK → F12 → Application → Cookies → copy value
	const BPJS_COOKIE =
		'BIGipServersmile_productions.app~smile_productions_pool=!R11fBj6/MvA128bniNkIKL0LQO8PDYyytEntuON9l7y0q40FtqQL3s09o3L/9DrsWftkMCm897t8nQ==';

	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		Cookie: BPJS_COOKIE,
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
		Origin: 'http://smile.bpjsketenagakerjaan.go.id',
		Referer: 'http://smile.bpjsketenagakerjaan.go.id/',
	};

	try {
		const response = await axios.post(url, new URLSearchParams(formData), {
			headers,
			timeout: 20000,
		});

		// Kirim HTML mentah ke frontend
		res.status(200).send(response.data);
	} catch (error) {
		console.error('Proxy error:', error.message);

		if (error.response) {
			// Jika BPJS return halaman login atau error
			res
				.status(error.response.status)
				.send(error.response.data || 'BPJS server error');
		} else {
			res.status(500).json({
				error: 'Gagal koneksi ke server BPJS',
				details: error.message,
				hint: 'Periksa cookie session (mungkin sudah expired, login ulang dan update cookie)',
			});
		}
	}
};
