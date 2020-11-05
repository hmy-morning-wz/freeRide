import { AppConfig } from 'herbjs';

AppConfig({
  pages: [
    'pages/index2/index',
    'pages/webview/webview',
  ],
  subPackageBuildType: 'shared', // 必须配置此项
  subPackages: [
    {
      root: 'pages/sub',
      pages: [
        'draw/index',
      ],
    },
  ],
  window: {
    enableInPageRender: 'YES',
    enableDSL: 'YES',
    enableJSC: 'YES',
    enableKeepAlive: 'NO',
    enableCube: 'YES',
    enableWK: 'YES',
    enableTabBar: 'NO',
    nboffline: 'sync',
    tinyPubRes: 'YES',
    showDomain: 'NO',
    allowsBounceVertical: 'NO',
    transparentTitle: 'none',
    titleBarColor: '#333',
  },
});
