import {getSiteData} from "../../../api/sitedata.js";
import {showMessage} from "../../../plugins/utils.js";

/**
 * 基于日期对数组进行排序的函数
 * @param dataSorted 需要进行排序数组
 * @return dataSorted 已经排好序的数组
 */
function sortByData(dataSorted){
    let timeType = dataSorted[0].split('-').length
    if(timeType === 1){  //说明这是一个年比较函数,因为没有 '-'
        dataSorted.sort((a,b) => {
            a = a.split("-")
            b = b.split("-")
            return (parseInt(a)-parseInt(b))
        })
    }else if(timeType === 2){ //说明这是一个月比较函数,因为有一个'-'
        dataSorted.sort((a,b) => {
            a = a.split("-")
            b = b.split("-")
            return (parseInt(a[0])-parseInt(b[0]) || parseInt(a[1])-parseInt(b[1]))
        })
    }else if(timeType === 3){ //说明这是一个日比较函数,因为有两个'-'
        dataSorted.sort((a,b) => {
            a = a.split("-")
            b = b.split("-")
            return (parseInt(a[0])-parseInt(b[0]) ||
                parseInt(a[1])-parseInt(b[1])) || parseInt(a[2])-parseInt(b[2])
        })
    }

    return dataSorted
}


/**
 * 维护一张数据表格,保证将传递过来的键映射成对应的文本内容
 * @param type 需要映射的键
 * @return dataRelated 最终返回的文本内容，是个字符串
 */
function relateMapping(type){
    let Map= [
        {
            text: '藻密度(单位:万cell/L)',
            value: "AlgaeDensity"
        },{
            text:'氨氮含量(单位:mg/L)',
            value: 'AmmoniaNitrogen'
        },{
            text:'叶绿素(单位:ug/L)',
            value:'Chlorophyll'
        },{
            text:'色度(单位:度)',
            value: 'Chroma'
        },{
            text:'COD(单位:mg/L)',
            value: 'COD'
        },{
            text:'溶解氧(单位:mg/L)',
            value: 'DissolvedOxygen'
        },{
            text:'流量(单位:m^3/s)',
            value: 'Flow'
        },{
            text:'高锰酸钾指数(单位:mg/L)',
            value: 'KMnO4Index'
        },{
            text:'硝酸盐氮(单位:mg/L)',
            value: 'NitrateNitrogen'
        },{
            text:'PH值',
            value: 'PH'
        },{
            text:'总氮(单位:mg/L)',
            value: 'TotalNitrogen'
        },{
            text:'总磷(单位:mg/L)',
            value: 'TotalPhosphorus'
        },{
            text:'水温(单位：摄氏度)',
            value: 'WaterTemperature'
        }]
    //最终要返回的数据，即中文含义的数组
    let dataRelated

    //依次遍历数据，得到翻译后的数组
    for(let i=0; i<Map.length; i++){
        if(Map[i].value === type){
            dataRelated = Map[i].text
            break
        }
    }
    return dataRelated
}


/**
 * 这里是根据 站点编号 和 查询类型(如日照、气温等)获取数据，并且对数据进行处理
 * @param type 查询类型: 降水、风速、气温、日照、湿度、气压
 * @param raid 站点编号，分为气象站和水文站
 */
async function queryData(type, raid){
    let data= null
    await getSiteData(type, raid).then(async (res) => {
        data = filterData(res, type);
    }).catch(()=>{
        showMessage("该站点没有数据信息!", "error")
    })
    return data
}


/**
 * 对请求过来的数据进行统一的处理
 * @param res 响应传递过来的数据
 * @param type 规定这是一个什么类型的数据
 * @return data 返回一个二维数组，
 *      第一个数组xAxis是x轴数据，
 *      第二个数组series依次是该属性下各种样式的数据(比如最大值 最小值 平均值等等)
 *      第三个数组legend就是与上面各种属性对应的提示信息
 */
