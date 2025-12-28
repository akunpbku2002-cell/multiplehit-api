const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === PASTE COOKIE SESSION ASLI DI SINI ===
const BPJS_COOKIE =
	'PHPSESSID=PASTE_DI_SINI; BIGipServersmile_productions.app~smile_productions_pool=PASTE_DI_SINI';

const headers = {
	'Content-Type': 'application/x-www-form-urlencoded',
	Cookie: BPJS_COOKIE,
	'User-Agent':
		'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
	Origin: 'http://smile.bpjsketenagakerjaan.go.id',
	Referer: 'http://smile.bpjsketenagakerjaan.go.id/',
};

app.post('/proxy', async (req, res) => {
	const { url, formData } = req.body;

	if (!url || !formData) {
		return res.status(400).json({ error: 'Missing url or formData' });
	}

	try {
		const response = await axios.post(url, new URLSearchParams(formData), {
			headers,
		});
		res.send(response.data);
	} catch (error) {
		console.error(
			'Error:',
			error.response ? error.response.data : error.message
		);
		res
			.status(500)
			.json({ error: 'Gagal ambil data BPJS', details: error.message });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy jalan di port ${PORT}`));
