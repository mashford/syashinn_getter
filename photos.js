const http = require('http')
const fs = require('fs')
const {URL} = require('url')
const cheerio = require('cheerio')

function getPhoto(v) {
	let a = new Promise(function(resolve, reject) {
		let url_obj = v.url_obj
		let page_num = v.page_num
		let photo_num = v.photo_num

		if (fs.existsSync(v.album_name)) {
		} else {
			console.log('2: inai')
			fs.mkdirSync(v.album_name)
			console.log('2: inai')
		}

		console.log('2: getting Photo'+' ' + photo_num)
		console.log(`2: ${v.photo_src_obj.pathname.slice(0,v.photo_src_obj.pathname.lastIndexOf("/"))+'/'+v.photo_num+'.jpg'}`)
		v[2] += 1
		let referer
		if (page_num == 0) {
			referer = url_obj.href
		} else {
			referer = url_obj.href+page_num+'.html'
		}
		const option  = {
			host: v.photo_src_obj.hostname,
			port: '80',
			path: v.photo_src_obj.pathname.slice(0,v.photo_src_obj.pathname.lastIndexOf("/"))+'/'+v.photo_num+'.jpg',
			method: 'GET',
			headers: {
				'Connection': 'keep-alive',
				'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
				'Accept-Encoding': 'deflate',
				'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
				'Pragma': 'no-cache',
				'Referer': referer,
				'User-Agent': ' Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/63.0.3239.84 Chrome/63.0.3239.84 Safari/537.36'
			}
		}
	
		http.get(option, (res) => {
			const { statusCode } = res;
			
			let error;
			if (statusCode !== 200) {
				error = new Error('请求失败。\n' +`状态码: ${statusCode}`);
			} 
		  	if (error) {
		    	console.error(error.message);
		    	res.resume();
		    	return;
		  	}
			
			const writable = fs.createWriteStream(`./${v.album_name}/`+photo_num+'.jpg');
			res.pipe(writable);
			res.on('end', () => {
				writable.end();
				resolve(v)
			})
		})
	})
	return a
}
exports.getPhoto = getPhoto 

