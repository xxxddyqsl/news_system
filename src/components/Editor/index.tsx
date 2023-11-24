import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {  EditorState,convertToRaw ,ContentState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

// Editor 使用demo 地址 https://jpuri.github.io/react-draft-wysiwyg/#/demo,https://jpuri.github.io/react-draft-wysiwyg/#/docs
export default function MyEditor(props: any) {
  const [editorState,setEditorState]=useState<any>('');
  useEffect(()=>{
    // let aa= ``
    // 传入的html 转 Draft
    let html =props.editorContent;
    if(html === undefined ) return ;
    const contentBlock = htmlToDraft(html);
    if(contentBlock){
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorStateContent = EditorState.createWithContent(contentState);
      console.log('htmlToDraft==>',contentState, editorStateContent)

      setEditorState(editorStateContent);
    }
  },[props.editorContent])
  return (
    <>
    {/* 受控组件 -  */}
      <Editor
        editorState={editorState} // 初始值
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(editorState)=>setEditorState(editorState)}// 内容发生改变时 重新设置状态- 受控
        onBlur={()=>{
          if(!editorState||editorState.length<=0){ return }
          // 失去焦点时 - 将 editorState 内容 传给父组件
          console.log(editorState.getCurrentContent(),convertToRaw(editorState.getCurrentContent()))
          // editorState.getCurrentContent() 获取当前内容
          // convertToRaw函数 转换格式
          // draftToHtml 函数 转为html
        //  console.log()
         props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}

      />
    </ >
  )
}
