const middleware = []

const use = (fn)=>{
    middleware.push(fn)
}

const compose = (middleware)=>{
    return function(ctx){
        let index=0
        const dispath = (i)=>{
            const fn = middleware[i]
            if(!fn){ 
                Promise.resolve()
            }else{
                // fn 的第二个参数next是一个fn，其实就是下一个use(fn)中的fn 
                // 只有在 fn 中调用第二个参数next 才能将链式传递到后面
                Promise.resolve(fn(ctx, dispath.bind(null, i + 1)))
            }
        }
        dispath(index)
    }
}

use(async (ctx,next)=>{
    console.log(1)
    console.log(ctx)
    await next()
    console.log(2)
})

use(async (ctx,next)=>{
    console.log(3)
    console.log(ctx)
    await next()
    console.log(4)
})
use(async (ctx,next)=>{
    console.log(5)
    console.log(ctx)
    await next()
    console.log(6)
})
const fn = compose(middleware)

fn('ctx')