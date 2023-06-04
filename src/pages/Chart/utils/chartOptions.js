let mytextStyle = {  //定义自己的文本格式变量
    color: "black",  //设置文字颜色
    fontStyle: "normal",  //italic斜体oblique倾斜
    fontWeight: "500",  //设置文字粗细bold|bolder|lighter|100|200|300|400..
    fontSize: 18,  //设置字体大小
}

let option = {
    //需要加入标题，但是位置有待商榷
    title: {  //配置标题组件
        show: true,  //设置标题组件是否显示
        text: "XX流域",  //设置主标题，动态传入流域名称和站点名称
        // subtext:"XX站点",  //设置副标题，动态传入这是请求的什么类型的图
        subtextStyle:{
          fontSize:12
        },
        textAlign: "center",  //设置文本水平对齐
        textBaseline: "top",  //设置文本垂直对齐
        textStyle: mytextStyle,  //设置标题样式
        padding: 6,  //设置标题内边距
        itemGap: 5,  //设置主副标题间距
        left: "8%",  //设置组件离容器左侧的距离，'left'，'center'，'right'，'20%'
        top: "1%",  //设置组件离容器上侧的距离，'top'，'middle'，'bottom'，'20%'
    },
    grid:{},
    legend: {},
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type:'shadow'
        },
        position: [50, 20]
    },
    toolbox: {  //配置工具箱组件
        show: true,  //设置是否显示工具箱组件
        orient: 'horizontal',  //设置布局方式，默认为水平布局，可选:'horizontal'¦'vertical'
        //设置水平安放位置，默认为右对齐；
        //可选:'center'¦'left'¦'right'¦{number}（x坐标，单位px）
        x: 'right',
        y: 'top',
        padding: 5,  //设置工具箱内边距，单位px，默认各方向内边距为5
        showTitle: true,
        feature: {
            magicType: {  //设置动态类型切换
                show: true,
                title: {
                    line: '动态类型切换-折线图',
                    bar: '动态类型切换-柱状图',
                    stack: '动态类型切换-堆积',
                    tiled: '动态类型切换-平铺'
                },
                type: ['line', 'bar', 'stack', 'tiled']
            },
            restore: {  //设置数据重置
                show: true, title: '还原', color: 'black'
            },
            saveAsImage: {  //设置导出图片
                show: true, title: '保存为图片',
                type: 'jpeg', lang: ['单击本地保存']
            },
            //需要自定义以下方法:
            // 保存当前页面图表下的数据
            // 可以在当前图表下面画线，清空和辅助等
            // myTool: {  //设置自定义工具按钮
            //     show: true, title: '自定义扩展方法',
            //     //设置改变默认的图标为一个特定的图标
            //     onclick: function () { alert('广科院,大数据与人工智能学院') }
            // }
        }
    },
    dataZoom: [{
        type: 'inside',
        realtime: true,
        startValue: 0,
        endValue: 10,
        xAxisIndex:[0,1]
    }],
    //实现两个坐标轴联动
    axisPointer: {
        link: [{
            xAxisIndex: 'all'
        }]
    },
    xAxis: {},
    yAxis: {},
    series: []
}

let oneOption = {
    legend: {
        type:'scroll',
        width:'600',
        orient: 'horizontal',  //'vertical'
        x: 'center',  //'center'|'left'|{number} 位置居中
        y: 'top',  //'center'|'bottom'|{number}  位于顶部
        backgroundColor: '#eee',
        padding: 10,
        itemGap: 20,
        data:[]  //需要动态传入
    },
    grid:{
        show:false,
        x:45, y:66,
        width:'93%',
        height:'80%'
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        data:[]
    },
    yAxis:{
        type:"value"
    },
}

let twoOption = {
    legend: {
        type:'scroll',
        width:'600',
        orient: 'horizontal',  //'vertical'
        x: 'center',  //'center'|'left'|{number} 位置居中
        y: 'top',  //'center'|'bottom'|{number}  位于顶部
        backgroundColor: '#eee',
        padding: 10,
        itemGap: 20,
        data:[]  //需要动态传入
    },
    grid: [
        {
            left: 60,
            right: 50,
            height: '37%'
        },
        {
            left: 60,
            right: 50,
            top: '57%',
            height: '37%'
        }
    ],
    xAxis: [
        {
            gridIndex:0,
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: true },
            data: []  //需要动态传入
        },
        {
            gridIndex: 1,
            type: 'category',
            boundaryGap: false,
            axisLine: { onZero: true },
            data: [], //需要动态传入
            position: 'top'
        }
    ],
    yAxis: [
        {
            gridIndex: 0,
            type: 'value',
        },
        {
            gridIndex: 1,
            type: 'value',
            inverse: true
        }
    ],
}

/**
 * 用来组装Option,使其能够灵活地满足一个图表的绘制或者两个图表的绘制
 * @param number 需要绘制的图表数量
 * 如果为 1 说明只需要绘制一个图表，
 * 如果为 2 说明需要绘制两个图表
 */
export function assembleOption(number= 1) {
    if (number === 1) {
        option.legend = oneOption.legend
        option.xAxis = oneOption.xAxis
        option.yAxis = oneOption.yAxis
        option.grid = oneOption.grid
    } else {
        option.legend = twoOption.legend
        option.xAxis = twoOption.xAxis
        option.yAxis = twoOption.yAxis
        option.grid = twoOption.grid
    }
    return option
}







