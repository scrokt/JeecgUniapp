import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'uniapp',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    color: '#333333',
    selectedColor: '#418AFF',
    backgroundColor: '#FFF',
    borderStyle: 'white',
    height: '60px',
    fontSize: '11px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        iconPath: 'static/tabbar/saishi.png',
        selectedIconPath: 'static/tabbar/saishi2.png',
        pagePath: 'pages/saishi/saishi',
        text: '赛事',
      },
      {
        iconPath: 'static/tabbar/saicheng.png',
        selectedIconPath: 'static/tabbar/saicheng2.png',
        pagePath: 'pages/index/index',
        text: '赛程',
      },
      {
        iconPath: 'static/tabbar/shequ.png',
        selectedIconPath: 'static/tabbar/shequ2.png',
        pagePath: 'pages/workHome/index',
        text: '社区',
      },
      {
        iconPath: 'static/tabbar/wode.png',
        selectedIconPath: 'static/tabbar/wode2.png',
        pagePath: 'pages/user/people',
        text: '我的',
      },
    ],
  },
})
