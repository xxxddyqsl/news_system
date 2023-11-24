import { useEffect, useState, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from '../../../assets/css/publish-manage/publish.module.scss'
import { notification } from 'antd';
import axios from 'axios'
interface propsType{
    publishState:Number;
    // 可如上声明属性，也可以将 剩下的属性可通过 任意属性 自定义键值类型（[name]） 和 自定义 键key (key值any任意类型) 如  [propName: string]: any;
    [propName:string]:any;
}

// 自定义 hooks 抽出 发布管理中 1待发布 2已上线 3已下线 组件中的  一些公共的逻辑  - publishState 0默认状态未发布 1待发布 2已上线 3已下线
function usePublished({publishState,NewButtonFn}:propsType) {
    //根据store.js中设置的reducer名字，从 userSlice 空间获取state
    const { userInfo } = useSelector((state: any) => state.userSlice, shallowEqual);
    const navigate = useNavigate();
    // 获取 div 元素 获取高 传入 table 设置table 设置属性  scroll={{y: 100}} 超出滚动
    const refElem = useRef<any>();
    const [warperRef, setWarperRef] = useState();
    const [dataSource, setDataSource] = useState([]);
    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title: any, record: any,) => {
                return <div style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => {
                    console.log(record.id)
                    navigate(`/news-manage/preview`, { state: { id: record.id } })
                }}>{title}</div>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category: any, record: any, index: any) => { // 自定义渲染函数 表格内容 参数的形式传入, 必须return 返回 否则ts报错
                // console.log(id,record)
                return <div>{category.title}</div>
            }
        },
        {
            title: '操作',
            render: (item: any,) => { // 此处 dataIndex 未和数据字段的 属性绑定 因此只有一个返回值 返回当前行的数据
                return <div>
                    {/* 调用 传入的 NewButton 函数  渲染出来 button 组件 并且将item 传入 点击时调用*/}
                    {NewButtonFn(item)}
                </div>
            }
        },
    ]
    useEffect(() => {
        // publishState 0默认状态未发布 1待发布 2已上线 3已下线
        if (userInfo.id)
            axios({
                url: `/api/publish`,
                method: 'get',
                params: {
                    authorId: userInfo.id,
                    publishState: publishState,//2已发布上线
                }
            }).then(res => {
                let data = res.data.Data;
                setDataSource(data)
            }).catch(err => console.log(err))
    }, [userInfo.id])
    // 自定义 table 配置
    const configurationTable = {
        // components: components, // table - 可编辑单元格,配置
        columns: columns, // table 头
        pagination: {
            pageSize: 5,// 每页显示几条
        },
        dataSource: dataSource,// table 数据
    }
     // 新闻发布
     const handlePublish = (item:any)=>{
        // 新闻 id
        let newsId = item.id;
        // publishState 0默认状态未发布 1待发布 2已上线 3已下线 2为发布上线 和 发布 publishTime 时间戳
        let data = {
          publishState: 2,
          publishTime: Date.now(), // 获得当前的时间戳
        }
        let url = `/api/news/${newsId}`;
          let method = 'patch';
        handlePatchNews(url,method,newsId,data);
     }
     // 新闻下线 
     const handleSunset = (item:any)=>{
          // 新闻 id
          let newsId = item.id;
          // publishState 0默认状态未发布 1待发布 2已上线 3已下线 
          let data = {
            publishState: 3,
          }
          let url = `/api/news/${newsId}`;
          let method = 'patch';
          handlePatchNews(url,method,newsId,data);
        console.log('handleSunset',item)
     }
    // 删除新闻
    const  handleDelete =(item:any)=>{
        // 新闻 id
        let newsId = item.id;
        //   newsDele:0, 默认0 未被删除 1已删除
        let data = {
            id: newsId,
        }
        let url='/api/news';
        let method = 'delete';
        handlePatchNews(url,method,newsId,data);
        console.log('handleDelete',item)
    }
    // 调用 接口
    const handlePatchNews = (url:string,method:string,newsId:number,data:any)=>{
          //    更新数据
          axios({
            url:url,
            method:method,
            data: data,
          }).then(res => {
            // console.log(res)
            if(res.data.Code === 0 ){
                setDataSource(dataSource.filter((Ktem:any)=>Ktem.id !== newsId));
                let text = `${data.publishState? ( (data.publishState===2?'您可以到【发布管理/已发布':'您可以到【发布管理/已下线') +'】中查看您的新闻'):'您已经删除了已下线的新闻'}`;
                notification.info({
                    message: `通知`,
                    description: text,
                    placement: 'bottomRight', // bottomRight 在右下角显示 默认为右上角
                  })
            }
          }).catch((err) => {
            console.log(err)
          });
    }
    //导出
    return {
        styles,
        refElem,
        setWarperRef,
        warperRef,
        configurationTable,
        handleDelete,
        handleSunset,
        handlePublish,
    }
}
export default usePublished