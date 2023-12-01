import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
// 解决Unknown DraftEntity key null 插入图片，再输入会报错问题
 import { myBlockRenderer } from './customBlockRenderFunc'
const uploadCallback = (files: any) => {
    // 返回值 files 就是上传的文件，控件会默认 Promise 返回，否则无法抓到返回的已上传图片链接
    return new Promise((resolve, rejects) => {
        // 获取图片 url
        let fileURl= URL.createObjectURL(files)
        console.log(fileURl)
        resolve({ data: { link: fileURl } })
    })
}
const setToolbar = {
    image: {
            // icon: image,
        urlEnabled: true,
        uploadEnabled: true,
        alignmentEnabled: true,
        uploadCallback: uploadCallback,//本地图片
        previewImage: true,
        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png',
        alt: { present: true, mandatory: false ,previewImage:true},
        // 富文本中默认的图片尺寸，或写入到生成img标签的行间样式
        defaultSize: {
            height: 'auto',
            width: 'auto',
        },
    },
}

// Editor 使用demo 地址 https://jpuri.github.io/react-draft-wysiwyg/#/demo,https://jpuri.github.io/react-draft-wysiwyg/#/docs
export default function MyEditor(props: any) {
    const [editorState, setEditorState] = useState<any>('')
    useEffect(() => {
        // let aa= ``
        // 传入的html 转 Draft
        let html = props.editorContent
        if (html === undefined) return
        const contentBlock = htmlToDraft(html)
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
            )
            const editorStateContent =
                EditorState.createWithContent(contentState)
            console.log('htmlToDraft==>', contentState, editorStateContent)

            setEditorState(editorStateContent)
        }
    }, [props.editorContent])
    return (
        <>
            {/* 受控组件 -  */}
            <Editor
                editorState={editorState} // 初始值
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                customBlockRenderFunc={myBlockRenderer}
                localization={{
                    locale:'zh'
                }}
                onEditorStateChange={(editorState) =>
                    setEditorState(editorState)
                } // 内容发生改变时 重新设置状态- 受控
                onBlur={() => {
                    if (!editorState || editorState.length <= 0) {
                        return
                    }
                    // 失去焦点时 - 将 editorState 内容 传给父组件
                    console.log(
                        editorState.getCurrentContent(),
                        convertToRaw(editorState.getCurrentContent())
                    )
                    // editorState.getCurrentContent() 获取当前内容
                    // convertToRaw函数 转换格式
                    // draftToHtml 函数 转为html
                    //  console.log()
                    props.getContent(
                        draftToHtml(
                            convertToRaw(editorState.getCurrentContent())
                        )
                    )
                }}
                toolbar={setToolbar}
            />
        </>
    )
}
