const axios = require('axios');

module.exports = async (req, res) => {
	// Allow CORS dari frontend-mu (ganti kalau origin beda)
	res.setHeader(
		'Access-Control-Allow-Origin',
		'https://multiplehit.vercel.app'
	);
	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	// Handle preflight OPTIONS
	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { url, formData } = req.body;

	if (!url || !formData) {
		return res.status(400).json({ error: 'Missing url or formData' });
	}

	// === PASTE COOKIE SESSION ASLI MU DI SINI ===
	const BPJS_COOKIE =
		'PHPSESSID=PASTE_PHPSESSID_KAMU_DI_SINI; BIGipServersmile_productions.app~smile_productions_pool=PASTE_BIGIP_KAMU_DI_SINI';

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

		res.status(200).send(response.data);
	} catch (error) {
		console.error('Proxy error:', error.message);
		if (error.response) {
			res
				.status(error.response.status)
				.send(error.response.data || 'BPJS error');
		} else {
			res
				.status(500)
				.json({ error: 'Gagal koneksi ke BPJS', details: error.message });
		}
	}
};
