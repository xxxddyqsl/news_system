import React from 'react'
import PropTypes from 'prop-types'
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
// 404 页
function NotFound(props: any) {
  const navigate = useNavigate();
  const goBack=(path:string)=>{
    navigate((path||'/home'),{replace:true})
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={()=>{goBack('')}}>Back Home</Button>}
    />
  )
}

NotFound.propTypes = {}

export default NotFound
