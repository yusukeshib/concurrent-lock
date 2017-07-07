var nodeExternals = require('webpack-node-externals')
var path  = require('path')
var fs = require('fs')

const conf = (entry, name, pathname) => {
  return {
    entry: [
      'regenerator-runtime/runtime',
      entry,
    ],
    watch: false,
    context: __dirname,
    output: {
      path: path.join(__dirname, pathname),
      filename: `${name}.js`,
      pathinfo: false,
      libraryTarget: 'umd'
    },
    module:{
      rules: [
        {
          test: /\.(js|jsx)$/,
          enforce: 'pre',
          //include: 'src',
          loader: 'eslint-loader'
        },
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.node.js', '.js'],
      modules: ['node_modules']
    },
    target: 'node',
    externals: [ nodeExternals({
      whitelist: [ 'regenerator-runtime/runtime' ]
    }) ]
  }
}

module.exports = [
  conf('./src/index', 'index', '.'),
]
