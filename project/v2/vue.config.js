/* vue-cli config options */
const webpack = require('webpack');
const { NODE_ENV, SOURCE_MAP, BASE_URL, OUTPUT_DIR, ASSETS_DIR, PROXY } = process.env;
const isProduction = NODE_ENV === 'production';
const sourceMap = isProduction && SOURCE_MAP === 'true';
const publicPath = BASE_URL || '/';
const outputDir = OUTPUT_DIR || 'dist';
const assetsDir = ASSETS_DIR || '';
const proxyServer = PROXY || '';
const base64Limit = isNaN(process.env.BASE64_SIZE_LIMIT) ? 4096 : Number(process.env.BASE64_SIZE_LIMIT);
const devtool = process.env.DEVTOOL || 'eval-source-map';

const { defineConfig } = require('@vue/cli-service');

const config = defineConfig({
  // babel loader를 사용하여 설치된 pacakge 내의 소스를 변환할지에 대한 여부
  transpileDependencies: true,
  // Public Path, 빌드된 html 파일 내의 src 경로 확인 (like contextRoot)
  publicPath,
  // 빌드 경로
  outputDir,
  // 빌드시 정적 콘텐츠에 대한 위치
  assetsDir,
  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'hello-my-vue',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
      scriptLoading: 'blocking',
    },
  },

  css: {
    // extract 사용시, HMR 지원하지 않음. 운영에서만 사용
    extract: isProduction,
    sourceMap: sourceMap, // sourcemap
  },

  configureWebpack: {
    resolve: {
      alias: {},
    },
    plugins: [],
    performance: {
      maxAssetSize: base64Limit,
    },
  },
  chainWebpack: (config) => {
    // WepbakcHTMLPlugins 코드분할을 위한 chunks 설정
  },
  devServer: {
    server: process.env.HTTPS === 'true' ? 'https' : 'http',
    proxy: proxyServer,
    client: {
      overlay: {
        warnings: false, // lint warning가 뜨면 화면에 오버레이할 지 여부
        errors: false, // lint error가 뜨면 화면에 오버레이할 지 여부
      },
    },
  },

  runtimeCompiler: true,

  // build시 sourcemap 생성 여부
  productionSourceMap: sourceMap,

  pluginOptions: {
    autoRouting: {
      pages: 'src/views',
      importPrefix: '@/views/',
      chunkNamePrefix: 'view-',
    },
  },
});

if (sourceMap) {
  config.configureWebpack.devtool = devtool;
}

module.exports = config;
