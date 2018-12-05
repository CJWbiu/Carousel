const path = require('path');

module.exports = {
	entry: './src/index.js',
	devtool: '#eval-source-map', //添加原始源码的映射便于错误追踪
	output: {
		filename: 'carousel.min.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(scss|sass)$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			}
		]
	}
};