
import  { useEffect, useMemo,useCallback, useState } from 'react'
import axios from 'axios';
import { useSelector,shallowEqual } from 'react-redux';
// lodash 处理js 数据的 第三方库  如 将 数据 按条件 进行分组 ： _.groupBy(data,item=>item.title) ,解释说明_.groupBy(数据,条件)
// import _ from 'lodash'

// import { useNavigate } from 'react-router-dom';
interface viewType{
    title:string;
    // 可如上声明属性，也可以将 剩下的属性可通过 任意属性 自定义键值类型（[name]） 和 自定义 键key (key值any任意类型) 如  [propName: string]: any;
    [propName:string]:any;
}
interface descType{
    publishState:number;
    LIMIT?:number;
    sortkey:string,
}
interface CountType {
    publishState:number;
}
interface newsCountType {
    title:string;
    news_count:number;
}
// 获取 统计出的 每个新闻类型 已发布的 数量
const getNewsCount  =  async (data:CountType)=>{
    try {
        const  res = await axios({
            url: `/api/newsCount`,
            method:'get',
            params:data,
            // params:{
            //   publishState:2,//发布状态 ：  小于等于 1 的数据 ，需要 不是 2 、3 未发布上线的数据
            // }
        });
        return res.data.Data;
      } catch (err) {
        console.log(err);
      }
   }
const getDescList =  async (data:descType)=>{
    try {
        const  res = await axios({
            url: `/api/newsDesc`,
            method:'get',
            params:data,
            // params:{
            //   publishState:2,//发布状态 ：  小于等于 1 的数据 ，需要 不是 2 、3 未发布上线的数据
            // //   LIMIT:10, // 要 多少条数据 不传 默认返回10条
            // sortkey:'view',//按 什么排序 star 或 view 
            // }
        });
        return res.data.Data;
      } catch (err) {
        console.log(err);
      }
   }
//    home 组件抽离 逻辑处理部分  自定义 hook
export function useHome() {
    //根据store.js中设置的reducer名字，从 userSlice 空间获取state
  const { userInfo } = useSelector((state: any) => state.userSlice, shallowEqual);
    // 浏览list数据
    const [viewList,setViewList]= useState<Array<viewType>>([]);
    // 点赞list数据
    const [starList,setStarList]= useState<Array<viewType>>([]);
    // 统计出的 每个新闻类型 已发布 (根据  字段 及其 字段状态 如当前 publishState:2  其他 auditState:2 也是可以 ) 的 数量
    const [newsCount,setNewsCount]= useState<Array<newsCountType>>([]);
    useEffect(()=>{
        axios({
            url: `/api/newsCount`,
            method:'get',
            params:{
                publishState:2
            },
            // params:{
            //   publishState:2,//发布状态 ：  小于等于 1 的数据 ，需要 不是 2 、3 未发布上线的数据
            // //   LIMIT:10, // 要 多少条数据 不传 默认返回10条
            // sortkey:'view',//按 什么排序 star 或 view 
            // }
        }).then(res=>console.log( res)).catch(error=>console.log( error))
        getNewsCount({publishState:2}).then(res=>setNewsCount(res))
        // console.log( userInfo)
        // 获取 view 浏览量列表 前10条
        getDescList({publishState:2,LIMIT:10, sortkey:'view',}).then(res=>setViewList(res))
        // 获取 star 点赞量列表 前10条
        getDescList({publishState:2,LIMIT:10, sortkey:'star',}).then(res=>setStarList(res))
    },[])
    return {
        viewList,
        starList,
        userInfo,
        newsCount,
    }
}
