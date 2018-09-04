const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { NODE_ENV } = process.env;

const conf = env => {

	const isProd = NODE_ENV === 'production';

  return {
    cache: true,
    mode: !isProd ? 'development' : 'production',
    entry: {
      index: path.resolve(__dirname, 'index.js')
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: '[name].min.js'
    },
    devtool: !isProd ? 'inline-source-map' : '',
    resolve: {
      extensions: ['.js']
    },
    watchOptions: {
      aggregateTimeout: 500,
      poll: 1000,
      ignored: /node_modules/
    },
    optimization: {
      runtimeChunk: 'single'
	},
	plugins: [new CleanWebpackPlugin(['dist'])],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader'
          },
          exclude: /node_modules/,
        },
      ]
    }
  };
};


module.exports = conf;
