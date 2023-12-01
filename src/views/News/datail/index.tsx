import React, { useEffect, useState } from 'react'
import {
    HeartTwoTone,
    
} from '@ant-design/icons'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Descriptions, message } from 'antd';
// PageHeader 在antd 5.0 中 已废弃组件 单独 安装 yarn add @ant-design/pro-layout 做兼容
import { PageHeader } from '@ant-design/pro-layout'
import axios from 'axios'
// moment格式化日期 模块
import moment from 'moment';

interface newInfoType {
  // author: string;
  // auditState?:any,
  // 接口返回的数据 有n个属性 一个个写不现实 自己需要用到的数据可通过上方的方式定义值类型取出 剩下的属性可通过 任意属性 自定义键值类型（[name]） 和 自定义 键key (key值any任意类型) 如  [propName: string]: any;
  [propName: string]: any
}
const  setNewsId= async (id:string|number,data:object)=>{
    try {
        const  res = await axios({
            url: `/api/tourist/news/${id}`,
            method: 'patch',
            data:data,
        });
        return res.data;
      } catch (err) {
        console.log(err);
      }
   }
// 游客查看 新闻详情
export default function Datail() {
  // 编程式导航 获取  state 参数 形式：不改变url，参数隐式传递 如： navigate('home',{state:{id:1,name:'aa'}});
//   const { state }: any = useLocation()
  // useParams()  编程式导航 获取  search参数 形式：/home?id=1&&name=aa 如： navigate(`home?id=${id}&&name=${name}`);
  const state = useParams();
//   console.log(state )
  const navigate = useNavigate();
  const [newInfo, setNewInfo] = useState<newInfoType>({});
//   记录 当前是否点过赞
  const [isStar,setIsStar] = useState<boolean>(false);
  useEffect(() => {
    // 获取新闻
    axios({
      url: `/api/tourist/news/${state.id}`,
      method: 'get',
    }).then(res => {
      let data = res.data.Data;
      setNewInfo({
        ...data,
      })
    //   setNewInfo({
    //     ...data,
    //     // 修改本地状态每次刷新 重新加载 view 浏览访问量 +1
    //     view:data.view+1
    //   })
    //   同步后端 - 在下一个 then中发起 请求 所有 return data
    return data
    }).then(data=>{
        // 上一个 then 请求成功 并且返回了data 发起请求 同步修改后端数据 浏览访问量
         // 调用接口 同步修改 新闻浏览访问量 将state.id as断言 为   string | number ， 每次刷新 重新加载 view 浏览访问量 +1
        setNewsId( state.id as string | number ,{view:data.view+1}).then(res=>{
            // 后端修改成功 - 修改本地状态
            if(res.Code === 0 ){
                setNewInfo({
                    ...data,
                     // 修改本地状态每次刷新 重新加载 view 浏览访问量 +1
                    view:data.view+1
                  })
            }
        });
       
    }).catch((err) => {
      console.log(err)
    });
  }, [state.id])
//   点赞
  const handleStar =()=>{
    let {star} = newInfo;
   if(isStar) return message.info(<>已经点过赞了</>)
  // 调用接口 同步修改 新闻star 点赞量  将state.id as断言 为   string | number ， 每次点击 star 点赞量 +1
  setNewsId( state.id as string | number ,{star:star+1}).then(res=>{
    // 后端修改成功 - 修改本地状态
    if(res.Code === 0 ){
        setNewInfo({
            ...newInfo,
             // 修改本地状态每次刷新 重新加载 star 点赞量 +1
             star:newInfo.star+1
          })
        // 
          setIsStar(true)
    }
});

  }
  return (
    <>
      {newInfo?.id&&<div>
        <PageHeader
        ghost={false}
        onBack={() => navigate(-1) //返回上一页
          // window.history.back()
        }
        title={newInfo.title}
        subTitle={<>{newInfo.category.title}<HeartTwoTone twoToneColor={isStar?"#eb2f96":''}
        style={{ marginLeft: '8px' }} onClick={()=>handleStar()}></HeartTwoTone></>}
      // extra={[
      //   <Button key="3">Operation</Button>,
      //   <Button key="2">Operation</Button>,
      //   <Button key="1" type="primary">
      //     Primary
      //   </Button>,
      // ]}
      >
        {/* // column={3} 一行显示 3个 超出自动换行 */}
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{newInfo.author}</Descriptions.Item>
          <Descriptions.Item label="发布时间">
              {/* 注意  YYYY-MM-DD HH:mm:ss'  HH 小写时 为12小时制的时间 大写为 24小时制的时间*/}
          <a style={{color:'#108ee9'}}>{newInfo.publishTime ?moment(newInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</a>
          </Descriptions.Item>
          <Descriptions.Item label="区域">
          <span style={{color:'#108ee9'}}> {newInfo.region===''?'全球':newInfo.region}</span>
          </Descriptions.Item>
          <Descriptions.Item label="访问数量">
          <span style={{color:'lime'}}>{newInfo.view}</span>
          </Descriptions.Item>
          <Descriptions.Item label="点赞数量">
          <span style={{color:'lime'}}>{newInfo.star}</span>
          </Descriptions.Item>
          <Descriptions.Item label="评论数量">
          <span style={{color:'lime'}}>{newInfo.comment}</span>
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <PageHeader
      // title={'新闻内容'}
      subTitle={'新闻内容'}
      >
        {/* 显示html 代码片段 */}
          <div dangerouslySetInnerHTML={{
            __html:newInfo.content
          }} style={{
            // margin:'0 24px',
            // margin:'0 12px',
            border:'1px solid #ccc',
            borderRadius:'4px',
            padding:'0 20px'
          }}>

        </div>
        </PageHeader>
      </div>}
    </>
  )
}
