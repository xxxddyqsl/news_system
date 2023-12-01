import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate,useLocation } from 'react-router-dom'

import { Button, Form, message, notification } from 'antd';

import styles from '../../../../assets/css/news-manage/newsEdit.module.scss'
import MyForm from '../../../../components/form';
import { NewsBasicInfoEdit, NewsContent } from '../../../../components/SandBox/NewsManage/edit';
import axios from 'axios'
import MyEditor from '../../../../components/Editor';
import { useSelector, shallowEqual } from 'react-redux';
import util from '../../../../util/util';
// 根据当前环境 返回 '/api' 或 ''
import { BASE_URL } from '../../../../util/request_http';


const  uploadEditorImage = async(formData:any)=>{
    try {
        // const  res = await axios.post('/api/uploadNewsImage', blobUrl, {
        //     headers: {
        //       'Content-Type': 'multipart/form-data'
        //     }  
        //   });
        const  res = await axios({
            url: `/api/uploadNewsImage`,
            method: 'post',
            // 声明 传入数据的 编码格式 当前提交内容包含了 文件 需要修改提交编码格式："multipart/form-data"
            headers: { 'Content-Type': "multipart/form-data" },
            data: formData
        });
        console.log(res);
        return res.data.Data;
      } catch (err) {
        console.log(err);
      }
}
const UploadEditorImg= (Content:string)=>{
    return new Promise(async (resolve, rejects) => {
    let par = new DOMParser();
    let doc = par.parseFromString(Content,'text/html');
    let imgurls= doc.body.querySelectorAll('img');
    // 获取所有的image src  blob:http: 为图片文件临时路径 - 在保存草稿 或 提交审核时 上传图片 获取真实路径
    for(let i=0; i< imgurls.length; i++){
        // 获取 临时路径 blob:http:
        let url = imgurls[i].getAttribute('src');
        // 遍历 包含 blob:http: 为临时路径 -进行上传服务器
        if(url?.includes('blob:http:')){
            // imgurls[i].setAttribute('title',`测试-${i}`)
            // （ base64 或  blob:http: ）临时路径 url 转 blob对象
            let res = await util.createObjectBlob({url});
            let formData = new FormData();
            //  blob对象  转  file 文件
            let file=  util.createObjectFile(res.blob,'用户上传的图片',res.blob.type)
            formData.append('newsImages',file)
            // 调用接口上传数据库
           let src= await uploadEditorImage(formData);
        //修改 html 替换为服务器返回真实路径
           imgurls[i].setAttribute('src',BASE_URL+src)
        }
    }
    let html = doc.body.innerHTML;
    // console.log(srcArr,html)
    // 返回 html
    resolve(html)
})
}
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
export default function NewsAdd(props: any) {
    const Location = useLocation();
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
    // onBack :()=>{
    //     navigate(-1)
    // },
    title:'撰写新闻'
}
  const handleChangeCategory = (value: number, newForm: any) => {
    console.log(value, newForm)
  }
  const handleNext = async () => {
     
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
      console.log(editorContent,Location)
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
      console.log(res)
    }).catch((err) => {
      console.log(err)
    });
  }, [])
  // 保存草稿
  const handleSave = async (auditState: number) => {
      //   断言 为 string - 优先 上传 编辑器 中 img 图片 - 返回html字符串
      const imgUploadHtml= await UploadEditorImg(editorContent) as string
    //   更新状态
      setEditorContent(imgUploadHtml);
      console.log('imgUploadHtml===>', imgUploadHtml);
    let data = {
      ...formInfo,
      content: imgUploadHtml.replace(/"/g, "'"),
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
    console.log(data)
    // 提交数据库
    axios({
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
          description: `您可以到【${auditState === 0 ? '新闻管理/草稿箱' : '审核管理/审核列表'}】中查看您的新闻`,
          placement: 'bottomRight', // bottomRight 在右下角显示 默认为右上角
        })
      }
    }).catch((err) => {
      console.log(err)
    });
  }
//   console.log(props)
// uploadCallback
  return (
    <div className={styles.wrapper + ' gg-flex-4 gg-flex-2'}>
      <NewsBasicInfoEdit
        configuration={configuration}
        current={current}
        items={items}
        CategoryList={CategoryList}
        styles={styles}
        layout={layout}
        editorContent={editorContent}
        newsForm={newsForm}
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
