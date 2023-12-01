import React ,{useCallback} from 'react'
import { LockOutlined, UserOutlined ,ReadOutlined} from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message,FloatButton } from 'antd';
// 粒子动画效果
import MyParticles from '../../components/particles';
import styles from '../../assets/css/login.module.scss'
// 导入 二次封装 axios 内包含了 获取 token 存入本地 + 发起请求携带token
import {useSelector,useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
// 状态管理 - 传入登录返回的个人信息
import {changeUserSlice} from '../../redux/actionCreators/userSlice';
import axios from 'axios';


export default function Login() {
  //状态管理 - 根据store.js中设置的reducer名字，从CollapsedSlice空间获取state
  // const {collapsed}=useSelector((state:any)=>{return state.CollapsedSlice});
  // 状态管理 - 设置
  const dispatch=useDispatch();

  // 跳转 导航
  const navigate=useNavigate();
  // console.log(collapsed)
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    axios({
      url: `/login`,
      method: 'post',
      // params:{...value}, //params 的形式传参数是url中 query
      data: { // data 的形式传参数 是在 body 体中
        ...values,
      },
      headers: { 'Content-Type': 'application/json' }
    }).then((res: any) => {
      if(res.data.Code==0){
        let {username} = res.data.Data
        // 编程式导航
        // navigate('/home',{state:{username:username}});
        navigate('/')
        dispatch(changeUserSlice({value:{...res.data.Data},type:'userInfo'}))
      }else{
        message.error(res.data.Message)
      }
    }).catch((err)=>{
      console.log(err)
  })
  };

  return (
    <div className={'gg-flex-1 gg-flex-2' + ' ' + styles.login_bg}>
        {/* 粒子动画效果 */}
      <MyParticles></MyParticles>
    {/* 悬浮按钮 */}
      <FloatButton
      shape="square"
      type="primary"
      tooltip={<>浏览新闻</>}
      style={{ right: 24 }}
      onClick={()=>{navigate('/tourist/news')}}
      icon={<ReadOutlined />}
    />
      {/* <div className={ styles.login_header}> <ReadOutlined title='浏览新闻' onClick={()=>{navigate('/tourist/news')}}/> </div> */}
      <div className={styles.login_formContainer}>
        <div className={styles.login_title}>全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          // initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
           
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
