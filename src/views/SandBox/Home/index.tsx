import React, { useEffect, useMemo } from 'react'
import {
    BarChartOutlined,
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
    HeartTwoTone,
    StarTwoTone,
    PieChartOutlined,
} from '@ant-design/icons'
import { Row, Col, Card, List, Avatar,Drawer } from 'antd'
import { useHome } from '../../../components/SandBox/Home/useHome'
import { NavLink } from 'react-router-dom'
import {HomeEChartsBar,HomeEChartsPie} from '../../../components/SandBox/Home/homeECharts'
const { Meta } = Card

export default function Home() {
    const { viewList, starList, userInfo,newsCount,open, showDrawer,  onClose } = useHome()
    return (
        <>
            {/* 栅格 */}
            <Row gutter={16}>
                <Col span={8}>
                    <Card
                        title={`用户最常浏览 ${(
                            <BarChartOutlined></BarChartOutlined>
                        )}`}
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
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
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
                                        <span style={{ marginLeft: '20px' }}>
                                            <HeartTwoTone twoToneColor="#eb2f96" />
                                            {item.star}
                                        </span>
                                    </NavLink>
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
                            <PieChartOutlined   key="setting" onClick={showDrawer}/>,
                            // <SettingOutlined key="setting" />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={
                                <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
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
            <Drawer width={500} title="Basic Drawer" placement="right" onClose={onClose} open={open}>
                 {/* ECharts 图表部分  饼状图*/}
                <HomeEChartsPie newsCount={newsCount}></HomeEChartsPie>
            </Drawer>
            {/* ECharts 图表部分  柱状图*/}
            <HomeEChartsBar newsCount={newsCount}></HomeEChartsBar>
        </>
    )
}
