import React, { RefObject, useCallback, useEffect, useRef } from 'react'
// * as MyECharts 将echarts中使用的东西 导入到 MyECharts
import * as MyECharts from 'echarts'
const CreateECharts = (
    barRef: RefObject<HTMLDivElement>,
    newsCount: Array<newsCountType>
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
            rotate:45,// 注意： 如果页面宽度 较小 title 可能显示不全 通过 旋转x title倾斜显示
            interval:0, // title 强制 显示，禁止 宽度 较小 时自动不显示
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
    myChart.setOption(option);
    // 监听页面宽度变化
    window.onresize=()=>{
        console.log('onresize')
        // 重新渲染 ECharts
        myChart.resize()
    }
}
interface newsCountType {
    title: string
    news_count: number
}
interface propsType {
    // 可如上声明属性，也可以将 剩下的属性可通过 任意属性 自定义键值类型（[name]） 和 自定义 键key (key值any任意类型) 如  [propName: string]: any;
    [propName: string]: any
}

export default function HomeECharts(props: propsType) {
    const barRef = useRef<HTMLDivElement | null>(null)
    // useCallback(()=>{

    // },[])
    useEffect(() => {
        // 组件销毁时 销毁  上方// 监听页面宽度变化 重新渲染 ECharts
        return ()=>{
            window.onresize = null;
        }
    },[])
    useEffect(() => {
        // 创建ECharts 图表
        CreateECharts(barRef, props.newsCount)
    }, [props.newsCount])
    return (
        // <div id="main" style={{width:'100%', height: '400px' }}></div>
        <div ref={barRef} style={{ width: '100%', height: '400px' }}></div>
    )
}
