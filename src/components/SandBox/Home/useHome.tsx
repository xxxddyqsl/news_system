
import  { useEffect, useMemo,useCallback, useState } from 'react'
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

import axios from 'axios';
import { useSelector,shallowEqual ,useDispatch} from 'react-redux';
import { changeUserSlice } from '../../../redux/actionCreators/userSlice';
// lodash 处理js 数据的 第三方库  如 将 数据 按条件 进行分组 ： _.groupBy(data,item=>item.title) ,解释说明_.groupBy(数据,条件)
import _ from 'lodash'

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
interface UsePublishType {
    id:number;
    publishState:number;
}
// 获取 所有新闻 统计出的 每个新闻类型 已发布的 数量
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
   // 获取 view 或 star 浏览量列表 前10条
const getDescList =  async (data:descType)=>{
    try {
        const  res = await axios({
            url: `/api/newsDesc`,
            method:'get',
            params:data,
            // params:{
            //   publishState:2,//发布状态 ：  小于等于 1 的数据 ，需要 不是 2 、3 未发布上线的数据
            // //   LIMIT:10, // 要 多少条数据
            // sortkey:'view',//按 什么排序 star 或 view 
            // }
        });
        return res.data.Data;
      } catch (err) {
        console.log(err);
      }
   }
const getUsePublish= async({id,publishState}:UsePublishType)=>{
    try {
        const  res = await axios({
            url: `/api/publish`,
            method: 'get',
            params: {
                authorId: id,
                publishState: publishState,//2已发布上线
            }
        });
    //    console.log( _.groupBy(res.data.Data,item=>item.category.title))
        return res.data.Data;
      } catch (err) {
        console.log(err);
      }
}
// 修改 个人信息
const  uploadUseInfo= async({data}:any)=>{
    try {
        const  res = await axios({
            url: `/api/useInfo`,
            method: 'post',
            // 声明 传入数据的 编码格式 当前提交内容包含了 文件 需要修改提交编码格式："multipart/form-data"
            headers: { 'Content-Type': "multipart/form-data" },
            data: data
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
  const  dispatch = useDispatch()
    // 浏览list数据
    const [viewList,setViewList]= useState<Array<viewType>>([]);
    // 点赞list数据
    const [starList,setStarList]= useState<Array<viewType>>([]);
    // 所有新闻 统计出的 每个新闻类型 已发布 (根据  字段 及其 字段状态 如当前 publishState:2  其他 auditState:2 也是可以 ) 的 数量
    const [newsCount,setNewsCount]= useState<Array<newsCountType>>([]);
    // 获取 自己发布的所有新闻
    const [allList,setAllList]= useState<Array<object>>([]);
    // Drawer 抽屉 组件显示
    const [open, setOpen] = useState<boolean>(false);
    // model组件
    const [useOpen,setUserOpen]= useState<boolean>(false);

    const [fileList, setFileList] = useState([]);

    useEffect(()=>{
           // 获取 自己发布的所有新闻 publishState 0默认状态未发布 1待发布 2已上线 3已下线
        getUsePublish({id:userInfo.id,publishState:2}).then(res=>setAllList(res))
        // 获取 所有新闻 统计出的 每个新闻类型 已发布的 数量
        getNewsCount({publishState:2}).then(res=>setNewsCount(res))
        // console.log( userInfo)
        // 获取 view 浏览量列表 前10条
        getDescList({publishState:2,LIMIT:10, sortkey:'view',}).then(res=>setViewList(res))
        // 获取 star 点赞量列表 前10条
        getDescList({publishState:2,LIMIT:10, sortkey:'star',}).then(res=>setStarList(res))
    },[])
    // Drawer 抽屉 组件显示
    const showDrawer = () => {
      setOpen(true);
    };
   // Drawer 抽屉 组件隐藏
    const onClose = () => {
      setOpen(false);
    };
    const showUpUser=(v:boolean,updateForm?:any)=>{
        setUserOpen(v);
        
        if(v&&updateForm){
            // 清空 表单 数据
            // updateForm.resetFields();
            updateForm.setFieldValue('username',userInfo.username)
        }
        
    }

    const handleUpdateOk= (updateForm:any)=>{
         //获取 表单 内容
    updateForm.validateFields().then( async  (value: any) => {
        // console.log(value,)
       // 前后端分离 - 通过 FormData 表单的方式添加数据 上传文件
       let params = new FormData();
       let files =value.avatar;
       if(files) {
        // 添加 传给后端的数据
        params.append('avatar', files[0].originFileObj);
       };
         params.append('id', userInfo.id);
         params.append('username', value.username);
        //  .replace(/\s+/g, "") 去除空格
        if(value.password &&  value.password.replace(/\s+/g, "")!==''){
            params.append('password ', value.password);
        }
        // 调用接口 - 返回个人信息 - 更新 redux 个人信息状态
         uploadUseInfo({data:params}).then(res=>{dispatch(changeUserSlice({value:{...res},type:'userInfo'}))})
         showUpUser(false)
    }).catch((err:any) => console.log(err))
    }
 
    return {
        viewList,
        starList,
        userInfo,
        newsCount,
        open,
        allList,
        showDrawer,
        onClose,
        useOpen,
        showUpUser,
        handleUpdateOk,fileList, setFileList
    }
}
