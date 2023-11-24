import React, { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'

import { Button, Form, message, notification } from 'antd';

import styles from '../../../../assets/css/news-manage/newsEdit.module.scss'
import MyForm from '../../../../components/form';
import { NewsBasicInfoEdit, NewsContent } from '../../../../components/SandBox/NewsManage/edit';
import axios from 'axios'
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
export default function NewsUpdate(props: any) {
  // useParams()  编程式导航 获取  search参数 形式：/home?id=1&&name=aa 如： navigate(`home?id=${id}&&name=${name}`);
  // 获取新闻 id
  const newsId = useParams();
  const [newInfo, setNewInfo] = useState({})
  console.log(newsId)
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
  // 配置 PageHeader 属性 
  const configuration = {
    // 传入 返回
    onBack: () => {
      navigate(-1)
    },
    title: '更新新闻'
  }
  useEffect(() => {
    // 获取新闻信息
    axios({
      url: `/api/news/${newsId.id}`,
      method: 'get',
    }).then(res => {
      let data = res.data.Data;
      console.log(data)
      setNewInfo(data);
      // 设置 富文本编辑器 默认内容
      setEditorContent(data.content)
      // 获取到的 内容 设置 表单默认值
      newsForm.setFieldsValue({
        'title':data.title,
        'categoryId':data.categoryId,
      })
    }).catch((err) => {
      console.log(err)
    });
  }, [])
  const handleChangeCategory = (value: number, newForm: any) => {
    console.log(value, newForm)
  }
  const handleNext = () => {
    if (current === 0) {
      // 点击确认 - 获取 form 表单 数据 -默认校验 必填项 是否有值，
      newsForm.validateFields().then((value: any) => {
        setCurrent(current + 1);
        setFormInfo(value);
        console.log(value)
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
    axios({
      url: `/api/newsCategories`,
      method: 'get',
    }).then(res => {
      let data = res.data.Data;
      setCategoryList(data)
      // console.log(res)
    }).catch((err) => {
      console.log(err)
    });
  }, [])
  // 保存草稿 或 提交审核  auditState
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
    axios({
      url: `/api/news/${newsId.id}`,
      method: 'patch',
      data: data,
    }).then(res => {
      console.log(res)
      if (res.data.Code === 0) {
        // auditState 0 为保存草稿 跳转到 草稿箱  1为提交审核 跳转到审核列表
        navigate(auditState === 0 ? '/news-manage/drafts' : '/audit-manage/list')
        // Notification 通知提醒框
        notification.info({
          message: `通知`,
          description: `您可以到【${auditState === 0 ? '新闻管理/草稿箱' : '审核管理/审核列表'}】中查看您的新闻`,
          placement: 'bottomRight', // bottomRight 在右下角显示 默认为右上角
        })
      }
    }).catch((err) => {
      console.log(err)
    });
  }
  return (
    <div className={styles.wrapper + ' gg-flex-4 gg-flex-2'}>
      {/* 组件复用 - 撰写新闻 和 新闻更新 内容类似 这里使用 撰写新闻组件 加以改造*/}
      <NewsBasicInfoEdit
        configuration={configuration}
        current={current}
        items={items}
        CategoryList={CategoryList}
        styles={styles}
        layout={layout}
        newsForm={newsForm}
        editorContent={editorContent}
        setEditorContent={(value: any) => { setEditorContent(value) }}
      >
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
      </NewsBasicInfoEdit>
    </div>
  )
}
