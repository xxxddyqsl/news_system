import React, { useEffect, useState ,} from 'react'
import {
    LoadingOutlined,
    PlusOutlined,
} from '@ant-design/icons'
import { Form, Select, Input, Upload ,Avatar} from 'antd'
import { BASE_URL } from '../../util/request_http'
export default function UserForm (props) {
    return (
        <>
            <Form.Item
                name="username"
                label="用户名"
                // rules为表单 校验的一些信息 如 正则表达式  required 表是否为必填项 true 必填  message 提示文字 等等
                rules={[{ required: true, message: 'Please input the username of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                // rules为表单 校验的一些信息 如 正则表达式  required 表是否为必填项 true 必填  message 提示文字 等等
                rules={[{ required: true, message: 'Please input the password of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                // 角色roleId为 超级管理员 isDisabledRegions 为禁用状态，不设置rules 配置空数组 非必填项 ，否则 必填项 ，rules为表单 校验的一些信息 如 正则表达式  required 表是否为必填项 true 必填  message 提示文字 等等
                rules={props.isDisabledRegions ? [] : [{ required: true, message: 'Please input the password of collection!' }]}
            >
                <Select
                    disabled={props.isDisabledRegions}
                    // defaultValue="lucy"
                    // style={{ width: 120 }}
                    onChange={props.handleChangeRegion}
                    options={props.regionsList} />
            </Form.Item>

            <Form.Item
                name="roleid"
                label="角色"
                // rules为表单 校验的一些信息 如 正则表达式  required 表是否为必填项 true 必填  message 提示文字 等等
                rules={[{ required: true, message: 'Please input the password of collection!' }]}
            >
                {/* 角色下拉 列表 */}
                <Select
                    // defaultValue="lucy"
                    // style={{ width: 120 }}
                    onChange={props.handleChangeRoles}
                    options={props.rolesList}
                    //自定义 label value
                    fieldNames={{ label: 'roleName', value: 'id' }}
                />
            </Form.Item>
            {props.children}
        </>
    )
}
export function SetUserInfo (props) {
    
    const [imageUrl, setImageUrl] = useState(props.userInfo.avatar?BASE_URL+props.userInfo.avatar:null);
 
    useEffect(()=>{
        setImageUrl(props.userInfo.avatar?BASE_URL+props.userInfo.avatar:null);
        // console.log(props.userInfo ,imageUrl ,props.fileList)
    },[props.userInfo])
    useEffect(()=>{
        // 说明 关闭了 model  清空了 文件上传input fileList 状态
        if(props.fileList.length<=0){
            setImageUrl(props.userInfo.avatar?BASE_URL+props.userInfo.avatar:null);
        }
        // console.log(props.userInfo ,imageUrl ,props.fileList)
    },[props.fileList])
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
        const uploadButton = (
            <div>
                <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          );
    return (
        <>
            <Form.Item
                name="avatar"
                label="头像"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                        return e;
                    }
                    return e?.fileList;
                }}
            >
                <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    fileList={props.fileList}
                    multiple={false}// 不支持多个文件
                    accept="image/png, image/jpg"
                    maxCount={1} //通过 maxCount 限制上传数量
                    // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={(file) => {
                        // console.log(file);
                        // beforeUpload 返回 false 后，手动上传文件。否则会自动上传文件
                        return false;
                    }}
                    // onPreview={(file) => {
                    //     // 点击文件链接或预览图标时的回调
                    //     // console.log(file)
                    // }}
                    onChange={async (info) => {//上传文件改变时的回调，上传每个阶段都会触发该事件。详见
                        let url = await getBase64(info.file||info.fileList[0].originFileObj);
                        // console.log(info,url)
                        props.setFileList(info.fileList);
                        setImageUrl(url)
                    }}
                >
                      {imageUrl ?<Avatar size="large" src={imageUrl} style={{width:'100%',height:'100%'}} />  : uploadButton}
                    {/* <PlusOutlined /> */}
                </Upload>
            </Form.Item>
            <Form.Item
                name="username"
                label="用户名"
                // rules为表单 校验的一些信息 如 正则表达式  required 表是否为必填项 true 必填  message 提示文字 等等
                rules={[{ required: true, message: 'Please input the username of collection!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                // rules为表单 校验的一些信息 如 正则表达式  required 表是否为必填项 true 必填  message 提示文字 等等
                rules={[{ required: false, message: 'Please input the password of collection!' }]}
            >
                <Input />
            </Form.Item>

            {props.children}
        </>
    )
}
