const fs = require('fs');
const path = require('path');
const babelConfig = require('./babelrc');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const files = fs.readdirSync(path.resolve(__dirname, 'cypress/integration'));
const htmlWebpackPlugins = files
  .map((file) => {
    const filename = file.replace(/\.ts$/, '.html');
    const htmlLocation = path.resolve(__dirname, 'cypress/templates', filename);

    return fs.existsSync(htmlLocation)
      ? new HtmlWebpackPlugin({
          title: filename,
          filename,
          template: htmlLocation,
        })
      : null;
  })
  .filter((plugin) => !!plugin);

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: 'source-map',
  entry: {
    polyfill: '@babel/polyfill',
    'ui-guide': [
      path.resolve(__dirname, 'src/ui-guide.scss'),
      path.resolve(__dirname, 'themes/default.scss'),
      path.resolve(__dirname, 'cypress/templates/index.scss'),
      path.resolve(__dirname, 'src/ui-guide.ts'),
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
      title: 'Default',
      template: path.resolve(__dirname, 'cypress/templates/default.html'),
    }),
    ...htmlWebpackPlugins,
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
