# mjml

## 1，简介
[mjml](https://documentation.mjml.io/)是一个类似HTML的标记语言，用来帮助快速创建响应式邮件

## 2，如何使用
* 编写mjml文件
    * 文件结构：主要包括2个部分`mj-head`和`mj-body`
    ```
    <mjml>
        <mj-head>
            ...
        </mj-head>
        <mj-body>
            ...
        </mj-body>
    </mjml>
    ```
    * [body](https://documentation.mjml.io/#standard-body-components)
        * body部分是邮件的具体内容，是一些文字，图片，格式等
        * 标签：`mj-section`,`mj-colum` , `mj-text`,`mj-image`等。
        * 属性：包含`padding`、`color`、`font` 、`width` 、`align` 等属性，每个标签的属性不同，具体参考文档
        * [mj-carousel](https://documentation.mjml.io/#mj-carousel): 可以创建一个轮播
        * [mj-social](https://documentation.mjml.io/#mj-social): 创建可以跳转第三账户(facebook,twitter等)的icon
        * [mj-navbar](https://documentation.mjml.io/#mj-navbar): 创建导航
        * [mj-hero](https://documentation.mjml.io/#mj-hero): 创建一个英雄形象；例如在一张图中间配置一些文案，button等
    * [head](https://documentation.mjml.io/#standard-head-components)
        * [mj-attributes](https://documentation.mjml.io/#mj-attributes): 标签里面，我们可以给body里的标签定义一些通用属性，全局有效。类似 base.css 的作用。
            ```
            <mj-attributes>
                // 给所有mj-text设置了padding
                <mj-text padding="0" />
                // 创建了“blue”样式，body中可以通过mj-class属性来使用 <mj-text mj-class="blue"></mj-text> 
                <mj-class name="blue" color="blue" />
                // 设置所有标签的字体
                <mj-all font-family="Arial" />
            </mj-attributes>
            ```
        * [mj-font](https://documentation.mjml.io/#mj-font): 创建一个字体，可以通过`font-famil="myfont"`属性来使用
        * [mj-style](https://documentation.mjml.io/#mj-style): 创建css 样式，可以通过`css-class="blue-text"`属性使用
            ```
             <mj-style>
                // 需要加 div
                .blue-text div {
                    // 最好加上 !important，不然很多不生效
                    color: blue !important;
                }
            </mj-style>
            ```
* 生成html文件
    * mjml 命令
        ```
        npm install mjml
        mjml input.mjml -o output.html
        ```
    * nodejs
        ```
        import mjml2html from 'mjml'
        const htmlOutput = mjml2html(`
        <mjml>
            ...
        </mjml>
        `, options)
        console.log(htmlOutput.html)
        ```
        [options](https://documentation.mjml.io/#inside-node-js): 可选项中，filePath: 如果用到[mj-include](https://documentation.mjml.io/#mj-include)需要注意
    * [MjmlApp](https://mjmlio.github.io/mjml-app/): 官方客户端，可以编辑，导入，导出等


    
## 3，总结+技巧
* [mj-include](https://documentation.mjml.io/#mj-include): 将邮件公共部分，比如头部，尾部，logo等，抽离独立一个mjml文件，通过mj-include引入，减少重复工作。示例如下，注意如果是相对路径，使用mjml2html时需要设置filePath
  ```
  <mj-body>
    <mj-include path="./components/head.mjml" />
    <mj-include path="./banner.mjml" />
    <mj-include path="./components/foot.mjml" />
  </mj-body>
  ```
* [mj-attributes](https://documentation.mjml.io/#mj-attributes): 设置通用的属性，可以减少很多工作量，比如全局设置字体，创建需要使用的mj-class，对mj-section\mj-button\mj-image等设置通用的属性
* mj-include+mj-attributes: 2者结合，每个具体mjml文件引入公共attributes，减少大量重复性的工作
  ```
  <mj-head>
    <mj-include path="./components/attributes.mjml" />
  </mj-head>
  ```
* 工具
    * [MjmlApp](https://mjmlio.github.io/mjml-app/): 编辑+预览+语法提示+工程化
    * [try-it-live](https://mjml.io/try-it-live): 线上+编辑+预览+语法提示
    * plugin: vscode plugin , atom plugin , sublime text plugin
    * [nodemailer](https://nodemailer.com/about/): 编写好mjml文件之后，直接发送到邮箱体验效果