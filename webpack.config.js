const path = require('path');

const SRC_PATH = path.join(__dirname, 'src');
const ENTRY_PATH = path.join(__dirname, 'src/index.js');
const DEST_PATH = path.join(__dirname, 'dist');

module.exports = {
  entry: ENTRY_PATH,
  output: {
    filename: 'react-map-interaction.js',
    path: DEST_PATH,
    library: 'ReactMapInteraction',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: SRC_PATH,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "prop-types": {
      commonjs: "prop-types",
      commonjs2: "prop-types",
      "commonj2s": "prop-types",
      amd: "prop-types",
      root: "PropTypes"
    }
  },
  optimization: {
    minimize: false
  }
};
