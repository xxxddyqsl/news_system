import React, { useEffect, useMemo, useState } from 'react'
import {
    BarChartOutlined,
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
    HeartTwoTone,
    StarTwoTone,
    UserOutlined,
    FundViewOutlined,
    PieChartOutlined,
} from '@ant-design/icons'
import { Row, Col, Card, List, Avatar, Drawer, Form, Tooltip } from 'antd'
import { useHome } from '../../../components/SandBox/Home/useHome'
import { NavLink } from 'react-router-dom'
import {
    BarECharts,
    PieECharts,
} from '../../../components/SandBox/Home/homeECharts'
import MyModal from '../../../components/modal'
import MyForm from '../../../components/form'
import { SetUserInfo } from '../../../components/users-manage/userForm'
import { BASE_URL } from '../../../util/request_http'
const { Meta } = Card

export default function Home() {
    // antd 内部封装的 获取form 表单函数 ， form 返回一个对象 内包含了 submit 提交 ，获取value 等等函数
    const [updateForm] = Form.useForm()

    const {
        viewList,
        starList,
        allList,
        userInfo,
        newsCount,
        open,
        showDrawer,
        onClose,
        useOpen,
        showUpUser,
        handleUpdateOk,
        fileList,
        setFileList,
    } = useHome()
    return (
        <>
            {/* 栅格 */}
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card
                        title={
                            <>
                                用户最常浏览
                                <BarChartOutlined
                                    style={{ marginLeft: '16px' }}
                                ></BarChartOutlined>
                            </>
                        }
                        bordered={true}
                    >
                        <List
                            size="small"
                            // header={<div>Header</div>} // 头部
                            // footer={<div>Footer</div>}底部
                            // bordered 边框
                            dataSource={viewList}
                            renderItem={(item) => (
                                <List.Item>
                                    {/* NavLink 声明式导航 state 方式传入 参数 */}
                                    <NavLink
                                        to={`/news-manage/preview`}
                                        state={{ id: item.id }}
                                    >
                                        {item.title}
                                    </NavLink>

                                    <span style={{ marginLeft: 'auto' }}>
                                        <Tooltip //文字提示气泡框
                                            title={'浏览量 ' + item.view}
                                            color={'blue'}
                                        >
                                            <FundViewOutlined
                                                style={{
                                                    marginRight: '8px',
                                                    color: '#1677ff',
                                                }}
                                            />
                                            {item.view}
                                        </Tooltip>
                                    </span>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        title={
                            <>
                                用户点赞最多
                                <BarChartOutlined
                                    style={{ marginLeft: '16px' }}
                                ></BarChartOutlined>
                            </>
                        }
                        bordered={true}
                    >
                        <List
                            size="small"
                            // header={<div>Header</div>} // 头部
                            // footer={<div>Footer</div>}底部
                            // bordered 边框
                            dataSource={starList}
                            renderItem={(item) => (
                                <List.Item>
                                    {/* NavLink 声明式导航 state 方式传入 参数 */}
                                    <NavLink
                                        to={`/news-manage/preview`}
                                        state={{ id: item.id }}
                                    >
                                        {item.title}
                                    </NavLink>
                                    <span style={{ marginLeft: 'auto' }}>
                                        <Tooltip //文字提示气泡框
                                            title={'点赞量 ' + item.star}
                                            color={'pink'}
                                        >
                                            <HeartTwoTone
                                                twoToneColor="#eb2f96"
                                                style={{ marginRight: '8px' }}
                                            />
                                            {item.star}
                                        </Tooltip>
                                    </span>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        // style={{ width: 300 }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <PieChartOutlined
                                key="setting"
                                onClick={showDrawer}
                            />,
                            // <SettingOutlined key="setting" />,
                            <EditOutlined
                                key="edit"
                                onClick={() => showUpUser(true, updateForm)}
                            />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={
                                userInfo.avatar ? (
                                    <Avatar src={BASE_URL + userInfo.avatar} />
                                ) : (
                                    <Avatar
                                        size="large"
                                        icon={<UserOutlined />}
                                    />
                                )
                            }
                            title={userInfo.username}
                            description={
                                <div>
                                    <b>
                                        {userInfo.region === ''
                                            ? '全球'
                                            : userInfo.region}
                                    </b>
                                    <span style={{ marginLeft: '16px' }}>
                                        {userInfo.roles.roleName}
                                    </span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <Drawer
                width={500}
                title="个人新闻分类"
                placement="right"
                onClose={onClose}
                open={open}
            >
                {/* ECharts 图表部分  饼状图 - 优化 open 状态异步 在 open 为true时 在渲染 饼状图组件*/}
                <PieECharts newsCount={allList} open={open}></PieECharts>
            </Drawer>
            {/* ECharts 图表部分  柱状图*/}
            <BarECharts newsCount={newsCount}></BarECharts>

            <MyModal
                open={useOpen}
                title={'修改个人信息'}
                okText={'提交'}
                cancelText={'取消'}
                onCreate={(values: any) => {
                    showUpUser(false)
                    //  model  关闭 清空 文件上传input fileList 状态
                    setFileList([])
                }}
                onOk={() => handleUpdateOk(updateForm)}
                onCancel={() => {
                    // 取消
                    showUpUser(false)
                    //  model  关闭 清空 文件上传input fileList 状态
                    setFileList([])
                    // 清空 表单 数据
                    updateForm.resetFields()
                }}
                childrenArr={[
                    <MyForm layout={'vertical'} form={updateForm}>
                        <SetUserInfo
                            userInfo={userInfo}
                            fileList={fileList}
                            setFileList={setFileList}
                        ></SetUserInfo>
                    </MyForm>,
                ]}
            ></MyModal>
        </>
    )
}
