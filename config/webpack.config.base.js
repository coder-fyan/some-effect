const path = require("path");

console.log(__dirname);

module.exports = {
  entry: {
    "canvas": "./src/canvas/index.ts",
    "js": "./src/js/getTheDom.ts",
    "svg": "./src/svg/index.ts",
  },
  // target: ["web"],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
    library: {
      type: "umd", // 通用模块定义
      // the type of the exported library
      name: ["ani", "[name]"], // string | string[] we can use it by ani[name][parameter]
      // the name of the exported library
    }
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/,
        exclude: /node_modules/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader"
        ]
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],

    //If we use typescript, we need to set the path parameter in tsconfig.json yet. there be used at compile, tsconfig.json be used at edit.
    alias: {
      animate: path.resolve(__dirname, '../src/canvas/animate/'),
      image: path.resolve(__dirname, '../src/canvas/image/'),
      specialEffect: path.resolve(__dirname, '../src/canvas/specialEffect/'),
      video: path.resolve(__dirname, '../src/canvas/video/'),
      word: path.resolve(__dirname, '../src/canvas/word/'),
      util: path.resolve(__dirname, '../src/util/'),
    }
  },
}