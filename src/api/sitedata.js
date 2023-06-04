import axios from '~/axios'

/**
 * 用来获取所有站点的信息，包括名称 坐标等等
 * @return {*} 返回一个 json对象
 */
export function getSiteInfo(){
    return axios.get('/shiLiang/stations/')
}


// /**
//  * 用来获得水文数据，包括湿度、日照、气压、气温
//  * @param time 用来获取数据的时间跨度，比如 年数据、月数据、日数据
//  * @param type 用来获得水文数据，包括湿度、日照、气压、气温
//  * @param raid 需要查询的站点
//  * @return {Promise<AxiosResponse<any>>} 返回的请求对象，即res
//  */
// export function getSiteData(time, type, raid){
//     return axios.get('/weaSt' + '/' + time + "" + type + '/' + raid)
// }

/**
 * 用来获得水文数据，包括湿度、日照、气压、气温
 * @param type 用来获得水文数据，包括湿度、日照、气压、气温
 * @param stationName 需要查询的站点
 * @return {Promise<AxiosResponse<any>>} 返回的请求对象，即res
 */
export function getSiteData(type, stationName){
    return axios.get('/shiLiang' + '/station' + type + '/' + stationName)
}
