const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async function (req, res, next) {

	// res.setHeader('Access-Control-Allow-Origin', '*')
	// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
	// res.setHeader(
	// 	'Access-Control-Allow-Headers',
	// 	'Authorization, Accept, Content-Type'
	// )
	// if (req.method == 'OPTIONS') {
	// 	return res.send(res, 200)
	// }

	const { body } = req

	const browser = await puppeteer.launch({
		args: chrome.args,
		executablePath: await chrome.executablePath,
		headless: chrome.headless,
	});

	const page = await browser.newPage()
	await page.setContent(body.content, { "waitUntil": "networkidle0" })

	const buffer = await page.pdf({
		format: body.format,
		printBackground: false,
		margin: {
			left: '0px',
			top: '0px',
			right: '0px',
			bottom: '0px'
		}
	})
	await browser.close()

	res.send(buffer)
}