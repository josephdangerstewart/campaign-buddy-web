const webpack = require('webpack');

const path = require('path');

module.exports = {
	entry: './client/src/index.js',

	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'client/dist')
	},

	plugins: process.env.NODE_ENV === 'production' ? [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin()
	] : [],

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react', 'stage-2']
				}
			},
			{
				test: /\.less$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							module: true,
							camelCase: true,
							localIdentName: '[name]__[local]--[hash:base64:5]',
						},
					},
					'less-loader',
				],
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [
					'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
					'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
				]
			}
		]
	},

	resolve: {
		extensions: ['.js', '.jsx'],
	}
}
