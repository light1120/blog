import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Light Blog",
  description: "Light's front-end blog",
  themeConfig: {
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        "text": "Javascript基础",
        "collapsed": true,
        "items": [
          {
            "text": "Javascript-Array",
            "link": "/src/Javascript基础/Javascript-Array"
          },
          {
            "text": "Javascript-ArrayBuffer",
            "link": "/src/Javascript基础/Javascript-ArrayBuffer"
          },
          {
            "text": "Javascript-Base64",
            "link": "/src/Javascript基础/Javascript-Base64"
          },
          {
            "text": "Javascript-Date",
            "link": "/src/Javascript基础/Javascript-Date"
          },
          {
            "text": "Javascript-File",
            "link": "/src/Javascript基础/Javascript-File"
          },
          {
            "text": "Javascript-JSON",
            "link": "/src/Javascript基础/Javascript-JSON"
          },
          {
            "text": "Javascript-Object",
            "link": "/src/Javascript基础/Javascript-Object"
          },
          {
            "text": "Javascript-Promise",
            "link": "/src/Javascript基础/Javascript-Promise"
          },
          {
            "text": "Javascript-String",
            "link": "/src/Javascript基础/Javascript-String"
          }
        ]
      },
      {
        "text": "Nestjs",
        "collapsed": true,
        "items": [
          {
            "text": "Nest 第一阶段的总结",
            "link": "/src/Nestjs/Nest 第一阶段的总结"
          },
          {
            "text": "Nest_Aop",
            "link": "/src/Nestjs/Nest_Aop"
          },
          {
            "text": "Nest_Cache",
            "link": "/src/Nestjs/Nest_Cache"
          },
          {
            "text": "Nest_Config",
            "link": "/src/Nestjs/Nest_Config"
          },
          {
            "text": "Nest_Controller",
            "link": "/src/Nestjs/Nest_Controller"
          },
          {
            "text": "Nest_Fundamentals",
            "link": "/src/Nestjs/Nest_Fundamentals"
          },
          {
            "text": "Nest_Http",
            "link": "/src/Nestjs/Nest_Http"
          },
          {
            "text": "Nest_Logger",
            "link": "/src/Nestjs/Nest_Logger"
          },
          {
            "text": "Nest_Module",
            "link": "/src/Nestjs/Nest_Module"
          },
          {
            "text": "Nest_Provider",
            "link": "/src/Nestjs/Nest_Provider"
          },
          {
            "text": "Nest_Task",
            "link": "/src/Nestjs/Nest_Task"
          }
        ],
      },
      {
        "text": "Nodejs",
        "collapsed": true,
        "items": [
          {
            "text": "Tip",
            "link": "/src/Nodejs/Tip"
          },
          {
            "text": "base",
            "collapsed": true,
            "items": [
              {
                "text": "0-node怎么跑起来",
                "link": "/src/Nodejs/base/0-node怎么跑起来"
              },
              {
                "text": "1-node概述",
                "link": "/src/Nodejs/base/1-node概述"
              },
              {
                "text": "2-node多版本环境搭建",
                "link": "/src/Nodejs/base/2-node多版本环境搭建"
              },
              {
                "text": "3-eventLoop",
                "link": "/src/Nodejs/base/3-eventLoop"
              },
              {
                "text": "4-module-package",
                "link": "/src/Nodejs/base/4-module-package"
              },
              {
                "text": "5-eventEmitter",
                "link": "/src/Nodejs/base/5-eventEmitter"
              },
            ]
          }
        ]
      },
      {
        "text": "React",
        "collapsed": true,
        "items": [
          {
            "text": "01_基础",
            "link": "/src/React/01_基础"
          },
          {
            "text": "02_组件",
            "link": "/src/React/02_组件"
          },
          {
            "text": "03_组件执行过程",
            "link": "/src/React/03_组件执行过程"
          },
          {
            "text": "04_状态管理",
            "link": "/src/React/04_状态管理"
          },
          {
            "text": "05_JSX",
            "link": "/src/React/05_JSX"
          },
          {
            "text": "06_应急方案",
            "link": "/src/React/06_应急方案"
          },
          {
            "text": "07_Effect",
            "link": "/src/React/07_Effect"
          },
          {
            "text": "08_Tips",
            "link": "/src/React/08_Tips"
          },
          {
            "text": "09_Hooks",
            "link": "/src/React/09_Hooks"
          },
          {
            "text": "10_Api和组件",
            "link": "/src/React/10_Api和组件"
          },
          {
            "text": "11_ReactDom",
            "link": "/src/React/11_ReactDom"
          },
          {
            "text": "Hooks",
            "collapsed": true,
            "items": [
              {
                "text": "hooks",
                "link": "/src/React/Hooks/hooks"
              },
              {
                "text": "useEffect",
                "link": "/src/React/Hooks/useEffect"
              },
              {
                "text": "useMyHooks",
                "link": "/src/React/Hooks/useMyHooks"
              },
              {
                "text": "useSyncExternalStore",
                "link": "/src/React/Hooks/useSyncExternalStore"
              }
            ]
          },
          {
            "text": "原理",
            "collapsed": true,
            "items": [
              {
                "text": "fiber",
                "link": "/src/React/原理/fiber"
              },
              {
                "text": "test",
                "link": "/src/React/原理/test"
              }
            ]
          }
        ]
      },
      {
        "text": "Typescript",
        "collapsed": true,
        "items": [
          {
            "text": "ts基础",
            "collapsed": true,
            "items": [
              {
                "text": "example",
                "collapsed": true
              },
              {
                "text": "ts语法",
                "collapsed": true,
                "items": [
                  {
                    "text": "1-Ts简介",
                    "link": "/src/Typescript/ts基础/ts语法/1-Ts简介"
                  },
                  {
                    "text": "10-Ts装饰器",
                    "link": "/src/Typescript/ts基础/ts语法/10-Ts装饰器"
                  },
                  {
                    "text": "11-Ts其他",
                    "link": "/src/Typescript/ts基础/ts语法/11-Ts其他"
                  },
                  {
                    "text": "12-Ts编译",
                    "link": "/src/Typescript/ts基础/ts语法/12-Ts编译"
                  },
                  {
                    "text": "2-Ts类型",
                    "link": "/src/Typescript/ts基础/ts语法/2-Ts类型"
                  },
                  {
                    "text": "3-Ts类型操作",
                    "link": "/src/Typescript/ts基础/ts语法/3-Ts类型操作"
                  },
                  {
                    "text": "8-Ts模块",
                    "link": "/src/Typescript/ts基础/ts语法/8-Ts模块"
                  },
                  {
                    "text": "9-Ts工具类型",
                    "link": "/src/Typescript/ts基础/ts语法/9-Ts工具类型"
                  }
                ]
              }
            ]
          },
          {
            "text": "ts实践",
            "collapsed": true,
            "items": [
              {
                "text": "tsconfig实战",
                "link": "/src/Typescript/ts实践/tsconfig实战"
              },
              {
                "text": "基于装饰器的可缓存的API代理",
                "link": "/src/Typescript/ts实践/基于装饰器的可缓存的API代理"
              }
            ]
          },
          {
            "text": "vue相关",
            "collapsed": true,
            "items": [
              {
                "text": "vue",
                "link": "/src/Typescript/vue相关/vue"
              }
            ]
          }
        ]
      },
      {
        "text": "Vite",
        "collapsed": true,
        "items": [
          {
            "text": "vite-plugin",
            "link": "/src/Vite/vite-plugin"
          },
          {
            "text": "vite概述",
            "link": "/src/Vite/vite概述"
          }
        ]
      },
      {
        "text": "Vscode",
        "collapsed": true,
        "items": [
          {
            "text": "plugin",
            "link": "/src/Vscode/plugin"
          },
          {
            "text": "remote",
            "link": "/src/Vscode/remote"
          }
        ]
      },
      {
        "text": "Vue",
        "collapsed": true,
        "items": [
          {
            "text": "Vue3如何执行的",
            "link": "/src/Vue/Vue3如何执行的"
          },
          {
            "text": "Vue表单校验",
            "link": "/src/Vue/Vue表单校验"
          },
          {
            "text": "Vue项目如何处理弹窗",
            "link": "/src/Vue/Vue项目如何处理弹窗"
          },
          {
            "text": "Vue项目架构",
            "link": "/src/Vue/Vue项目架构"
          }
        ]
      },
      {
        "text": "WebApi",
        "collapsed": true,
        "items": [
          {
            "text": "Fullscreen",
            "link": "/src/WebApi/Fullscreen"
          },
          {
            "text": "Image",
            "link": "/src/WebApi/Image"
          },
          {
            "text": "IntersectionObserver",
            "link": "/src/WebApi/IntersectionObserver"
          },
          {
            "text": "MutationObserver",
            "link": "/src/WebApi/MutationObserver"
          },
          {
            "text": "PageVisibility",
            "link": "/src/WebApi/PageVisibility"
          },
          {
            "text": "Performance",
            "link": "/src/WebApi/Performance"
          },
          {
            "text": "PostMessage",
            "link": "/src/WebApi/PostMessage"
          },
          {
            "text": "SourceBuffer",
            "link": "/src/WebApi/SourceBuffer"
          },
          {
            "text": "WebWorkers",
            "link": "/src/WebApi/WebWorkers"
          }
        ]
      },
      {
        "text": "前端工程化",
        "collapsed": true,
        "items": [
          {
            "text": "代码评审",
            "link": "/src/前端工程化/代码评审"
          },
          {
            "text": "前端工程化-概述",
            "link": "/src/前端工程化/前端工程化-概述"
          },
          {
            "text": "构建脚本",
            "link": "/src/前端工程化/构建脚本"
          },
          {
            "text": "模板语法",
            "link": "/src/前端工程化/模板语法"
          },
          {
            "text": "版本管理",
            "link": "/src/前端工程化/版本管理"
          },
          {
            "text": "项目管理",
            "link": "/src/前端工程化/项目管理"
          }
        ]
      },
      {
        "text": "性能优化",
        "collapsed": true,
        "items": [
          {
            "text": "前端性能优化",
            "link": "/src/性能优化/前端性能优化"
          },
          {
            "text": "指标分析",
            "link": "/src/性能优化/指标分析"
          },
          {
            "text": "高并发活动",
            "link": "/src/性能优化/高并发活动"
          }
        ]
      },
      {
        "text": "正则",
        "collapsed": true,
        "items": [
          {
            "text": "基础",
            "link": "/src/正则/基础"
          },
          {
            "text": "实战",
            "link": "/src/正则/实战"
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/light1120/blog' }
    ]
  }
})
