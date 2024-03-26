const path = require('path');

module.exports = {
	mode: 'production',
	entry: './exampleUsage.ts', // Your main TypeScript file
	target: 'node',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		filename: 'bundle.js', // The output bundle file
		path: path.resolve(__dirname, 'build'),
	},
};
