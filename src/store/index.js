// import {defineStore} from "pinia"
// import initRoutes from "../router/home/TypicalWatershed/index.js"
// //组件之间共享进行菜单栏通信，包括缩放菜单，锚定菜单的位置
// export const menuAction = defineStore('menu-action', {
//     state: ()=>{
//         return {
//             //侧边宽度
//             asideWidth:"300px",
//             isFresh: false,
//             menus: initRoutes,
//             menuClick:false
//         }
//     },
//     actions:{
//         //展开或者缩起侧边栏
//         handleAsideWidth(){
//             this.asideWidth = this.asideWidth === "300px" ? "0" : "300px"
//         },
//         //设置Menu菜单
//         setMenus(menus){
//             this.menus = menus
//         },
//     }
// })
//
// //组件之间进行流域信息的传递，主要是菜单栏操作给特定流域发送信息
// export const InnerMapState = defineStore('inner-map-state', {
//     state: ()=>{
//         return{
//             //查看状态(从什么途径渲染的)
//             boundName: "",
//             //站点的信息集合，包括站点名称、流域中心点 X Y
//             boundInfo:[],
//         }
//     },
//     actions: {
//         //设置即将绘制的流域的信息
//         setBoundInfo(bound, centerX, centerY){
//             let one = {
//                 bound: bound,
//                 centerX: centerX,
//                 centerY: centerY
//             }
//             this.boundInfo.push(one)
//         }
//     }
// })
