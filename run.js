const {URL} = require('url') 
const getHtml = require('./pages.js').getHtml
const getPhoto = require('./photos.js').getPhoto
const getMax_p = require('./pages.js').getMax_p

const url = process.argv[2];


let start = async function (base_url, min_p, max_p) {
	const url_obj = new URL(base_url)
	let v = {
		url_obj: url_obj,
		album_name: '', 
		html_num: min_p, 
		photo_num: 100, 
		photo_count: 200,
		photo_src_obj: null,
		nothing: 0
	} 
	for (let i=min_p; i<=max_p; i++) {
		v = await getHtml(v)
		for (let j=1; j<=v.photo_count; j++){
			v = await getPhoto(v)
			v.photo_num += 1
		}
		v.html_num += 1
	}
	console.log('good job')
}

async function autoStart(url) {
	let max_p = await getMax_p(url)
	start(url, 1, max_p)
}
autoStart(url)
