const HtmlWebpackPlugin = require("html-webpack-plugin");
const {merge} = require("webpack-merge");
const baseConf = require("./webpack.config.base");


module.exports = merge(baseConf, {
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({ 
      template: "./src/index.html",
      scriptLoading: "blocking" 
    }),
  ],
})