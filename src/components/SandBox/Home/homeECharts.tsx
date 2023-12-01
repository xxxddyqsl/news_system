import React, { RefObject, useCallback, useEffect, useRef } from 'react'
// * as MyECharts 将echarts中使用的东西 导入到 MyECharts
import { Empty } from 'antd';
import * as MyECharts from 'echarts'
// lodash 处理js 数据的 第三方库  如 将 数据 按条件 进行分组 ： _.groupBy(data,item=>item.title) ,解释说明_.groupBy(数据,条件)
import _ from 'lodash'
// 创建ECharts 柱状图表
const CreateEChartsBar = (
    barRef: RefObject<HTMLDivElement>,
    newsCount: Array<newsCountBarType>
) => {
    // 基于准备好的dom，初始化echarts实例
    //   var myChart = MyECharts.init(document.getElementById('main'));
    var myChart = MyECharts.init(barRef.current)
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '新闻分类图示',
        },
        tooltip: {},
        legend: {
            data: ['数量'],
        },
        xAxis: {
            axisLabel: {
                rotate: 45, // 注意： 如果页面宽度 较小 title 可能显示不全 通过 旋转x title倾斜显示
                interval: 0, // title 强制 显示，禁止 宽度 较小 时自动不显示
            },

            //   data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            //通过map 将newsCount 中的每一个元素进行映射 以为数组的形式返回 每一个 title ,设置X轴
            data: newsCount.map((item) => item.title),
        },
        yAxis: {
            minInterval: 1, // 自动计算的坐标轴最小间隔大小。 设置成 1保证坐标轴分割刻度显示成整数。
        },
        series: [
            {
                name: '数量',
                type: 'bar',
                // data: [5, 20, 36, 10, 10, 20]
                // 设置 Y 轴 数据
                data: newsCount.map((item) => item.news_count),
            },
        ],
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    // 监听页面宽度变化
    window.onresize = () => {
        console.log('onresize')
        // 重新渲染 ECharts
        myChart.resize()
    }
}
interface newsCountBarType {
    title: string
    news_count: number
}
interface propsType {
    // 可如上声明属性，也可以将 剩下的属性可通过 任意属性 自定义键值类型（[name]） 和 自定义 键key (key值any任意类型) 如  [propName: string]: any;
    [propName: string]: any
}
interface newsCountPieType{
    name:string;
    value:number
}
// 柱状图
export function BarECharts(props: propsType) {
    const barRef = useRef<HTMLDivElement | null>(null)
    // useCallback(()=>{

    // },[])
    useEffect(() => {
        // 组件销毁时 销毁  上方// 监听页面宽度变化 重新渲染 ECharts
        return () => {
            window.onresize = null
        }
    }, [])
    useEffect(() => {
        // 创建ECharts 柱状图表
        CreateEChartsBar(barRef, props.newsCount)
    }, [props.newsCount])
    return (
        // <div id="main" style={{width:'100%', height: '400px' }}></div>
        <div ref={barRef} style={{ width: '100%', height: '400px' }}></div>
    )
}

//创建ECharts 饼状图表
const CreateEChartsPie = (
    pieRef: RefObject<HTMLDivElement>,
    list: Array<newsCountPieType>
) => {
    // console.log('CreateEChartsPie==>',pieRef.current?.getBoundingClientRect()    )
    // 基于准备好的dom，初始化echarts实例
    //   var myChart = MyECharts.init(document.getElementById('main'));
    var myChart = MyECharts.init(pieRef.current)
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '当前用户新闻分类图示',
            subtext: '纯属虚构',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '发布数量',
                type: 'pie',
                radius: '50%',
                data: list
                // [
                //     { value: 1048, name: 'Search Engine' },
                //     { value: 735, name: 'Direct' },
                //     { value: 580, name: 'Email' },
                //     { value: 484, name: 'Union Ads' },
                //     { value: 300, name: 'Video Ads' },
                // ]
                ,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    // 监听页面宽度变化
    window.onresize = () => {
        console.log('onresize')
        // 重新渲染 ECharts
        myChart.resize()
    }
}

export const PieECharts = (props: propsType) => {
    const pieRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        // 组件销毁时 销毁  上方// 监听页面宽度变化 重新渲染 ECharts
        return () => {
            window.onresize = null
        }
    }, [])
    useEffect(() => {
        if(props.open){
            // 延时0s 只是异步 - 创建ECharts 饼状图表，外层的 Drawer open state状态为异步 ，setTimeout包裹 内 进行状态的异步 则变成同步，否则 pieRef div节点还没有准备好 没有宽高度，就开始渲染 图表
            setTimeout(()=>{
                // 将 数据 按条件 进行分组 ： _.groupBy(data,item=>item.category.title) ,解释说明_.groupBy(数据,条件)
                let currentList =  _.groupBy( props.newsCount,item=>item.category.title);
                let list = [];
                // 取出 key + 数据长度 得出每个类型的新闻 发布的数量
                for(let i in currentList){
                    list.push({
                        name:i,
                        value:currentList[i].length
                    })
                }
                if(list.length>0){
                    CreateEChartsPie(pieRef,list)
                }
            },0)
        }
    }, [props.newsCount,props.open])
    return (
        // <div id="main" style={{width:'100%', height: '400px' }}></div>
        <>
        {props.newsCount.length<=0? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}   />:
        <div ref={pieRef} style={{ width: '100%', height: '400px' }}></div>}
        </>
    )
}
