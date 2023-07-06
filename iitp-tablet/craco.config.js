module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      /* ... */
      webpackConfig.plugins[0].userOptions.scriptLoading = "blocking";
      return webpackConfig;
    },
  },
};
