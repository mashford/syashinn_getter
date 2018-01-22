const http = require('http')
const fs = require('fs')
const {URL} = require('url')
const cheerio = require('cheerio')

function getHtml(v) {
	return new Promise(function(resolve, reject) {
		console.log('1: gettingHtml: '+v.html_num)
		let path_ 
		if (v.html_num == 1) {
			path_ = v.url_obj.pathname
		} else {
			path_ = v.url_obj.pathname+v.html_num+'.html'
		}

		const option  = {
			host: v.url_obj.hostname,
			port: '80',
			path: path_,
			method: 'GET',
			headers: {
				'Connection': 'keep-alive',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
				'Accept-Encoding': 'deflate',
				'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
				'Pragma': 'no-cache',
				'User-Agent': ' Mozilla/5.0 (X11;s Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/63.0.3239.84 Chrome/63.0.3239.84 Safari/537.36'
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
		  	let data_ = '';
			res.setEncoding('utf-8');
			res.on('data', (chunk) => {
				data_ += chunk;
			})
			res.on('end',() => {
				res.resume()
				console.log('1: gotHtml: '+v.html_num)
				let $ = cheerio.load(data_)
				v.album_name = $('.weizhi h1').text().slice(0, $('.weizhi h1').text().lastIndexOf("]")+1).replace(/\//, '·')
				v.photo_src_obj = new URL($('.content').find('img').first().attr('src'))
				v.photo_count = $('.content').find('img').length
				v.photo_num = $('.content').find('img').first().attr('src').slice($('.content').find('img').first().attr('src').lastIndexOf("/")+1,-4)-0
				resolve(v)
			})
		})
	})
}

function getMax_p(base_url) {
	return new Promise(function(resolve, reject) {
		const url_obj = new URL(base_url)
		const option  = {
			host: url_obj.hostname,
			port: '80',
			path: url_obj.pathname,
			method: 'GET',
			headers: {
				'Connection': 'keep-alive',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
				'Accept-Encoding': 'deflate',
				'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7',
				'Pragma': 'no-cache',
				'User-Agent': ' Mozilla/5.0 (X11;s Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/63.0.3239.84 Chrome/63.0.3239.84 Safari/537.36'
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
		  	let data_ = '';
			res.setEncoding('utf-8');
			res.on('data', (chunk) => {
				data_ += chunk;
			})
			res.on('end',() => {
				res.resume()
				let $ = cheerio.load(data_)
				//console.log($('.weizhi h1').text().slice(0, $('.weizhi h1').text().lastIndexOf("]")+1).replace(/\//, '·'))
				let total = $('#pages a').last().prev().attr('href').slice($('#pages a').last().prev().attr('href').lastIndexOf('/')+1, -5)
				console.log(total)
				resolve(total)
			})
		})
	})
}


exports.getHtml = getHtml
exports.getMax_p = getMax_p