export function filterData(res, type){
    //先拿到所有的键值，这样就能精准对应提示信息
    let keys = Object.keys(res.data.data)

    //这是需要返回的数据
    let data = {
        xAxis:[], //x轴
        series:new Array(keys.length),  //数据
        legend: relateMapping(type)
    }
    //注意这里需要基于日期的排序
    //这里就是根据每一个数据项，我都要拿到内部的日期，并且对这个日期进行排序
    let dataSorted = sortByData(keys)
    //这里的dataSorted就是排好序的日期，也就是x轴的数据,注意深拷贝
    data.xAxis = dataSorted.slice(0)
    for(let temp=0; temp<keys.length; temp++){
        data.series[temp] = res.data.data[keys[temp]]
    }
    return data
}


/**
 * 将得到的所有数据都传入到option里面用来绘图，一个图表的情况
 * @param option 传入的需要设置的option
 * @param type 查询类型: 降水、风速、气温、日照、湿度、气压
 * @param raid 站点编号，分为气象站和水文站
 // * @param startValue 起始时间
 // * @param endValue 终止时间
 * @return {Promise<void>} 返回已经注入数据的option
 */
export async function injectOneOption(option, type, raid){
    let data = await queryData(type, raid)

    option.xAxis.data = data.xAxis
    option.legend.data = [data.legend]
    option.series = {
                name: data.legend,
                type: 'line',
                symbolSize: 3,
                data: data.series
            }

    option.dataZoom[0].endValue = data.xAxis.length
    return option

    // for(let i=0; i<data.series.length; i++){
    //     let one = {
    //         name: data.legend[i],
    //         type: 'line',
    //         symbolSize: 3,
    //         data: data.series[i]
    //     }
    //     option.series.push(one)
    // }
    //注意这里需要设置缩放(没有很好的办法)
    // if(time === 'year'){
    //     option.xAxis.data = data.xAxis
    //     option.legend.data = data.legend
    //     option.series = []
    //     for(let i=0; i<data.series.length; i++){
    //         let one = {
    //             name: data.legend[i],
    //             type: 'line',
    //             symbolSize: 3,
    //             data: data.series[i]
    //         }
    //         option.series.push(one)
    //     }
    //     //注意这里需要设置缩放(没有很好的办法)
    //     option.dataZoom[0].endValue = data.xAxis.length
    // }
    // else if(time === 'month'){
    //     option.xAxis.data = data.xAxis[1]
    //     option.legend.data = data.legend[1]
    //     option.series = []
    //     for(let i=0; i<data.series[1].length; i++){
    //         let one = {
    //             name: data.legend[1][i],
    //             type: 'line',
    //             symbolSize: 3,
    //             data: data.series[1][i]
    //         }
    //         option.series.push(one)
    //     }
    //     //注意这里需要设置缩放(没有很好的办法)
    //     option.dataZoom[0].endValue = data.xAxis[1].length
    // }
    // else if(time === 'day'){
    //     option.xAxis.data = data.xAxis[2]
    //     option.legend.data = data.legend[2]
    //     option.series = []
    //     for(let i=0; i<data.series[2].length; i++){
    //         let one = {
    //             name: data.legend[2][i],
    //             type: 'line',
    //             symbolSize: 4,
    //             data: data.series[2][i]
    //         }
    //         option.series.push(one)
    //     }
    //     //注意这里需要设置缩放(没有很好的办法)
    //     option.dataZoom[0].endValue = data.xAxis[2].length
    // }
}


/**
 * 将得到的所有数据都传入到option里面用来绘图，两个图表的情况
 * @param option 传入的需要设置的option
 * @param type 查询类型: 降水、风速、气温、日照、湿度、气压
 * @param raid 站点编号，分为气象站和水文站
 * @return {Promise<void>} 返回已经注入数据的option
 */
