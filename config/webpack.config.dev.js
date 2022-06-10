const HtmlWebpackPlugin = require("html-webpack-plugin");
const {merge} = require("webpack-merge");
const baseConf = require("./webpack.config.base");


module.exports = merge(baseConf, {
  mode: "development",
  // output: {
  //  assetModuleFilename: 'images/[name].png'
  // },
  module: {
    rules: [
      {
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
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: "./src/index.html",
      scriptLoading: "blocking" 
    }),
  ],
})