# Tailwindcss




### 注意事项

- **动态类名** : 谨慎使用，或者不用

> tailwindcss 只能解析完整的类名，不能解析动态，或者 字符串拼接的类型

```
<div class="text-{{ error ? 'red' : 'green' }}-600"></div> // 无法解析
<div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>  // 可以解析


<div class="{{ `w-${width}` }}"></div>  // 不能解析，不推荐使用， 即使配置如下 theme.extend.width ，如果 width 的值是 400 ，开发环境生效，生产环境不生效。

theme: {
    extend: {
        width: {
            ...
            '399': '399px',
            '400': '399px',
            '401': '399px',
            ...
        },
    },
},
``` 