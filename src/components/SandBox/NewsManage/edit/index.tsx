import React from 'react'
import MyEditor from '../../../Editor';
// PageHeader 在antd 5.0 中 已废弃组件 单独 安装 yarn add @ant-design/pro-layout 做兼容
import { PageHeader } from '@ant-design/pro-layout'
import {  Steps, Form, Input, Select,  } from 'antd';
import MyForm from '../../../form';

// 撰写新闻 + 更新新闻共用组件
export function NewsBasicInfoEdit(props: any) {
  return (
    <>
        <PageHeader
          className="site-page-header"
          // onBack={() => null}
          // title={"撰写新闻"} // 主标题
          // subTitle="This is a subtitle" // 副标题
          {...props.configuration}
        />
        <Steps
          current={props.current}
          items={props.items}
        />
        <div className={props.styles.main}>
          <div className={props.current === 0 ? '' : props.styles.active}>
          <MyForm  {...props.layout} form={props.newsForm} name={'newsForm'}>
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
      </MyForm>
          </div>
          <div className={props.current === 1 ? '' : props.styles.active} style={{ height: '100%',border:'1px solid rgb(204, 204, 204)' }}>
            {/* <NewsContent></NewsContent> */}
            <MyEditor getContent={(value: any) => { props.setEditorContent(value) }} editorContent={props.editorContent}></MyEditor>
          </div>
          {/* <div className={props.current === 2 ? '' : props.styles.active}>333</div> */}

        </div>
          {/*  通过-插槽 props.children  底部按钮 */}
        {props.children}
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