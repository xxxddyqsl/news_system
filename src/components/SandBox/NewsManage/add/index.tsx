import React from 'react'
import { Form, Input, Select } from 'antd';
import MyEditor from '../../../Editor';
export function NewsBasicInfo(props:any) {
  return (
    <>
      <Form.Item label="新闻标题"
        name="title"
        rules={[{ required: true, message: 'Please input your title !' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="新闻分类"
        name="categoryId"
        rules={[{ required: true, message: 'Please input your category !' }]}
      >
        {/* 新闻分类 下拉 列表 */}
        <Select
          // defaultValue="lucy"
          // style={{ width: 120 }}
          onChange={props.handleChangeCategory}
          options={props.CategoryList}
          //自定义 label value
          fieldNames={{ label: 'title', value: 'id' }}
        />
      </Form.Item>
    </>
  )
}

// Editor 富文本编辑器
export const NewsContent = () => <>
<MyEditor></MyEditor>
  {/* <Form.Item label="新闻标题"
    name="title"
    rules={[{ required: true, message: 'Please input your title !' }]}
  >
    <Input />
  </Form.Item>
  <Form.Item label="新闻分类"
    name="categoryId"
    rules={[{ required: true, message: 'Please input your category !' }]}
  >
    <Input />
  </Form.Item> */}
</>