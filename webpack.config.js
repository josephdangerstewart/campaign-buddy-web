var fs = require('fs')
var path = require('path')

module.exports = {
	entry: './server.js',

	output: {
		filename: 'server.bundle.js',
		path: __dirname
	},

	target: 'node',

	// keep node_module paths out of the bundle
	externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
		'react-dom/server'
	]).reduce(function (ext, mod) {
		ext[mod] = 'commonjs ' + mod
		return ext
	}, {}),

	node: {
		__filename: false,
		__dirname: false
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react', 'stage-2']
				}
			}
		]
	}

}
