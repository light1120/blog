# Vite

## Vite 是什么？

vite 是一种前端构建工具，包含 2 个部分

- 开发服务器：基于原生 ESM 的 HMR.
- 一套构建指令：预先配置，使用 Rollup 打包代码

## 支持

- 原生 ESM script 标签 ： `<script type="module" src="/src/main.js"></script>`
- import() 动态导入
- import.meta

## Vite 优点

- 1、极速服务启动： 借用 ESM，无需打包
- 2、快速的 HMR：无论应用大小如何，都保持快速的 HMR
- 3、开箱即用：天然支持 `.ts` ,`.jsx` ,`.tsx` ,`.css` ,`.sass` ,`.less` 。
  - `less`,`sass` ，需要安装依赖 `pnpm add less` 等
  - `vue3` : `@vitejs/plugin-vue`,`@vitejs/plugin-vue-jsx`
