const webpack = require('webpack');

module.exports = {
	entry: '.\\campaign_buddy\\client\\src\\unit-tests\\initTestGameSystem.js',

	output: {
		filename: 'run.js',
		path: __dirname,
	},

	plugins: process.env.NODE_ENV === 'production' ? [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin()
	] : [],

	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets:['es2015', 'react', 'stage-2']
				}
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
		extensions: ['.js','.jsx'],
	}
}
