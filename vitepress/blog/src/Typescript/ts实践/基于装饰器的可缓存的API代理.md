# 基于装饰器的可缓存的 API 代理

> 工作中遇到了一些查询方法，在很长一段时间内返回的值都是不变的，而且在一次业务中调用的次数很频繁，所以需要一个可策略缓存 Api 结果的工具，不想引入新的包，就用装饰器简单实现了一个


```ts
const Cache = function (storage: Storage = sessionStorage) {
    return function (constructor: new (...argv: any[]) => any) {
        const originalConstructor = constructor
        const newConstructor: any = function (...argv: any[]) {
            const instance = new originalConstructor(...argv)
            const originalfetch = instance.fetch;
            // 重写fetch方法
            instance.fetch = async (...params: any[]) => {
                const cacheKey = JSON.stringify(params)
                const cacheData = storage.getItem(cacheKey)
                if (cacheData) {
                    console.log('result from cache')
                    return JSON.parse(cacheData)
                }
                const res = await originalfetch.apply(instance, params)
                storage.setItem(cacheKey, JSON.stringify(res))
                console.log('result from backend')
                return res
            }
            return instance
        }
        newConstructor.prototype = originalConstructor.prototype
        return newConstructor
    };
}

@Cache(sessionStorage)
export class CacheApi {

    api: (...args: any[]) => Promise<{
        code: Number,
        message: String,
        date: Record<string, any>
    }> = (...args: any[]) => {
        return new Promise((resolve, reject) => {
            resolve({
                code: 0,
                message: 'success',
                date: {}
            })
        })
    }

    constructor(){
        // this.api = createApi(...)
    }

    async fetch(...args: any[]) {
        return await this.api(args)
    }
}

// 调用 api 
const cacheApi = new CacheApi()
cacheApi.fetch()

```
