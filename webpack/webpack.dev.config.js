const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');

const dest = Path.join(__dirname, '../dist');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  devServer: {
    contentBase: dest,
    inline: true
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    rules: [
      // {
      //   test: /\.(js)$/,
      //   include: Path.resolve(__dirname, '../src'),
      //   enforce: 'pre',
      //   loader: 'eslint-loader',
      //   options: {
      //     emitWarning: true,
      //   }
      // },
      {
        test: /\.(js)$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader'
      },
      {
        test: /\.s?[ac]ss$/i,
        use: ['style-loader', 'css-loader?sourceMap=true', 'sass-loader']
      }
    ]
  }
});
