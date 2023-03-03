const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  context: path.resolve(__dirname, '../src/'),//just effect the url which in entry, loader and plugin
  //​We need to set the point at the start position as the relative url mark.​ If not, it will to find the file at node_modules
  entry: {
    "canvas": "./canvas/index.ts",
    "js": "./js/getTheDom.ts",
    "svg": "./svg/index.ts",
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
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
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
      },      {
        test: /\.png/,
        type: 'asset/resource',
        generator: {
          filename: "images/[name].png"
        }
      },
      {
        test: /\.mp4/,
        type: 'asset/resource',
        generator: {
          filename: "video/[name].mp4"
        }
      }
    ],
  },
  resolve: {
    roots: [path.resolve(__dirname, '../src')],
    extensions: [".tsx", ".ts", ".js", "..."], //'...' to access the default extensions

    //If we use typescript, we need to set the path parameter in tsconfig.json yet. there be used at compile, tsconfig.json be used at edit.
    //if we need to use the roots, let the slash at the start position.
    alias: {
      $canvas: '/canvas/',
      $canvasAnimate: '/canvas/animate/',
      $canvasImage: '/canvas/image/',
      $canvasSpecialEffect: '/canvas/specialEffect/',
      $canvasVideo: '/canvas/video/',
      $canvasWord: '/canvas/word/',
      $css: '/css/',
      $images: '/images/',
      $js: '/js/',
      $svg: '/svg/',
      $util: '/util/',
    }
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: "./index.html",
      scriptLoading: "blocking" 
    }),
    new BundleAnalyzerPlugin()
  ]
}