const path = require("path");

module.exports = {
  devServer: { 
      disableHostCheck : true
    },
  transpileDependencies: ['vue-clamp', 'resize-detector'],
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [path.resolve(__dirname, "./src/styles/style.scss")]
    }
  },
  chainWebpack: (config) => {
    config.plugins.delete('preload')
  }
};
