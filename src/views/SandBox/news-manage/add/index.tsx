import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

// PageHeader 在antd 5.0 中 已废弃组件 单独 安装 yarn add @ant-design/pro-layout 做兼容
import { PageHeader } from '@ant-design/pro-layout'
import { Button, Steps, Form, Input, Select, message, notification } from 'antd';

import styles from '../../../../assets/css/news-manage/add.module.scss'
import MyForm from '../../../../components/form';
import { NewsBasicInfo, NewsContent } from '../../../../components/SandBox/NewsManage/add';
import { $axios } from '../../../../util/request';
import MyEditor from '../../../../components/Editor';
import { useSelector, shallowEqual } from 'react-redux';

// ts 接口 约束 路由配置属性
interface StepsDataType {
  title: string;
  description: string;
  subTitle?: string; //可选字段
}
const items: Array<StepsDataType> = [
  {
    title: '基本信息',
    description: '新闻标题，新闻分类',
  },
  {
    title: '新闻内容',
    description: '新闻主体内容',
    // subTitle: 'Left 00:00:08',
  },
  {
    title: '新闻提交',
    description: '保存草稿或者提交审核',
  },
]
const layout = {
  // labelCol:{span:4}, // label 标题占的比例 为栅格系统 24 份 当前标题为占 4
  // wrapperCol:{span:20},// 内容区域 如 input 当前为占 20
  layout: 'horizontal',// 布局方向 默认为 vertical 垂直方向 horizontal 为水平方向
}
// 获取 年月日 时分秒 format('YYYY-MM-DD hh:mm:ss', new Date())
function format(format: string, fdate: any) {
  var args: any = {
    "Y+": fdate.getFullYear(),
    "M+": fdate.getMonth() + 1,
    "D+": fdate.getDate(),
    "h+": fdate.getHours(),
    "m+": fdate.getMinutes(),
    "s+": fdate.getSeconds(),
    "q+": Math.floor((fdate.getMonth() + 3) / 3),  //quarter
    "S": fdate.getMilliseconds()
  };
  if (/(Y+)/.test(format))
    format = format.replace(RegExp.$1, (fdate.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var i in args) {
    var n = args[i];
    if (new RegExp("(" + i + ")").test(format))
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
  }
  return format;
};
// 新闻管理 -撰写新闻 组件
export default function NewsAdd() {
  //根据store.js中设置的reducer名字，从 userSlice 空间获取state
  const { userInfo } = useSelector((state: any) => state.userSlice, shallowEqual);
  // current 撰写新闻的当前步骤  0 - 2
  const [current, setCurrent] = useState<number>(0);
  // 表单内容
  const [formInfo, setFormInfo] = useState<object>();
  // antd 内部封装的 获取form 表单函数 ， form 返回一个对象 内包含了 submit 提交 ，获取value 等等函数
  const [newsForm] = Form.useForm();
  const [CategoryList, setCategoryList] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const navigate = useNavigate();
  const handleChangeCategory = (value: number, newForm: any) => {
    console.log(value, newForm)
  }
  const handleNext = () => {
    if (current === 0) {
      // 点击确认 - 获取 form 表单 数据 -默认校验 必填项 是否有值，
      newsForm.validateFields().then((value: any) => {
        setCurrent(current + 1)
        setFormInfo(value)
      }).catch((err: any) => {
        // 必填项缺失
        // console.log('catch==>',err)
        message.error(err.errorFields[0].errors.join(','))
      })
    } else {
      // 校验 editorContent 富文本内容
      if (editorContent === '' || editorContent.trim() === '<p></p>') {
        message.error(`Please input your  editor Content !`)
      }
      console.log(editorContent);
      setCurrent(current + 1)

    }
  }
  useEffect(() => {
    // 获取新闻类别
    $axios({
      url: `/api/newsCategories`,
      method: 'get',
    }).then(res => {
      let data = res.data.Data;
      setCategoryList(data)
      console.log(res)
    }).catch((err) => {
      console.log(err)
    });
  }, [])
  // 保存草稿
  const handleSave = (auditState: number) => {
    let data = {
      ...formInfo,
      content: editorContent.replace(/"/g, "'"),
      region: userInfo.region,// 发布人 区域
      author: userInfo.username, // 发布人name
      authorId: userInfo.id,// 发布人id
      roleId: userInfo.roleid,
      auditState: auditState,// auditState 0 为保存草稿  1为提交审核
      publishState: 0,
      createTime: Date.now(), // 获得当前的时间戳
      star: 0,
      view: 0,
      publishTime: null,
    }
    // 提交数据库
    $axios({
      url: `/api/newsSavedraft`,
      method: 'post',
      data: data,
    }).then(res => {
      console.log(res)
      if (res.data.Code === 0) {
        // auditState 0 为保存草稿 跳转到 草稿箱  1为提交审核 跳转到审核列表
        navigate(auditState === 0 ? '/news-manage/drafts' : '/audit-manage/list')
        // Notification 通知提醒框
        notification.info({
          message: `通知`,
          description: `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
          placement: 'bottomRight', // bottomRight 在右下角显示 默认为右上角
        })
      }
    }).catch((err) => {
      console.log(err)
    });
  }
  return (
    <div className={styles.wrapper + ' gg-flex-4 gg-flex-2'}>
      <PageHeader
        className="site-page-header"
        // onBack={() => null}
        title="撰写新闻" // 主标题
      // subTitle="This is a subtitle" // 副标题
      />
      <Steps
        current={current}
        items={items}
      />
      <div className={styles.main}>
        <div className={current === 0 ? '' : styles.active}>
          <MyForm  {...layout} form={newsForm} name={'newsForm'}>
            <NewsBasicInfo CategoryList={CategoryList} handleChangeCategory={handleChangeCategory}></NewsBasicInfo>
          </MyForm>
        </div>
        <div className={current === 1 ? '' : styles.active} style={{ height: '100%' }}>
          {/* <NewsContent></NewsContent> */}
          <MyEditor getContent={(value: any) => { setEditorContent(value) }}></MyEditor>
        </div>
        <div className={current === 2 ? '' : styles.active}>333</div>

      </div>
      <div className={styles.footer}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={() => handleSave(0)}> 保存草稿</Button>
            <Button danger onClick={() => handleSave(1)}> 提交审核</Button>
          </span>
        }
        {current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>}
        {current > 0 && <Button onClick={() => { setCurrent(current - 1) }}>上一步</Button>}
      </div>
    </div>
  )
}
