import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Descriptions } from 'antd';
// PageHeader 在antd 5.0 中 已废弃组件 单独 安装 yarn add @ant-design/pro-layout 做兼容
import { PageHeader } from '@ant-design/pro-layout'
import { $axios } from '../../../../util/request';
// moment格式化日期 模块
import moment from 'moment';



// 枚举 - 对应 审核状态
const auditStateList = {
  0:'未审核', // 说明是草稿
  1:'正在审核',
  2:'审核通过',
  3:'审核未通过',
}
// 枚举 - 对应 发布状态
const publishStateList={
  0:'未发布',
  1:'待发布',
  2:'已上线',
  3:'已下线',
}

interface newInfoType {
  // author: string;
  // auditState?:any,
  // 接口返回的数据 有n个属性 一个个写不现实 自己需要用到的数据可通过上方的方式定义值类型取出 剩下的属性可通过 任意属性 自定义键值类型（[name]） 和 自定义 键key (key值any任意类型) 如  [propName: string]: any;
  [propName: string]: any
}
// 新闻预览
export default function Preview() {
  // 编程式导航 获取  state 参数 形式：不改变url，参数隐式传递 如： navigate('home',{state:{id:1,name:'aa'}});
  const { state }: any = useLocation()
  // useParams()  编程式导航 获取  search参数 形式：/home?id=1&&name=aa 如： navigate(`home?id=${id}&&name=${name}`);
  // console.log(state)
  const navigate = useNavigate();
  const [newInfo, setNewInfo] = useState<newInfoType>({})
  useEffect(()=>{
    console.log(newInfo.length)
  },[newInfo])
  useEffect(() => {
    // 获取新闻类别
    $axios({
      url: `/api/news/${state.id}`,
      method: 'get',
    }).then(res => {
      let data = res.data.Data;
      setNewInfo(data)
      console.log(data)
    }).catch((err) => {
      console.log(err)
    });
  }, [])
  return (
    <>
      {newInfo?.id&&<div>
        <PageHeader
        ghost={false}
        onBack={() => navigate(-1) //返回上一页
          // window.history.back()
        }
        title={newInfo.title}
        subTitle={newInfo.category.title}
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
          <Descriptions.Item label="创建时间">
            {/* 注意  YYYY-MM-DD HH:mm:ss'  HH 小写时 为12小时制的时间 大写为 24小时制的时间*/}
            <a>{newInfo.createTime ?moment(newInfo.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</a>
          </Descriptions.Item>
          <Descriptions.Item label="发布时间">
          <a>{newInfo.publishTime ?moment(newInfo.publishTime).format('YYYY-MM-DD HH:mm:ss') : '-'}</a>
          </Descriptions.Item>
          <Descriptions.Item label="区域">
            {newInfo.region===''?'全球':newInfo.region}
          </Descriptions.Item>
          <Descriptions.Item label="审核状态" style={{color:'red'}}>
            {/* ts 报错 Ts中string、number和any等类型 不能当做索引用   */}
            <span style={{color:'red'}}>{(auditStateList as any )[newInfo.auditState]}</span>
          </Descriptions.Item>
          <Descriptions.Item label="发布状态" style={{color:'red'}}>
            <span style={{color:'red'}}>{(publishStateList as any )[newInfo.publishState]}</span>
          </Descriptions.Item>
          <Descriptions.Item label="访问数量">
          <span style={{color:'#55871d'}}>{newInfo.view}</span>
          </Descriptions.Item>
          <Descriptions.Item label="点赞数量">
          <span style={{color:'#55871d'}}>{newInfo.star}</span>
          </Descriptions.Item>
          <Descriptions.Item label="评论数量">
          <span style={{color:'#55871d'}}>{newInfo.comment}</span>
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
