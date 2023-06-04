import {router} from "~/router"
import {hideFullLoading, showFullLoading} from "./plugins/utils.js";

//全局前置守卫
router.beforeEach((to, from,next)=>{
    //显示 Loading
    showFullLoading()
    //动态添加标题
    document.title = "水文云  " + (to.meta.title ? to.meta.title : "")
    //所有操作执行完成之后进行跳转
    next()
})

//全局后置守卫
router.afterEach((to, from)=>{
    hideFullLoading()
})

