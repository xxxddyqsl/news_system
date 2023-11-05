import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
// MyForm.propTypes = {}

function MyForm(props) {
   
    return (
        <>
            <Form
                form={props.form}
                layout={props.layout || "vertical"} // 布局方向 默认为 vertical 垂直方向 horizontal 为水平方向
                name="form_in_modal"
                // onFinish={props.onFinish}
                initialValues={{ modifier: 'public' }}
            >

                {/* 插槽 */}
                {props.children}
            </Form>
        </>
    )
}

export default MyForm
