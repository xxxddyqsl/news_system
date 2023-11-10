// applyMiddleware - 应用中间件的意思 可以写多个中间件
// import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import {configureStore,combineReducers,applyMiddleware,compose} from '@reduxjs/toolkit'

// 导入 Redux 中间件 redux-thunk 处理异步情况 -方式1：安装 npm install --save redux-thunk  redux-thunk 详细案例可见 getCinemaListAction.js
import reduxThunk from "redux-thunk"
// 导入 Redux 中间件 redux-promise 处理异步情况 -方式2：安装 npm install --save redux-promise  redux-promise 详细案例可见 getCinemaListAction.js
import reduxPromise from "redux-promise"
// 导入 redux-persist  redux 数据持久化 persistReducer数据持久化reducer   persistStore数据持久化存储 state
import { persistStore, persistReducer ,FLUSH,REGISTER,PAUSE,PERSIST,PURGE,REHYDRATE} from 'redux-persist'

// 导入 storage redux 数据持久化 往 localStorage 中存
import storage from 'redux-persist/lib/storage'

import CollapsedSlice from './actionCreators/CollapsedSlice'
import RequestStatusSlice from './actionCreators/RequestStatusSlice'
import userSlice from './actionCreators/userSlice'
import rightsSlice from './actionCreators/rightsSlice'
import MenuSlice from './actionCreators/MenuSlice'

// 合并 各自管理的多个reducer 函数 固定语法 必须写在{xxx:xxx,xxxx}中
const reducer = combineReducers({
    
    // 写法1：键名：键值
    CollapsedSlice: CollapsedSlice,// 该数据状态 为 持久化数据状态  下面persistConfig 中的白名单  声明了，其他的数据键名状态都不会持久化数据状态
    // 写法2：省略写法
    RequestStatusSlice,
    userSlice,// 个人信息
    rightsSlice,// 权限
    MenuSlice,//左侧菜单栏 
    // CinemaListReducer,
})
// redux-persist 数据持久化相关规则配置
const persistConfig = {
    // 存入localStorage的key 如：localStorage.setItem('key','111')
    key: 'redux',
    // storage 按照 localStorage 存
    storage,
    // 配置:例如黑名单,白名单等 不配置 默认combineReducers中的全部缓存
    // 黑名单 不缓存的黑名单里的 其他的都会持久化数据状态 TabBerReducer 就是 在 combineReducers 中 自己声明的键名 TabBerReducer
    // blacklist:['TabBerReducer'],
    // 白名单 只会缓存白名单里的 数据状态 其他的都不会持久化数据状态，需要缓存的 CityReducer 就是 在 combineReducers 中 自己声明的键名 CityReducer
    whitelist: ['CollapsedSlice','userSlice'],
}
// 持久化根 reducer  persistReducer数据持久化reducer
const persistedReducer = persistReducer(persistConfig, reducer);

// 配置 Redux 开启调试工具
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// 不是传入数据持久化 reducer 
// const store = createStore(reducer, /* preloadedState, */ composeEnhancers(applyMiddleware(reduxThunk,reduxPromise)));
// 传入数据持久化 persistedReducer （就是配置过的 reducer ） applyMiddleware 传入 多个中间件 两种异步处理方式都可以兼容
const store = configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
        serializableCheck:false,
            // serializableCheck:{
            //     //忽略了 Redux Persist 调度的所有操作类型。这样做是为了在浏览器控制台读取a non-serializable value was detected in the state时不会出现错误。
            //     ignoredActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER],
            // }
        }),

    });
 
//最外层要导入   persistStore数据持久化存储 state
let persistor = persistStore(store);

// 不开启 Redux 调试工具
// 不是传入数据持久化 reducer
// const store = createStore(reducer,applyMiddleware(reduxThunk,reduxPromise));
// 传入数据持久化 persistedReducer（就是配置过的 reducer ）
// const store = createStore(persistedReducer,applyMiddleware(reduxThunk,reduxPromise));

// 导出 persistor （ 使用persistStore 数据持久化存储的 状态 store
export { store, persistor };