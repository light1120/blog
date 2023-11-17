
/**
 *  使用 apply 的时候，要关注调用target 的类型
 */

const handleSubmit = function (submit: () => Promise<any>) {
    return async (...argv: any[]) => {
        return await submit.apply(this, argv)
    }
}
// 上面方法会提示 submit.apply(this, argv) 的 argv  参数报错
// Argument of type 'any[]' is not assignable to parameter of type '[]'.  Target allows only 0 element(s) but source may have more.
//
// 仔细分析下提示，Target allows only 0 element 这里说的是 submit 允许 0 个参数，就是 submit 允许 0 个参数。那么就是 handleSubmit 的 submit 函数的类型不对
// 修改如下

const handleSubmitFix = function (submit: (...argv: any[]) => Promise<any>) {
    return async (...argv: any[]) => {
        return await submit.apply(this, argv)
    }
}