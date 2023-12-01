import React, { Component } from 'react'
// 其实就是把富文本里面的图片重新包装了一下返回了
export const myBlockRenderer = (contentBlock: any) => {
    const type = contentBlock.getType()
    // 图片类型转换为mediaComponent
    if (type === 'atomic') {
        return {
            component: Media,
            editable: false,
            props: {
                foo: 'bar',
            },
        }
    }
}
class Media extends Component<any> {
    render(): React.ReactNode {
        const { block, contentState } = this.props
        const data = contentState.getEntity(block.getEntityAt(0)).getData();
        console.log('Media==>',data)
        // 含有空格的字符串
        const emptyHtml = ' ';
        return (
            <div>
                {emptyHtml}
                <img
                    src={data.src}
                    alt={data.alt || ''}
                    style={{
                        height: data.height || 'auto',
                        width: data.width || 'auto',
                        maxWidth:'100%',
                    }}
                ></img>{emptyHtml}
            </div>
        )
    }
}
