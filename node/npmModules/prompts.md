# Prompts

> Lightweight, beautiful and user-friendly interactive prompts

## 简介

(prompts](https://github.com/terkelg/prompts) 是一个轻量有好的交互提示工具包，问答形式， 一般用于 cli 工具。

## 用法

- type : text , password , number , comfirm , toggle , select 等

最后拿到`result`，然后解析即可

```
const result = await prompts(
    [
      {
        name: "packageName",
        type: "text",
        message: "Package name:",
        initial: "demo",
      },
      {
        name: "needsTypeScript",
        type: () => "toggle",
        message: "Add TypeScript?",
        initial: false,
        active: "Yes",
        inactive: "No",
      },
      {
        name: "needsE2eTesting",
        type: () => "select",
        message: "Add an End-to-End Testing Solution?",
        initial: 0,
        choices: (prev, answers) => [
          { title: "No", value: false },
          {
            title: "Cypress",
            description: answers.needsVitest
              ? undefined
              : "also supports unit testing with Cypress Component Testing",
            value: "cypress",
          },
          {
            title: "Nightwatch",
            description: answers.needsVitest
              ? undefined
              : "also supports unit testing with Nightwatch Component Testing",
            value: "nightwatch",
          },
          {
            title: "Playwright",
            value: "playwright",
          },
        ],
      },
    ],
    {
      onCancel: () => {
        throw new Error(red("✖") + " Operation cancelled");
      },
    }
  );
```
