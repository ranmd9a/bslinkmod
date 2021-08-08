import * as path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const config = () => {
	return {
		entry: {
			content: path.join(__dirname, 'src/js', 'content.ts'),
			bg: path.join(__dirname, 'src/js', 'bg.ts'),
		},
		output: {
			path: path.join(__dirname, 'dist'),
			filename: 'js/[name].js',
		},
		mode: "production",
		module: {
			rules: [
				{
					test: /.ts$/,
					use: 'ts-loader',
					exclude: '/node_modules',
				},
			],
		},
		resolve: {
			extensions: ['.ts', '.js'],
		},
		optimization: {
			minimize: false,
		},
		plugins: [
			new CopyWebpackPlugin({
				patterns: [
					{ from: 'public', to: '.' }
				]
			}),
		]
	}
}

export default config;
