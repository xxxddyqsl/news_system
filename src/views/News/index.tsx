import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { LoginOutlined } from '@ant-design/icons'
// PageHeader 在antd 5.0 中 已废弃组件 单独 安装 yarn add @ant-design/pro-layout 做兼容
import { PageHeader } from '@ant-design/pro-layout'
import { Row, Col, Card, List, Button, Drawer, Form, FloatButton } from 'antd'
// lodash 处理js 数据的 第三方库  如 将 数据 按条件 进行分组 ： _.groupBy(data,item=>item.title) ,解释说明_.groupBy(数据,条件)
import _ from 'lodash'
import { NavLink } from 'react-router-dom'
import Styles from '../../assets/css/tourist-manage/tourist.module.scss'
interface descType {
    publishState: number
}
// 获取 view 或 star 浏览量列表 前10条
const getDescList = async (data: descType) => {
    try {
        const res = await axios({
            url: `/api/tourist/newsList`,
            method: 'get',
            params: data,
            // params:{
            //   publishState:2,//发布状态 ：  小于等于 1 的数据 ，需要 不是 2 、3 未发布上线的数据
            // }
        })
        return res.data.Data
    } catch (err) {
        console.log(err)
    }
}
// 游客访问 组件
export default function Tourist() {
    const [list, setList] = useState<Array<object>>([])
    useEffect(() => {
        // 获取 所有 已发布的新闻
        getDescList({ publishState: 2 }).then((res) => {
            //  将 数据 按条件 进行分组 返回对象
            let data = _.groupBy(res, (item) => item.category.title)
            // 对象没有 map方法 转 二维数组
            let Arr = Object.entries(data)
            // console.log(Arr)
            setList(Arr)
        })
    }, [])
    return (
        <div className={Styles.touristWrapper} >
            <PageHeader
                className="site-page-header"
                //   onBack={() => null}
                title={'全球大新闻'} // 主标题
                subTitle="查看新闻" // 副标题
                extra={[
                    //    悬浮按钮
                    <NavLink to={`/login`} key={'1'}>
                        <FloatButton
                            shape="square"
                            type="primary"
                            tooltip={<>登录</>}
                            style={{ right: 24 }}
                            icon={<LoginOutlined />}
                        />
                    </NavLink>,
                ]}
            ></PageHeader>
            {/* 栅格 */}
            {/* gutter 16单个 左右间距 ，传入数组 为 左右 上下 间距 */}
            <Row gutter={[16, 16]}>
                {list.map((item: any) => (
                    <Col
                    className={ 'touristCol gg-flex-3 gg-flex-2'}
                        span={8}
                        // 取 第0 项 按条件 进行分组 的 新闻大类 title
                        key={item[0]}
                    >
                        <Card className={'touristCard gg-flex-3 gg-flex-2'} bordered={true} hoverable={true} title={item[0]}>
                            <List
                                size="small"
                                // header={<div>Header</div>} // 头部
                                // footer={<div>Footer</div>}底部
                                // bordered 边框
                                pagination={{
                                    pageSize: 5, // 一页 几条数据 可翻页
                                }}
                                // 取 第 1 项 按条件 进行分组 的 新闻大类 下的相关新闻数组列表 传入遍历
                                dataSource={item[1]}
                                renderItem={(data: any) => (
                                    <List.Item>
                                        {/* NavLink 声明式导航 state 方式传入 参数 */}
                                        <NavLink
                                            to={`/tourist/datail/${data.id}`}
                                            // state={{ id: data.id }}
                                        >
                                            {data.title}
                                        </NavLink>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}
