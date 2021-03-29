var path = require('path')
var webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './examples/index.js',
  devtool: 'inline-source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
  },

  resolve: {
    alias: {
      'switch-pro': path.resolve(__dirname, '../lib')
    }
  }
}
