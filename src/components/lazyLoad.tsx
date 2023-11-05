import React, { lazy, Suspense } from 'react'

// v6路由的基础 用法
// 懒加载 封装
const lazyLoad = (path: string) => {
    // 注意 -
    // 报错 - 因为 变量进import函数的时候。webpack也没有办法分析这个变量所代表的真实值是什么。也就代表它没有办法帮你打包出文件，也就没办法在运行时加载到对应的文件。
    // const Comp= lazy(() => import(path));

    // 之所以使用拼接的方式可以，是因为webpack虽然没办法处理完全动态的路径。但是通过收束路径的方式帮你处理部分动态的场景。代码如下：
    // 这个时候webpack会试图打包 "../views" 这个目录下的每一个文件。这样只要path这个变量的值是预期之内的，代码就可以正常运行。
    const Comp = lazy(() => import(`../views/${path}`));
    return (
        // 配合 lazy 懒加载 使用
        <Suspense fallback={<div>...正在加载</div>}>
            <Comp></Comp>
        </Suspense>
    )
}
export default lazyLoad
