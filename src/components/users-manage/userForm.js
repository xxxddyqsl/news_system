import React from 'react'
import { Form, Select ,Input } from 'antd'
export default function UserForm(props) {
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
                rules={props.isDisabledRegions?[]:[{ required: true , message: 'Please input the password of collection!' }]}
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

        </>
    )
}