export async function injectTwoOption(option, type, raid){
    // console.log(option)
    option.series = []
    option.legend.data = []
    for(let index=0; index<2; index++){
        let data = await queryData(type[index], raid)
        option.xAxis[index].data = data.xAxis
        option.legend.data.push.apply(option.legend.data, [data.legend])
        option.series.push({
            name: data.legend,
            type: 'line',
            xAxisIndex: index,
            yAxisIndex: index,
            symbolSize: 2,
            // prettier-ignore
            data: data.series
        })

        // for (let i = 0; i < data.series.length; i++) {
        //     let one = {
        //         name: data.legend[i],  //需要动态传入
        //         type: 'line',
        //         xAxisIndex: index,
        //         yAxisIndex: index,
        //         symbolSize: 2,
        //         // prettier-ignore
        //         data: data.series[i]
        //     }
        //     option.series.push(one)
        // if(time === 'year') {
        //     option.xAxis[index].data = data.xAxis
        //     option.legend.data.push.apply(option.legend.data, data.legend)
        //     for (let i = 0; i < data.series.length; i++) {
        //         let one = {
        //             name: data.legend[i],  //需要动态传入
        //             type: 'line',
        //             xAxisIndex: index,
        //             yAxisIndex: index,
        //             symbolSize: 2,
        //             // prettier-ignore
        //             data: data.series[i]
        //         }
        //         option.series.push(one)
        //     }
        //     //设置缩放
        //     option.dataZoom[0].endValue = data.xAxis.length
        // }
        // else if(time === 'month'){
        //     option.xAxis[index].data = data.xAxis[1]
        //     option.legend.data.push.apply(option.legend.data, data.legend[1])
        //     for(let i=0; i<data.series[1].length; i++){
        //         let one = {
        //             name: data.legend[1][i],
        //             type: 'line',
        //             xAxisIndex: index,
        //             yAxisIndex: index,
        //             symbolSize: 2,
        //             data: data.series[1][i]
        //         }
        //         option.series.push(one)
        //     }
        //     //设置缩放
        //     option.dataZoom[0].endValue = data.xAxis[1].length
        // }
        // else if(time === 'day'){
        //     option.xAxis[index].data = data.xAxis[2]
        //     option.legend.data.push.apply(option.legend.data, data.legend[2])
        //     for(let i=0; i<data.series[2].length; i++){
        //         let one = {
        //             name: data.legend[2][i],
        //             type: 'line',
        //             xAxisIndex: index,
        //             yAxisIndex: index,
        //             symbolSize: 2,
        //             data: data.series[2][i]
        //         }
        //         option.series.push(one)
        //     }
        //     //设置缩放
        //     option.dataZoom[0].endValue = data.xAxis[2].length

    }
    return option
}

/**
 * 获取统计信息，目前只有均值
 * @param statistic 需要在这个基础上进行修改
 * @param series 传入的一系列数据，包含了 name data等值
 * @param startValue 截取的数据的起点
 * @param endValue 截取的数据的终点
 */
export function getStatistic(statistic, series, startValue, endValue){
    statistic.splice(0, statistic.length)
    // console.log("startValue:",startValue)
    // console.log("endValue:",endValue)
    if(series.length === 2) {
        //对每一个属性都需要求平均值
        for(let i=0; i<series.length; i++){
            //根据dataZoom获得截取的数据
            let dataSlice = null;
            if(endValue === startValue)
                dataSlice = series[i].data.slice(startValue, endValue+1)
            else
                dataSlice = series[i].data.slice(startValue, endValue+1)
            //对数据求均值
            let res = dataSlice.reduce((sum, value)=>{
                return sum + value}, 0) / dataSlice.length
            //输入统计信息
            statistic.push({
                name : series[i].name,
                data : res.toFixed(3)
            })
        }
    }else{
        let dataSlice = series.data.slice(startValue, endValue+1)
        //对数据求均值
        let res = dataSlice.reduce((sum, value)=>{
            return sum + value}, 0) / dataSlice.length
        //输入统计信息
        statistic.push({
            name : series.name,
            data : res.toFixed(3)
        })
    }
}


