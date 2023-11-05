import React ,{useCallback} from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
// 粒子动画效果
import MyParticles from '../../components/particles';
import styles from '../../assets/css/login.module.scss'
export default function Login() {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className={'gg-flex-1 gg-flex-2' + ' ' + styles.login_bg}>
      <MyParticles></MyParticles>
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
