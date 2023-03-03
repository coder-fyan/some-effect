const {merge} = require("webpack-merge");
const baseConf = require("./webpack.config.base");


module.exports = merge(baseConf, {
  mode: "development",
  // output: {
  //  assetModuleFilename: 'images/[name].png'
  // },
})