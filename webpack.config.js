const babelConfig = require('./babelrc');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: 'source-map',
  entry: {
    polyfill: '@babel/polyfill',
    'ui-guide': [
      path.resolve(__dirname, 'src', 'ui-guide.scss'),
      path.resolve(__dirname, 'themes', 'default.scss'),
      path.resolve(__dirname, 'templates', 'index.scss'),
      path.resolve(__dirname, 'src', 'ui-guide.ts'),
    ],
  },
  output: {
    library: ['__LIBRARY__', 'ui-guide'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: { ...babelConfig },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'templates', 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'ui-guide.css',
      hmr: process.env.NODE_ENV === 'development',
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
};
